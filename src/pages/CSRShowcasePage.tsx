// /src/pages/CSRShowcasePage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Container } from "../components/ui/Container";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { supabase } from "../supabase";

type CSRPartner = {
  id: string;
  name: string;
  website: string | null;
  blurb: string | null;
  donation_level: string | null;
  logo_url: string | null;
  hero_image_url: string | null; // ✅ read correct column
  display_order: number | null;
};

const chunk = <T,>(arr: T[], size: number) =>
  arr.reduce<T[][]>((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);

const CSRShowcasePage: React.FC = () => {
  const [partners, setPartners] = useState<CSRPartner[]>([]);
  const [index, setIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(window.innerWidth >= 1024 ? 2 : 1);

  useEffect(() => {
    const onResize = () => setItemsPerSlide(window.innerWidth >= 1024 ? 2 : 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("csr_partners")
        .select("id,name,website,blurb,donation_level,logo_url,hero_image_url,display_order")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (!error) setPartners((data || []) as CSRPartner[]);
    };
    load();
  }, []);

  useEffect(() => {
    if (partners.length <= itemsPerSlide) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % Math.ceil(partners.length / itemsPerSlide)),
      5000
    );
    return () => clearInterval(t);
  }, [partners, itemsPerSlide]);

  const slides = useMemo(() => chunk(partners, itemsPerSlide), [partners, itemsPerSlide]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 py-12 text-white">
        <Container>
          <h1 className="text-3xl font-bold mb-2">Corporate Champions</h1>
          <p className="opacity-90">
            Recognizing organizations that lead the fight against colorectal cancer through their
            commitment to screening and prevention.
          </p>
          <a href="/register/corporate">
            <Button className="mt-6">Become a Corporate Champion →</Button>
          </a>
        </Container>
      </div>

      <Container className="py-8">
        {/* Carousel */}
        {slides.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                Showing {itemsPerSlide} per slide • {partners.length} partners
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setIndex((i) => (i - 1 + slides.length) % slides.length)
                  }
                >
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
                          {/* HERO image if present */}
                          {p.hero_image_url ? (
                            <img
                              src={p.hero_image_url}
                              alt={`${p.name} brands`}
                              className="w-full h-56 object-contain bg-white rounded-xl border mb-4"
                              loading="lazy"
                            />
                          ) : (
                            <div className="mb-4">
                              {p.logo_url && (
                                <img
                                  src={p.logo_url}
                                  alt={`${p.name} logo`}
                                  className="w-14 h-14 object-contain rounded-md border bg-white"
                                />
                              )}
                            </div>
                          )}

                          <h3 className="font-semibold text-gray-900">{p.name}</h3>
                          {p.blurb && <p className="text-sm text-gray-700 mt-2">{p.blurb}</p>}

                          <div className="mt-4">
                            {p.website && (
                              <a href={p.website} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline">Visit Website</Button>
                              </a>
                            )}
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
      </Container>
    </div>
  );
};

export default CSRShowcasePage;
