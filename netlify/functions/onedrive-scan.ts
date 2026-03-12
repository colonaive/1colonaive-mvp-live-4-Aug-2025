import fetch from "node-fetch";

// ---------- config ----------

const tenant = process.env.OUTLOOK_TENANT_ID;
const clientId = process.env.OUTLOOK_CLIENT_ID;
const clientSecret = process.env.OUTLOOK_CLIENT_SECRET;
const ONEDRIVE_USER = "admin@saversmed.com";

// Strategic vault folder mapping (business-entity oriented)
const VAULT_FOLDERS = [
  "Corporate",
  "ColonAiQ",
  "ColonAiVE",
  "Durmah",
  "SG-Renovate-AI",
  "Templates",
] as const;

type VaultCategory = (typeof VAULT_FOLDERS)[number];

// ---------- classification rules ----------

interface ClassificationRule {
  category: VaultCategory;
  keywords: string[];
  extensions?: string[];
}

const CLASSIFICATION_RULES: ClassificationRule[] = [
  {
    category: "Corporate",
    keywords: [
      "acra", "bizfile", "business profile", "shareholder", "agm",
      "annual general", "board resolution", "company secretary",
      "incorporation", "memorandum", "articles of association",
      "director", "statutory", "corporate", "saver", "saversmed",
      "bank statement", "financial statement", "audit", "tax",
      "invoice", "receipt", "payroll", "employment", "hr",
    ],
  },
  {
    category: "ColonAiQ",
    keywords: [
      "colonaiq", "colon aiq", "singlera", "septin9", "bcat1",
      "ikzf1", "bcan", "vav3", "methylation", "hsa", "cdsco",
      "nmpa", "ce ivd", "ivdr", "regulatory", "submission",
      "clinical trial", "clinical study", "protocol", "ethics",
      "lab report", "validation", "angsana", "ktph", "distributor",
      "distribution agreement", "nda", "mou", "skv solution",
      "futurz", "import license", "fsc", "certificate",
    ],
  },
  {
    category: "ColonAiVE",
    keywords: [
      "colonaive", "colon aive", "crc screening", "crc awareness",
      "colorectal cancer", "screening movement", "campaign",
      "champion", "corporate screening", "brochure", "flyer",
      "poster", "presentation", "pitch deck", "investor",
      "term sheet", "cap table", "valuation", "moh", "ministry",
      "government", "policy", "francis seow", "eu kong",
      "lawrence ho", "marketing",
    ],
  },
  {
    category: "Durmah",
    keywords: [
      "durmah", "caseway", "legal learning", "lnat", "durham",
      "law student", "legal lexicon", "assignment support",
      "university learning", "durmah learning",
    ],
  },
  {
    category: "SG-Renovate-AI",
    keywords: [
      "sg renovate", "renovation", "contractor", "milestone",
      "escrow", "hdb", "bca", "defect", "variation",
    ],
  },
  {
    category: "Templates",
    keywords: ["template", "boilerplate", "draft", "blank form"],
    extensions: [".dotx", ".dotm", ".xltx", ".potx"],
  },
];

// ---------- types ----------

interface DriveItem {
  id: string;
  name: string;
  size?: number;
  lastModifiedDateTime: string;
  webUrl?: string;
  file?: { mimeType: string; hashes?: { sha256Hash?: string } };
  folder?: { childCount: number };
  parentReference?: { path?: string };
}

interface ScannedFile {
  id: string;
  name: string;
  path: string;
  size: number;
  mimeType: string;
  lastModified: string;
  webUrl: string;
  category: VaultCategory | "Unclassified";
  confidenceScore: number;
  isDuplicate: boolean;
  duplicateOf?: string;
  isLatestVersion: boolean;
}

interface ScanReport {
  scannedAt: string;
  user: string;
  totalFilesScanned: number;
  totalFoldersScanned: number;
  duplicatesDetected: number;
  latestVersionsSelected: number;
  categoryCounts: Record<string, number>;
  vaultStructure: Record<string, ScannedFile[]>;
  duplicates: Array<{ file: string; duplicateOf: string; path: string }>;
  unclassified: ScannedFile[];
  errors: string[];
}

// ---------- auth ----------

async function getAccessToken(): Promise<string> {
  if (!tenant || !clientId || !clientSecret) {
    throw new Error("Missing OUTLOOK_TENANT_ID, OUTLOOK_CLIENT_ID, or OUTLOOK_CLIENT_SECRET");
  }

  const url = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("scope", "https://graph.microsoft.com/.default");
  params.append("grant_type", "client_credentials");

  const res = await fetch(url, { method: "POST", body: params });
  const data = (await res.json()) as Record<string, string>;

  if (!data.access_token) {
    throw new Error(`Auth failed: ${data.error_description || data.error || "unknown"}`);
  }
  return data.access_token;
}

// ---------- graph helpers ----------

async function listDriveChildren(
  token: string,
  itemPath: string
): Promise<DriveItem[]> {
  const base = `https://graph.microsoft.com/v1.0/users/${ONEDRIVE_USER}/drive`;
  const url = itemPath === "root"
    ? `${base}/root/children?$top=200`
    : `${base}/root:/${encodeURIComponent(itemPath)}:/children?$top=200`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Graph API ${res.status}: ${err}`);
  }

  const data = (await res.json()) as { value?: DriveItem[] };
  return data.value || [];
}

async function scanFolder(
  token: string,
  folderPath: string,
  depth: number,
  maxDepth: number
): Promise<{ files: DriveItem[]; folderCount: number }> {
  if (depth > maxDepth) return { files: [], folderCount: 0 };

  const items = await listDriveChildren(token, folderPath);
  let files: DriveItem[] = [];
  let folderCount = 0;

  for (const item of items) {
    if (item.folder) {
      folderCount++;
      const subPath = folderPath === "root"
        ? item.name
        : `${folderPath}/${item.name}`;
      const sub = await scanFolder(token, subPath, depth + 1, maxDepth);
      files = files.concat(sub.files);
      folderCount += sub.folderCount;
    } else if (item.file) {
      // Attach full path for classification
      const fullPath = folderPath === "root"
        ? item.name
        : `${folderPath}/${item.name}`;
      item.parentReference = { path: fullPath };
      files.push(item);
    }
  }

  return { files, folderCount };
}

// ---------- classification ----------

function classifyFile(file: DriveItem): { category: VaultCategory | "Unclassified"; score: number } {
  const nameLC = (file.name || "").toLowerCase();
  const pathLC = (file.parentReference?.path || "").toLowerCase();
  const searchText = `${nameLC} ${pathLC}`;

  let bestCategory: VaultCategory | "Unclassified" = "Unclassified";
  let bestScore = 0;

  for (const rule of CLASSIFICATION_RULES) {
    let score = 0;

    for (const kw of rule.keywords) {
      if (searchText.includes(kw)) {
        score += kw.length; // longer keyword matches = higher confidence
      }
    }

    // Bonus for matching template extensions
    if (rule.extensions) {
      for (const ext of rule.extensions) {
        if (nameLC.endsWith(ext)) score += 10;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestCategory = rule.category;
    }
  }

  return { category: bestCategory, score: bestScore };
}

// ---------- duplicate detection ----------

function detectDuplicates(files: ScannedFile[]): void {
  // Group by normalized base name (strip version suffixes, dates, copy markers)
  const groups = new Map<string, ScannedFile[]>();

  for (const f of files) {
    const base = f.name
      .toLowerCase()
      .replace(/\s*\(\d+\)\s*/g, "")       // Remove " (1)", " (2)" etc.
      .replace(/\s*-\s*copy\s*/gi, "")      // Remove "- Copy"
      .replace(/\s*v\d+(\.\d+)?\s*/gi, "") // Remove "v1", "v2.1"
      .replace(/\s*_\d{6,}\s*/g, "")        // Remove date stamps like _20260313
      .replace(/\s+/g, " ")
      .trim();

    if (!groups.has(base)) groups.set(base, []);
    groups.get(base)!.push(f);
  }

  for (const [, group] of groups) {
    if (group.length < 2) continue;

    // Sort by lastModified descending — first item is latest
    group.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());

    group[0].isLatestVersion = true;

    for (let i = 1; i < group.length; i++) {
      group[i].isDuplicate = true;
      group[i].duplicateOf = group[0].name;
      group[i].isLatestVersion = false;
    }
  }
}

// ---------- handler ----------

export async function handler() {
  const errors: string[] = [];

  try {
    const token = await getAccessToken();

    // Scan OneDrive recursively (max 4 levels deep to avoid timeout)
    const { files: rawFiles, folderCount } = await scanFolder(token, "root", 0, 4);

    // Classify each file
    const scannedFiles: ScannedFile[] = rawFiles.map((item) => {
      const { category, score } = classifyFile(item);
      const filePath = item.parentReference?.path || item.name;

      return {
        id: item.id,
        name: item.name,
        path: filePath,
        size: item.size || 0,
        mimeType: item.file?.mimeType || "unknown",
        lastModified: item.lastModifiedDateTime,
        webUrl: item.webUrl || "",
        category,
        confidenceScore: score,
        isDuplicate: false,
        isLatestVersion: true,
      };
    });

    // Detect duplicates and latest versions
    detectDuplicates(scannedFiles);

    // Build vault structure
    const vaultStructure: Record<string, ScannedFile[]> = {};
    for (const folder of VAULT_FOLDERS) {
      vaultStructure[folder] = scannedFiles
        .filter((f) => f.category === folder && f.isLatestVersion && !f.isDuplicate)
        .sort((a, b) => b.confidenceScore - a.confidenceScore);
    }

    // Category counts
    const categoryCounts: Record<string, number> = {};
    for (const f of scannedFiles) {
      categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
    }

    // Duplicate list
    const duplicates = scannedFiles
      .filter((f) => f.isDuplicate)
      .map((f) => ({ file: f.name, duplicateOf: f.duplicateOf || "", path: f.path }));

    // Unclassified files
    const unclassified = scannedFiles.filter((f) => f.category === "Unclassified");

    // Build report
    const report: ScanReport = {
      scannedAt: new Date().toISOString(),
      user: ONEDRIVE_USER,
      totalFilesScanned: scannedFiles.length,
      totalFoldersScanned: folderCount,
      duplicatesDetected: duplicates.length,
      latestVersionsSelected: scannedFiles.filter((f) => f.isLatestVersion && !f.isDuplicate).length,
      categoryCounts,
      vaultStructure,
      duplicates,
      unclassified,
      errors,
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report, null, 2),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "OneDrive scan failed";
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: message,
        hint: "Ensure OUTLOOK_TENANT_ID, OUTLOOK_CLIENT_ID, OUTLOOK_CLIENT_SECRET are set and the Azure app has Files.Read.All permission.",
      }),
    };
  }
}
