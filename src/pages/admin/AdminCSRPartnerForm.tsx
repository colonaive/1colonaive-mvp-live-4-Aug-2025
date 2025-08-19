// /src/pages/admin/AdminCSRPartnerForm.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { supabase } from "@/supabase";

type FileLike = File | null;

const AdminCSRPartnerForm: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [blurb, setBlurb] = useState(
    "We’re proud to recognize this partner for championing early detection and treatment access in our RID-CRC™ movement."
  );
  const [donationTier, setDonationTier] = useState("Champion ($35k+)");
  const [tribute, setTribute] = useState("");
  const [brandsText, setBrandsText] = useState(""); // comma-separated list
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isFeatured, setIsFeatured] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(true);

  const [logoFile, setLogoFile] = useState<FileLike>(null);
  const [heroFile, setHeroFile] = useState<FileLike>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [doneMsg, setDoneMsg] = useState<string | null>(null);

  const slug = useMemo(
    () =>
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "partner",
    [name]
  );

  async function uploadIfNeeded(
    bucket: string,
    file: FileLike,
    path: string
  ): Promise<string | null> {
    if (!file) return null;

    // Ensure bucket exists in Supabase storage (public)
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });
    if (error) throw error;

    const pub = supabase.storage.from(bucket).getPublicUrl(path);
    return pub.data.publicUrl || null;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setDoneMsg(null);

    try {
      const logoPath = `${slug}/logo-${Date.now()}.${(logoFile?.name.split(".").pop() || "png").toLowerCase()}`;
      const heroPath = `${slug}/hero-${Date.now()}.${(heroFile?.name.split(".").pop() || "jpg").toLowerCase()}`;

      const logoUrl = await uploadIfNeeded("csr-logos", logoFile, logoPath);
      const heroUrl = await uploadIfNeeded("csr-hero", heroFile, heroPath);

      const brands = brandsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const { error } = await supabase.from("csr_partners").insert({
        name,
        website: website || null,
        blurb: blurb || null,
        donation_tier: donationTier || null,
        tribute: tribute || null,
        brands: brands.length ? brands : null,
        logo_url: logoUrl,
        hero_image_url: heroUrl,
        display_order: displayOrder || 1,
        is_featured: isFeatured,
        is_active: isActive,
      });

      if (error) throw error;

      setDoneMsg("Partner saved. Redirecting to CSR Showcase…");
      setTimeout(() => navigate("/csr-showcase"), 900);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Failed to save partner.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 bg-slate-50 min-h-screen">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add Corporate Champion</h1>
          <p className="text-gray-600">
            Upload logo/hero, add a short note, and publish to the CSR Showcase.
          </p>
        </div>

        <Card className="bg-white shadow-md">
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company / Group Name *</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Jason Lim Group"
                  />
                  <p className="text-xs text-gray-500 mt-1">Slug preview: <code>{slug}</code></p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Blurb (short)</label>
                  <textarea
                    rows={4}
                    value={blurb}
                    onChange={(e) => setBlurb(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="One or two lines to celebrate this Corporate Champion."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Donation Tier / Recognition</label>
                  <input
                    value={donationTier}
                    onChange={(e) => setDonationTier(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Champion ($35k+)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tribute (optional)</label>
                  <input
                    value={tribute}
                    onChange={(e) => setTribute(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="In honour of …"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Brands (comma-separated)
                  </label>
                  <input
                    value={brandsText}
                    onChange={(e) => setBrandsText(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., OMMA, KKO KKO NARA, Old Street Bak Kut Teh, …"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Logo (PNG/SVG)</label>
                  <input
                    type="file"
                    accept=".png,.svg,.jpg,.jpeg,.webp"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    className="mt-1 block w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Hero Image (JPG/WEBP)</label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                    className="mt-1 block w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value || "1", 10))}
                    className="mt-1 w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="mr-2"
                    />
                    Featured
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="mr-2"
                    />
                    Active
                  </label>
                </div>
              </div>

              {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
              {doneMsg && <p className="text-sm text-green-700">{doneMsg}</p>}

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving…" : "Save Partner"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/csr-showcase")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default AdminCSRPartnerForm;
