// /src/pages/FindSpecialistPage.tsx
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/supabase";

/** ───────────────── Types ───────────────── */
type LocationItem = {
  label?: string;
  address?: string;
  phone?: string;
  booking_url?: string;
};

type Specialist = {
  id: string;
  name: string;
  clinic_name: string;
  address: string | null;
  phone_number: string | null;
  website: string | null;
  appointment_url: string | null;
  /** Dedicated doctor profile link (e.g., doctor bio page on clinic site) */
  profile_url?: string | null;
  region: string | null;
  specialties: string[] | null;
  photo_url: string | null;
  display_order: number | null;
  /** NEW: academic credentials (optional) */
  credentials?: string | null;
  /** Optional multi-location JSONB (if you add it in the DB) */
  locations?: LocationItem[] | null;
};

/** Small numbered list bullet used later */
const CustomListItem = ({ number, children }: { number: number; children: React.ReactNode }) => (
  <li className="flex items-start">
    <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full font-bold text-sm mr-4 mt-1">
      {number}
    </div>
    <span className="text-gray-700">{children}</span>
  </li>
);

/** ───────────────── Address Scroller (handles multi-locations + fallback) ───────────────── */
const AddressScroller: React.FC<{
  locations?: LocationItem[] | null;
  fallback?: { address?: string | null; phone?: string | null; booking_url?: string | null };
}> = ({ locations, fallback }) => {
  const prepared: LocationItem[] =
    locations && locations.length
      ? locations
      : (fallback && (fallback.address || fallback.phone || fallback.booking_url)
          ? [{ label: "Main clinic", address: fallback.address ?? undefined, phone: fallback.phone ?? undefined, booking_url: fallback.booking_url ?? undefined }]
          : []);

  const [i, setI] = useState(0);

  // Auto-rotate every 4s
  useEffect(() => {
    if (prepared.length <= 1) return;
    const t = setInterval(() => setI((x) => (x + 1) % prepared.length), 4000);
    return () => clearInterval(t);
  }, [prepared.length]);

  if (!prepared.length) return null;
  const loc = prepared[i];

  return (
    <div className="mt-2 rounded-md border border-gray-200 p-3 bg-white/60">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-700">
          {loc.label || `Location ${i + 1}`}
        </span>
        {prepared.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-800"
              aria-label="Previous location"
              onClick={(e) => {
                e.stopPropagation();
                setI((x) => (x - 1 + prepared.length) % prepared.length);
              }}
            >
              ‹
            </button>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-800"
              aria-label="Next location"
              onClick={(e) => {
                e.stopPropagation();
                setI((x) => (x + 1) % prepared.length);
              }}
            >
              ›
            </button>
          </div>
        )}
      </div>

      {loc.address && <div className="mt-1 text-sm text-gray-800 leading-snug">{loc.address}</div>}
      {loc.phone && <div className="mt-1 text-sm text-gray-600">{loc.phone}</div>}
      {loc.booking_url && (
        <a
          href={loc.booking_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm text-blue-700 hover:underline"
        >
          Book appointment →
        </a>
      )}

      {prepared.length > 1 && (
        <div className="mt-2 text-[11px] text-gray-500">
          {i + 1} / {prepared.length}
        </div>
      )}
    </div>
  );
};

/** ───────────────── Page ───────────────── */
const FindSpecialistPage: React.FC = () => {
  const [rows, setRows] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("partner_specialists")
        .select("*") // safe whether or not 'locations' / 'credentials' exist
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Load error:", error);
        setRows([]);
      } else {
        setRows((data || []) as unknown as Specialist[]);
      }
      setLoading(false);
    };
    run();
  }, []);

  const allSpecialties = useMemo(
    () =>
      Array.from(
        new Set(rows.flatMap((r) => (r.specialties || []).map((s) => s.trim()).filter(Boolean)))
      ).sort(),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return rows.filter((r) => {
      const blob = `${r.name} ${r.clinic_name} ${r.address ?? ""} ${r.region ?? ""}`.toLowerCase();
      const matchQ = q === "" || blob.includes(q);
      const matchSpec =
        selectedSpecialty === null ||
        (r.specialties || []).map((s) => s.toLowerCase()).includes((selectedSpecialty || "").toLowerCase());
      return matchQ && matchSpec;
    });
  }, [rows, searchTerm, selectedSpecialty]);

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-4">
              <Link to="/triage" className="inline-flex items-center text-white/80 hover:text-white text-sm mb-2">
                ← Back to Triage Assessment
              </Link>
            </div>
            <h1 className="text-4xl font-bold mb-4">Find a COLONAiVE Project Partner Specialist</h1>
            <p className="text-xl mb-8">
              For Colonoscopy, Early Detection, Polyps Removal and Early CRC Treatment needs.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search by clinic, partner specialist, or location..."
                className="w-full py-4 px-5 pl-14 rounded-full text-gray-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search specialists by clinic, name, or location"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
            </div>
          </div>
        </Container>
      </div>

      {/* Info bar */}
      <section className="py-8 bg-blue-50 border-b border-blue-100">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-blue-100 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">🏆 COLONAiVE Project Partners</h3>
              <p className="text-blue-700">
                Our Project Partners committed to our national mission of early detection and treatment of colorectal cancer.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Main */}
      <section className="py-16 bg-slate-50">
        <Container>
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar */}
            <aside className="lg:w-1/4">
              <div className="sticky top-24">
                <h3 className="text-lg font-semibold mb-4 px-2">Filter By Specialty</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedSpecialty(null)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                      selectedSpecialty === null
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    All Specialties
                  </button>
                  {allSpecialties.map((spec) => (
                    <button
                      key={spec}
                      onClick={() => setSelectedSpecialty(spec)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                        selectedSpecialty === spec
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Listings */}
            <main className="lg:w-3/4">
              <div className="flex justify-between items-baseline mb-6">
                <h2 className="text-2xl font-bold">
                  {filtered.length} {filtered.length === 1 ? "Partner Clinic" : "Partner Clinics"} Found
                </h2>
              </div>

              {loading ? (
                <p className="text-gray-600">Loading partner clinics...</p>
              ) : filtered.length > 0 ? (
                <div className="space-y-6">
                  {filtered.map((s) => (
                    <Card
                      key={s.id}
                      className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
                    >
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="flex items-start gap-4 md:col-span-2">
                            {s.photo_url ? (
                              <img
                                src={s.photo_url}
                                alt={s.name}
                                className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                              />
                            ) : null}
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">{s.clinic_name}</h3>

                              {/* Doctor name → profile_url (fallback to website) */}
                              <p className="text-md font-semibold text-blue-700 mb-1">
                                {s.profile_url || s.website ? (
                                  <a
                                    href={s.profile_url || s.website!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                  >
                                    {s.name}
                                  </a>
                                ) : (
                                  s.name
                                )}
                              </p>

                              {/* NEW: credentials / academic achievements */}
                              {s.credentials && (
                                <p className="text-sm text-gray-500 mb-3">{s.credentials}</p>
                              )}

                              {/* Address/locations box with tiny scroller */}
                              <AddressScroller
                                locations={s.locations}
                                fallback={{
                                  address: s.address,
                                  phone: s.phone_number,
                                  booking_url: s.appointment_url,
                                }}
                              />

                              {s.specialties && s.specialties.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                                    Treatments &amp; Specialties:
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {s.specialties.map((tag, i) => (
                                      <span
                                        key={i}
                                        className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Balanced CTAs */}
                          <div className="flex flex-col md:items-end items-stretch justify-center gap-3">
                            <a
                              href={s.appointment_url || s.website || "#"}
                              target={s.appointment_url || s.website ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              className="w-full md:w-[248px] inline-block"
                            >
                              <Button className="w-full justify-center">
                                Book a Colonoscopy
                              </Button>
                            </a>

                            {s.website && (
                              <a
                                href={s.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full md:w-[248px] inline-block"
                              >
                                <Button className="w-full justify-center bg-teal-600 hover:bg-teal-700 text-white border-transparent">
                                  Consult for CRC Treatments
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-600">
                    No partner clinics match your current search criteria. Please try a different search term or
                    filter.
                  </CardContent>
                </Card>
              )}
            </main>
          </div>
        </Container>
      </section>

      {/* Preparing for Your Visit */}
      <section className="py-20 bg-blue-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Preparing for Your Visit</h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Knowing what to expect can help make your screening experience smoother.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-6 text-gray-800">Before Your Appointment</h3>
              <ol className="space-y-4">
                <CustomListItem number={1}>Check with your insurance provider about coverage.</CustomListItem>
                <CustomListItem number={2}>Bring your medical history and any previous screening results.</CustomListItem>
                <CustomListItem number={3}>Prepare a list of questions you may have.</CustomListItem>
                <CustomListItem number={4}>Follow any preparation instructions provided by the clinic.</CustomListItem>
              </ol>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-6 text-gray-800">Questions to Ask</h3>
              <ol className="space-y-4">
                <CustomListItem number={1}>Which screening test is right for me and why?</CustomListItem>
                <CustomListItem number={2}>How do I prepare for the screening?</CustomListItem>
                <CustomListItem number={3}>What are the risks and benefits of this screening method?</CustomListItem>
                <CustomListItem number={4}>How will I receive my results and what happens next?</CustomListItem>
              </ol>
            </div>
          </div>
          <div className="mt-12 text-center bg-white p-8 rounded-lg max-w-3xl mx-auto border border-gray-200">
            <h3 className="text-bold text-xl mb-3 text-gray-800">Need Financial Assistance?</h3>
            <p className="text-gray-600 mb-6">
              Several programs exist to help cover the cost of colorectal cancer screening for those who qualify.
              Don&apos;t let financial concerns prevent you from getting screened.
            </p>
            <Button size="lg">Explore Financial Assistance Options</Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default FindSpecialistPage;
