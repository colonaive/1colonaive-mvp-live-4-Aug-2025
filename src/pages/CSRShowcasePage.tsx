// /src/pages/CSRShowcasePage.tsx
import React, { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/supabase";

type CSRPartner = {
  id: string;
  name: string;
  website: string | null;
  blurb: string | null;
  donation_tier: string | null;
  tribute: string | null;
  brands: string[] | null;
  logo_url: string | null;
  hero_image_url: string | null;
};

const CSRShowcasePage: React.FC = () => {
  const [rows, setRows] = useState<CSRPartner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("csr_partners")
        .select("*")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (!error && data) setRows(data as CSRPartner[]);
      setLoading(false);
    };
    run();
  }, []);

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-3">Corporate Champions</h1>
            <p className="text-white/90 text-lg">
              Recognizing organizations that lead the fight against colorectal cancer through their
              commitment to screening and prevention.
            </p>
            <div className="mt-6">
              <a href="/register/corporate">
                <Button>Become a Corporate Champion →</Button>
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* Grid */}
      <section className="py-14 bg-slate-50">
        <Container>
          {loading ? (
            <p className="text-gray-600">Loading partners…</p>
          ) : rows.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-600">
                Partners will appear here once added.
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rows.map((p) => (
                <Card key={p.id} className="bg-white shadow hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    {p.hero_image_url ? (
                      <img
                        src={p.hero_image_url}
                        alt={`${p.name} hero`}
                        className="w-full h-40 object-cover rounded-md mb-4"
                      />
                    ) : null}
                    <div className="flex items-center gap-3 mb-3">
                      {p.logo_url ? (
                        <img
                          src={p.logo_url}
                          alt={`${p.name} logo`}
                          className="w-12 h-12 object-contain rounded"
                        />
                      ) : null}
                      <div>
                        <h3 className="text-lg font-bold">{p.name}</h3>
                        {p.donation_tier ? (
                          <p className="text-xs text-teal-700 font-semibold">{p.donation_tier}</p>
                        ) : null}
                      </div>
                    </div>

                    {p.blurb ? <p className="text-gray-700 mb-3">{p.blurb}</p> : null}
                    {p.tribute ? (
                      <p className="text-sm text-gray-500 italic mb-3">Tribute: {p.tribute}</p>
                    ) : null}

                    {p.brands && p.brands.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {p.brands.map((b, i) => (
                          <span
                            key={i}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {p.website ? (
                      <a href={p.website} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full">Visit Website</Button>
                      </a>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};

export default CSRShowcasePage;
