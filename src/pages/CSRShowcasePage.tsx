// /src/pages/CSRShowcasePage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Container } from "../components/ui/Container";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { supabase } from "../supabase";

type Row = {
  id: string;
  company_name: string;
  website: string | null;
  blurb_short: string | null;
  donation_tier: string | null;
  donation_tier_override: string | null;
  brands_csv: string | null;
  tribute: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  display_order: number | null;
  featured: boolean | null;
  status?: string | null;
  active?: boolean | null;
};

type Partner = {
  id: string;
  name: string;
  website: string | null;
  blurb: string | null;
  tier: string | null;
  brands: string[];
  tribute: string | null;
  logo: string | null;
  hero: string | null;
  order: number;
  featured: boolean;
};

const chunk = <T,>(arr: T[], size: number) =>
  arr.reduce<T[][]>((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);

/** Normalize tiers to public-friendly labels */
const normalizeTier = (tier: string | null): string | null => {
  if (!tier) return null;
  const t = tier.trim().toLowerCase();
  if (t.startsWith("diamond")) return "Diamond Champion";
  if (t.startsWith("platinum")) return "Platinum Champion";
  if (t.startsWith("gold")) return "Gold Champion";
  if (t.startsWith("support")) return "Supporter";
  return tier; // leave custom labels as-is
};

/** If tribute already contains 'honour'/'memory', show as-is; else prefix gracefully */
const formatTribute = (text: string): string => {
  const v = text.trim();
  const lower = v.toLowerCase();
  if (lower.includes("honour") || lower.includes("honor") || lower.includes("memory")) return v;
  return `In honour of ${v}`;
};

const TierBadge: React.FC<{ tier: string | null }> = ({ tier }) => {
  if (!tier) return null;
  const color =
    tier.startsWith("Diamond") ? "bg-blue-100 text-blue-800" :
    tier.startsWith("Platinum") ? "bg-gray-100 text-gray-800" :
    tier.startsWith("Gold") ? "bg-yellow-100 text-yellow-800" :
    "bg-emerald-100 text-emerald-800";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>
      {tier}
    </span>
  );
};

const CSRShowcasePage: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [index, setIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(window.innerWidth >= 1024 ? 2 : 1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onResize = () => setItemsPerSlide(window.innerWidth >= 1024 ? 2 : 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("csr_partners")
        .select(`
          id, company_name, website, blurb_short,
          donation_tier, donation_tier_override,
          brands_csv, tribute, logo_url, hero_image_url,
          display_order, featured, status, active
        `)
        .eq("active", true)
        .in("status", ["approved", "draft"])
        .order("featured", { ascending: false })
        .order("display_order", { ascending: true })
        .order("updated_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const mapped: Partner[] = (data || []).map((r: Row) => ({
        id: r.id,
        name: r.company_name,
        website: r.website,
        blurb: r.blurb_short,
        tier: normalizeTier(r.donation_tier_override || r.donation_tier),
        brands: (r.brands_csv || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        tribute: r.tribute ? formatTribute(r.tribute) : null,
        logo: r.logo_url,
        hero: r.hero_image_url,
        order: r.display_order ?? 100,
        featured: !!r.featured,
      }));

      setPartners(mapped);
      setLoading(false);
    };

    load();
  }, []);

  useEffect(() => {
    if (partners.length <= itemsPerSlide) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % Math.ceil(partners.length / itemsPerSlide)),
      7000
    );
    return () => clearInterval(t);
  }, [partners, itemsPerSlide]);

  const slides = useMemo(() => chunk(partners, itemsPerSlide), [partners, itemsPerSlide]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 py-12 text-white">
        <Container>
          <h1 className="text-3xl font-bold mb-2">Corporate Champions</h1>
          <p className="opacity-90 max-w-3xl">
            Recognizing organizations that lead the fight against colorectal cancer by expanding access to screening,
            prevention and early detection in Singapore.
          </p>
          <a href="/register/corporate">
            <Button className="mt-6">Become a Corporate Champion →</Button>
          </a>
        </Container>
      </div>

      <Container className="py-10">
        {/* Impact pitch band for $35k Gold */}
        <Card className="mb-8">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <TierBadge tier="Gold Champion" />
                <span className="text-sm text-gray-600">S$35,500 suggested entry</span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                Fund life‑saving CRC screening access - join as a Gold Champion.
              </h2>
              <p className="text-gray-700">
                A Gold commitment helps under‑served Singaporeans access screening now. We proudly recognise your leadership across our movement platforms.
              </p>
            </div>
            <a href="/register/corporate">
              <Button className="whitespace-nowrap">Start at S$35,500</Button>
            </a>
          </CardContent>
        </Card>

        {/* Carousel */}
        {loading ? (
          <div className="text-center text-gray-500 py-16">Loading partners…</div>
        ) : slides.length === 0 ? (
          <div className="text-center text-gray-500 py-16">Partners coming soon.</div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                Showing {itemsPerSlide} per slide • {partners.length} partner{partners.length !== 1 ? "s" : ""}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}>
                  ‹ Prev
                </Button>
                <Button variant="outline" onClick={() => setIndex((i) => (i + 1) % slides.length)}>
                  Next ›
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${index * 100}%)`, width: `${slides.length * 100}%` }}
              >
                {slides.map((group, gIdx) => (
                  <div key={gIdx} className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full px-1 lg:px-2">
                    {group.map((p) => (
                      <Card key={p.id}>
                        <CardContent className="p-5">
                          {/* Media: prefer hero; fallback to logo */}
                          {p.hero ? (
                            <img
                              src={p.hero}
                              alt={`${p.name} brands`}
                              className="w-full h-56 object-contain bg-white rounded-xl border mb-4"
                              loading="lazy"
                            />
                          ) : p.logo ? (
                            <div className="mb-4">
                              <img
                                src={p.logo}
                                alt={`${p.name} logo`}
                                className="w-16 h-16 object-contain rounded-md border bg-white"
                              />
                            </div>
                          ) : null}

                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{p.name}</h3>
                            <TierBadge tier={p.tier} />
                          </div>

                          {p.brands.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {p.brands.map((b, i) => (
                                <span
                                  key={`${p.id}-brand-${i}`}
                                  className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {b}
                                </span>
                              ))}
                            </div>
                          )}

                          {p.blurb && <p className="text-sm text-gray-700">{p.blurb}</p>}

                          {/* Tribute - highlighted softly, centered, italic */}
                          {p.tribute && (
                            <div className="mt-3">
                              <div className="bg-indigo-50 border border-indigo-100 text-indigo-800 text-sm italic rounded-lg px-3 py-2 text-center">
                                {p.tribute}
                              </div>
                            </div>
                          )}

                          <div className="mt-4 flex items-center gap-2">
                            {p.website && (
                              <a href={p.website} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline">Visit Website</Button>
                              </a>
                            )}
                            <a href="/register/corporate">
                              <Button variant="outline">Join as a Champion</Button>
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Movement dedication block */}
        <Card className="mt-10">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              In loving memory of our dear friend, the late Mr. Toh Cher Lek
            </h3>
            <p className="text-gray-700">
              COLONAiVE™ is a national movement built on compassion and action. Each Corporate Champion helps
              ensure that more families catch colorectal cancer early-when it's most treatable.
            </p>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default CSRShowcasePage;
