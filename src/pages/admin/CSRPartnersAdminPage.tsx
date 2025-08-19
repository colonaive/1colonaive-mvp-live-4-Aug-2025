// /src/pages/admin/CSRPartnersAdminPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button"; // default import in your project
import { Container } from "../../components/ui/Container";
import {
  Plus,
  Upload,
  Globe,
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { supabase } from "../../supabase";

type CSRPartner = {
  id: string;
  name: string;
  website: string | null;
  blurb: string | null;
  tribute: string | null;                  // e.g., “In honor of …”
  donation_level: string | null;           // e.g., “Seed”, “Patron”, etc.
  logo_url: string | null;                 // from bucket csr-logos
  hero_url: string | null;                 // from bucket csr-hero
  is_active: boolean;
  display_order: number | null;
  created_at: string;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const emptyForm = {
  name: "",
  website: "",
  blurb:
    "Recognizing organizations that lead the fight against colorectal cancer through screening & prevention.",
  tribute: "",
  donation_level: "Champion",
  is_active: true,
  display_order: 100,
};

const CSRPartnersAdminPage: React.FC = () => {
  const nav = useNavigate();
  const [rows, setRows] = useState<CSRPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  // Load list
  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("csr_partners")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) {
      console.error(error);
      setRows([]);
    } else {
      setRows((data || []) as CSRPartner[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const selected = useMemo(
    () => rows.find((r) => r.id === editingId) || null,
    [editingId, rows]
  );

  useEffect(() => {
    if (selected) {
      setForm({
        name: selected.name || "",
        website: selected.website || "",
        blurb: selected.blurb || "",
        tribute: selected.tribute || "",
        donation_level: selected.donation_level || "Champion",
        is_active: !!selected.is_active,
        display_order: selected.display_order ?? 100,
      });
    } else {
      setForm({ ...emptyForm });
      setLogoFile(null);
      setHeroFile(null);
    }
  }, [selected]);

  const uploadIfNeeded = async (
    bucket: "csr-logos" | "csr-hero",
    file: File | null,
    partnerName: string
  ): Promise<string | null> => {
    if (!file) return null;
    const key = `${slugify(partnerName)}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from(bucket).upload(key, file, {
      cacheControl: "3600",
      upsert: true,
    });
    if (upErr) throw upErr;
    const { data } = supabase.storage.from(bucket).getPublicUrl(key);
    return data.publicUrl ?? null;
  };

  const onSave = async () => {
    if (!form.name.trim()) {
      alert("Please enter a partner name.");
      return;
    }
    try {
      setSaving(true);

      // Uploads first (use provided files only)
      const [logoUrl, heroUrl] = await Promise.all([
        uploadIfNeeded("csr-logos", logoFile, form.name),
        uploadIfNeeded("csr-hero", heroFile, form.name),
      ]);

      if (editingId) {
        const updateFields: any = {
          name: form.name.trim(),
          website: form.website?.trim() || null,
          blurb: form.blurb?.trim() || null,
          tribute: form.tribute?.trim() || null,
          donation_level: form.donation_level?.trim() || null,
          is_active: form.is_active,
          display_order: Number(form.display_order ?? 100),
        };
        if (logoUrl) updateFields.logo_url = logoUrl;
        if (heroUrl) updateFields.hero_url = heroUrl;

        const { error } = await supabase
          .from("csr_partners")
          .update(updateFields)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("csr_partners").insert({
          name: form.name.trim(),
          website: form.website?.trim() || null,
          blurb: form.blurb?.trim() || null,
          tribute: form.tribute?.trim() || null,
          donation_level: form.donation_level?.trim() || null,
          is_active: form.is_active,
          display_order: Number(form.display_order ?? 100),
          logo_url: logoUrl,
          hero_url: heroUrl,
        } as Partial<CSRPartner>);
        if (error) throw error;
      }

      await load();
      setEditingId(null);
      setForm({ ...emptyForm });
      setLogoFile(null);
      setHeroFile(null);
      alert("Saved.");
    } catch (err: any) {
      console.error(err);
      alert(`Save failed: ${err.message ?? err}`);
    } finally {
      setSaving(false);
    }
  };

  const onToggleActive = async (row: CSRPartner) => {
    const { error } = await supabase
      .from("csr_partners")
      .update({ is_active: !row.is_active })
      .eq("id", row.id);
    if (error) {
      console.error(error);
      alert("Failed to update status.");
      return;
    }
    await load();
  };

  const seedJasonCopy = () => {
    setForm({
      name: "Jason Lim Group (NY Grill / Old Street / KKO KKO NARA / OMMA / 8Carat / The Cafe Lobby / The Kopi Lobby)",
      website: "https://www.instagram.com/ommakoreancharcoalbbq/", // placeholder
      blurb:
        "We celebrate Jason Lim’s family of F&B brands for championing early detection and prevention. Thank you for standing with COLONAiVE™ to save lives.",
      tribute:
        "In honor of the late Mr. Toh Cher Lek — for friendship, courage, and community.",
      donation_level: "Founding Champion",
      is_active: true,
      display_order: 1,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                className="bg-slate-100 text-slate-700 hover:bg-slate-200"
                onClick={() => nav("/admin/dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
              <h1 className="text-xl font-semibold">CSR Partners Management</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={load}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <a
                href="/csr-showcase"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  <Globe className="h-4 w-4 mr-2" />
                  View Public Page
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Editor */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">
                {editingId ? "Edit Partner" : "Add New Partner"}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={seedJasonCopy} title="Prefill sample copy">
                  <Plus className="h-4 w-4 mr-2" />
                  Use Sample Copy
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Partner Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Company or Group Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Website</label>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-3 h-10 bg-gray-100 rounded-l-md border border-r-0">
                      <LinkIcon className="h-4 w-4" />
                    </span>
                    <input
                      value={form.website || ""}
                      onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                      className="w-full border rounded-r-md px-3 py-2 h-10"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Donation Level</label>
                  <input
                    value={form.donation_level || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, donation_level: e.target.value }))
                    }
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Founding Champion / Patron / Seed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Display Order</label>
                    <input
                      type="number"
                      value={form.display_order ?? 100}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, display_order: Number(e.target.value) }))
                      }
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input
                      id="active"
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, is_active: e.target.checked }))
                      }
                    />
                    <label htmlFor="active" className="text-sm">
                      Active
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Blurb</label>
                  <textarea
                    value={form.blurb || ""}
                    onChange={(e) => setForm((f) => ({ ...f, blurb: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2 min-h-[96px]"
                    placeholder="Short public note to honor the partner."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tribute (optional)</label>
                  <input
                    value={form.tribute || ""}
                    onChange={(e) => setForm((f) => ({ ...f, tribute: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder='e.g., "In honor of the late Mr. Toh Cher Lek"'
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Upload Logo / Collage</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Upload Hero (wide)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button onClick={onSave} disabled={saving}>
                <Upload className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Partner"}
              </Button>
              {editingId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ ...emptyForm });
                    setLogoFile(null);
                    setHeroFile(null);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">Partners</h2>
            {loading ? (
              <p className="text-gray-600">Loading…</p>
            ) : rows.length === 0 ? (
              <p className="text-gray-600">No partners yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {rows.map((r) => (
                  <div
                    key={r.id}
                    className="border rounded-lg p-4 flex gap-4 items-center"
                  >
                    <img
                      src={r.logo_url || r.hero_url || ""}
                      alt={r.name}
                      className="w-24 h-24 object-cover rounded-md border"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{r.name}</h3>
                        {r.is_active ? (
                          <span className="inline-flex items-center text-green-700 bg-green-100 rounded-full px-2 py-0.5 text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-gray-700 bg-gray-100 rounded-full px-2 py-0.5 text-xs">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </span>
                        )}
                      </div>
                      {r.website && (
                        <a
                          href={r.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline"
                        >
                          {r.website}
                        </a>
                      )}
                      {r.blurb && (
                        <p className="text-sm text-gray-700 mt-1 line-clamp-2">{r.blurb}</p>
                      )}
                      {r.tribute && (
                        <p className="text-xs text-gray-500 mt-1 italic">{r.tribute}</p>
                      )}
                      <div className="mt-3 flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setEditingId(r.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          className={r.is_active ? "bg-slate-600 hover:bg-slate-700" : ""}
                          variant={r.is_active ? "outline" : "primary"}
                          onClick={() => onToggleActive(r)}
                        >
                          {r.is_active ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default CSRPartnersAdminPage;
