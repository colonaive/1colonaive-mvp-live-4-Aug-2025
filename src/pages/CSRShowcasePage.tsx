// src/pages/CSRShowcasePage.tsx
import React from "react";
import { supabase } from "../supabase";

type CSRPartner = {
  id: string;
  name: string;
  website: string | null;
  blurb: string | null;
  donation_level: string | null;
  tribute: string | null;
  brands: string[] | null;
  logo_url: string | null;
  hero_image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number | null;
};

function useItemsPerSlide() {
  const [items, setItems] = React.useState<number>(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? 2 : 1
  );
  React.useEffect(() => {
    const onResize = () => {
      setItems(window.innerWidth >= 1024 ? 2 : 1); // >=1024px => 2 cards, else 1
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return items;
}

const chunk = <T,>(arr: T[], size: number): T[][] => {
  if (size <= 0) return [arr];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const CSRShowcasePage: React.FC = () => {
  const [partners, setPartners] = React.useState<CSRPartner[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const itemsPerSlide = useItemsPerSlide();
  const [index, setIndex] = React.useState<number>(0);
  const [paused, setPaused] = React.useState<boolean>(false);

  // ── keep same sponsor in view when itemsPerSlide flips (2 → 1 or 1 → 2)
  const prevItemsRef = React.useRef(itemsPerSlide);
  React.useEffect(() => {
    if (prevItemsRef.current !== itemsPerSlide) {
      const firstFlat = index * prevItemsRef.current; // absolute position of first visible card
      const newIndex = Math.floor(firstFlat / itemsPerSlide);
      setIndex(newIndex);
      prevItemsRef.current = itemsPerSlide;
    }
  }, [itemsPerSlide, index]);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("csr_partners")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (!error && data) setPartners(data as CSRPartner[]);
      setLoading(false);
    };
    load();
  }, []);

  const slides = React.useMemo(
    () => chunk(partners, itemsPerSlide),
    [partners, itemsPerSlide]
  );

  // autoplay
  React.useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, [slides.length, paused]);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <div className="bg-gray-50">
      {/* Hero header/CTA */}
      <section className="bg-gradient-to-r from-blue-700 to-teal-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Corporate Champions
          </h1>
          <p className="mt-2 text-white/90">
            Recognizing organizations that lead the fight against colorectal
            cancer through their commitment to screening and prevention.
          </p>
          <a
            href="/register/corporate"
            className="inline-flex items-center justify-center mt-6 px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition text-sm font-semibold"
          >
            Become a Corporate Champion →
          </a>
        </div>
      </section>

      {/* Carousel */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center text-gray-500">
            No partners yet—check back soon.
          </div>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Track */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  width: `${slides.length * 100}%`,
                  transform: `translateX(-${index * (100 / slides.length)}%)`,
                }}
              >
                {slides.map((group, slideIdx) => (
                  <div
                    key={`slide-${slideIdx}`}
                    className="flex-shrink-0"
                    style={{ width: `${100 / slides.length}%` }}
                  >
                    <div
                      className={`grid gap-6 ${
                        itemsPerSlide === 2 ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
                      }`}
                    >
                      {group.map((p) => (
                        <PartnerCard key={p.id} partner={p} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            {slides.length > 1 && (
              <>
                <button
                  aria-label="Previous"
                  onClick={prev}
                  className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-50"
                >
                  ‹
                </button>
                <button
                  aria-label="Next"
                  onClick={next}
                  className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-50"
                >
                  ›
                </button>

                {/* Dots */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-2 w-2 rounded-full ${
                        i === index ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

const PartnerCard: React.FC<{ partner: CSRPartner }> = ({ partner }) => {
  const brands = (partner.brands || []).filter(Boolean).slice(0, 8);
  const hasHero = !!partner.hero_image_url;

  if (hasHero) {
    // Hero + overlay + logo
    return (
      <article className="relative rounded-2xl overflow-hidden shadow bg-white">
        <div className="relative h-64 sm:h-72">
          <img
            src={partner.hero_image_url!}
            alt={partner.name}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
            <div className="flex items-center gap-3">
              {partner.logo_url && (
                <img
                  src={partner.logo_url}
                  alt={`${partner.name} logo`}
                  className="h-12 w-12 rounded-lg object-contain bg-white p-1"
                  loading="lazy"
                />
              )}
              <h3 className="text-lg sm:text-xl font-semibold leading-snug">
                {partner.name}
              </h3>
            </div>
            {partner.blurb && (
              <p className="mt-2 text-sm text-white/90 line-clamp-3">{partner.blurb}</p>
            )}
            {!!brands.length && (
              <div className="mt-3 flex flex-wrap gap-2">
                {brands.map((b, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white/90 text-gray-900 px-2 py-1 rounded"
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}
            {partner.website && (
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mt-3 px-3 py-1.5 rounded bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Logo-only card
  return (
    <article className="rounded-2xl p-5 bg-white shadow flex flex-col">
      <div className="flex items-center gap-3">
        {partner.logo_url && (
          <img
            src={partner.logo_url}
            alt={`${partner.name} logo`}
            className="h-12 w-12 rounded-lg object-contain bg-gray-50 p-1"
            loading="lazy"
          />
        )}
        <h3 className="text-lg font-semibold">{partner.name}</h3>
      </div>
      {partner.blurb && (
        <p className="mt-3 text-sm text-gray-600">{partner.blurb}</p>
      )}
      {!!brands.length && (
        <div className="mt-3 flex flex-wrap gap-2">
          {brands.map((b, i) => (
            <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              {b}
            </span>
          ))}
        </div>
      )}
      {partner.website && (
        <a
          href={partner.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex self-start px-3 py-1.5 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
        >
          Visit Website
        </a>
      )}
    </article>
  );
};

export default CSRShowcasePage;
