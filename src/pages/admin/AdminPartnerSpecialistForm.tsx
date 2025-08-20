// /src/pages/admin/AdminPartnerSpecialistForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { supabase } from "../../supabase";
import { ArrowLeft, Plus, Trash2, RefreshCw, Link as LinkIcon, Phone } from "lucide-react";

/** ---------- Controlled list of common CRC specialties ---------- */
const SPECIALTY_OPTIONS = [
  "Colorectal surgery",
  "Robotic colorectal surgery",
  "Laparoscopic colorectal surgery",
  "Transanal minimally invasive surgery (TAMIS)",
  "Endoscopic mucosal resection (EMR)",
  "Endoscopic submucosal dissection (ESD)",
  "Endoscopic pilonidal sinus treatment (EPSiT)",
  "Endorectal ultrasound (ERUS)",
  "Polypectomy",
  "Hemorrhoid treatment",
  "Anal fistula treatment",
];

type LocationItem = {
  label?: string;
  address?: string;
  phone?: string;
  booking_url?: string;
};

type SpecialistForm = {
  /** DB columns */
  name: string;               // doctor's name
  clinic_name: string;
  phone_number?: string | null;
  website?: string | null;
  appointment_url?: string | null;
  profile_url?: string | null;
  region?: string | null;
  photo_url?: string | null;
  is_active: boolean;
  display_order?: number | null;
  address?: string | null;    // legacy single address

  /** UI-only -> saved into DB columns above */
  specialtiesSelected: string[]; // from checklist
  specialtiesOther: string;      // comma-separated extra tags
  credentials?: string | null;   // new DB column

  /** future-proof UI */
  locations: LocationItem[];
};

const emptyForm: SpecialistForm = {
  name: "",
  clinic_name: "",
  phone_number: "",
  website: "",
  appointment_url: "",
  profile_url: "",
  region: "",
  photo_url: "",
  is_active: true,
  display_order: 100,
  address: "",
  specialtiesSelected: [],
  specialtiesOther: "",
  credentials: "",
  locations: [{ label: "Main clinic", address: "", phone: "", booking_url: "" }],
};

const AdminPartnerSpecialistForm: React.FC = () => {
  const nav = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SpecialistForm>({ ...emptyForm });

  /** Quick demo fill */
  const seedDr = () => {
    setForm((f) => ({
      ...f,
      name: "Dr Daniel Lee Jin Keat",
      clinic_name: "Colorectal Clinic Associates",
      phone_number: "+65 6643 9922",
      website: "https://www.colorectalclinic.com/",
      appointment_url: "https://www.colorectalclinic.com/#contact-form",
      profile_url: "https://www.colorectalclinic.com/dr-daniel-lee",
      region: "Central",
      photo_url: "",
      specialtiesSelected: ["Colorectal surgery", "Robotic colorectal surgery"],
      specialtiesOther: "Geriatric colorectal care",
      credentials: "MD, MMed (S’pore), FRCS (Edin), FAMS",
      locations: [
        {
          label: "Main clinic",
          address: "Paragon Medical Centre, 290 Orchard Road #06-06, Singapore",
          phone: "+65 6643 9922",
          booking_url: "https://www.colorectalclinic.com/#contact-form",
        },
      ],
    }));
  };

  /** Locations helpers */
  const addLocation = () =>
    setForm((f) => ({
      ...f,
      locations: [
        ...f.locations,
        { label: `Location ${f.locations.length + 1}`, address: "", phone: "", booking_url: "" },
      ],
    }));

  const removeLocation = (idx: number) =>
    setForm((f) => ({
      ...f,
      locations: f.locations.filter((_, i) => i !== idx),
    }));

  const updateLocation = (idx: number, patch: Partial<LocationItem>) =>
    setForm((f) => {
      const next = [...f.locations];
      next[idx] = { ...next[idx], ...patch };
      return { ...f, locations: next };
    });

  const onSave = async () => {
    if (!form.name.trim() || !form.clinic_name.trim()) {
      alert("Doctor’s name and clinic name are required.");
      return;
    }

    try {
      setSaving(true);

      // Build final specialties array
      const other = (form.specialtiesOther || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const specialties = Array.from(new Set([...(form.specialtiesSelected || []), ...other]));

      // Always write first location to legacy single columns
      const first = form.locations[0] || {};
      const legacyAddress = first.address?.trim() || form.address || null;
      const legacyPhone = first.phone?.trim() || form.phone_number || null;
      const legacyAppt = first.booking_url?.trim() || form.appointment_url || null;

      // Base payload aligned with your actual columns
      const payload: any = {
        name: form.name.trim(),
        clinic_name: form.clinic_name.trim(),
        phone_number: legacyPhone || null,
        website: form.website?.trim() || null,
        appointment_url: legacyAppt || null,
        profile_url: form.profile_url?.trim() || null,
        region: form.region || null,
        photo_url: form.photo_url?.trim() || null,
        is_active: !!form.is_active,
        display_order: form.display_order ?? 100,
        address: legacyAddress,
        specialties: specialties.length ? specialties : null,
        credentials: form.credentials?.trim() || null, // new column
      };

      // If you’ve added the JSONB column `locations`, try to save the full array as well.
      // If the column doesn’t exist yet, Supabase will error — that’s fine, we’ll ignore it.
      let saveLocations = true;
      try {
        const { error: locErr } = await supabase
          .from("partner_specialists")
          .insert([{ ...payload, locations: form.locations }]); // attempt with locations
        if (locErr) {
          // fall back: insert without the JSONB column
          saveLocations = false;
          throw locErr;
        }
      } catch {
        const { error } = await supabase
          .from("partner_specialists")
          .insert([{ ...payload }]); // no locations column
        if (error) throw error;
      }

      alert(`Saved.${saveLocations ? "" : " (Locations saved only to first address/phone/appointment.)"}`);
      setForm({ ...emptyForm });
      // nav("/admin/dashboard"); // optional
    } catch (e: any) {
      console.error(e);
      alert(`Save failed: ${e.message || e}`);
    } finally {
      setSaving(false);
    }
  };

  /** Toggle a checklist item */
  const toggleSpecialty = (value: string) =>
    setForm((f) => {
      const set = new Set(f.specialtiesSelected);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...f, specialtiesSelected: Array.from(set) };
    });

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
              <h1 className="text-xl font-semibold">Add Partner Specialist (Admin)</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={seedDr}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sample
              </Button>
              <a href="/find-a-specialist" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">View Public Directory</Button>
              </a>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <Card>
          <CardContent className="p-6">
            {/* Basic details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Doctor’s Name *</label>
                    <input
                      className="w-full border rounded-md px-3 py-2"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Clinic / Centre Name *</label>
                    <input
                      className="w-full border rounded-md px-3 py-2"
                      value={form.clinic_name}
                      onChange={(e) => setForm((f) => ({ ...f, clinic_name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Number</label>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 h-10 bg-gray-100 rounded-l-md border border-r-0">
                        <Phone className="h-4 w-4" />
                      </span>
                      <input
                        className="w-full border rounded-r-md px-3 py-2 h-10"
                        value={form.phone_number || ""}
                        onChange={(e) => setForm((f) => ({ ...f, phone_number: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Clinic Website</label>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 h-10 bg-gray-100 rounded-l-md border border-r-0">
                        <LinkIcon className="h-4 w-4" />
                      </span>
                      <input
                        className="w-full border rounded-r-md px-3 py-2 h-10"
                        placeholder="https://example.com"
                        value={form.website || ""}
                        onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Doctor Profile Page URL</label>
                    <input
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="Clinic bio page for this doctor"
                      value={form.profile_url || ""}
                      onChange={(e) => setForm((f) => ({ ...f, profile_url: e.target.value }))}
                    />
                  </div>
                </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Booking Link (CTA)</label>
                  <input
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Direct booking link if available"
                    value={form.appointment_url || ""}
                    onChange={(e) => setForm((f) => ({ ...f, appointment_url: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Region</label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={form.region || ""}
                    onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                  >
                    <option value="">Select region</option>
                    <option>Central</option>
                    <option>East</option>
                    <option>North</option>
                    <option>North-East</option>
                    <option>West</option>
                  </select>
                </div>

                {/* Credentials / academic achievements */}
                <div>
                  <label className="block text-sm font-medium mb-1">Credentials / Academic Achievements</label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2 min-h-[72px]"
                    placeholder="e.g., MD, MMed (S’pore), FRCS (Edin), FAMS"
                    value={form.credentials || ""}
                    onChange={(e) => setForm((f) => ({ ...f, credentials: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Photo URL</label>
                  <input
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="https://…"
                    value={form.photo_url || ""}
                    onChange={(e) => setForm((f) => ({ ...f, photo_url: e.target.value }))}
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    id="active"
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  />
                  <label htmlFor="active" className="text-sm">
                    Active
                  </label>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-3">Specialties</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {SPECIALTY_OPTIONS.map((opt) => {
                  const checked = form.specialtiesSelected.includes(opt);
                  return (
                    <label key={opt} className="flex items-center gap-2 bg-white border rounded-md px-3 py-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSpecialty(opt)}
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium mb-1">Other (comma-separated)</label>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g., Geriatric colorectal care, Genetic counseling"
                  value={form.specialtiesOther}
                  onChange={(e) => setForm((f) => ({ ...f, specialtiesOther: e.target.value }))}
                />
              </div>
            </div>

            {/* Locations */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Locations</h2>
                <Button onClick={addLocation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>

              <div className="space-y-4">
                {form.locations.map((loc, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-white">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Label</label>
                        <input
                          className="w-full border rounded-md px-3 py-2"
                          placeholder="Paragon / Novena / Main clinic"
                          value={loc.label || ""}
                          onChange={(e) => updateLocation(idx, { label: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input
                          className="w-full border rounded-md px-3 py-2"
                          value={loc.phone || ""}
                          onChange={(e) => updateLocation(idx, { phone: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <input
                          className="w-full border rounded-md px-3 py-2"
                          value={loc.address || ""}
                          onChange={(e) => updateLocation(idx, { address: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Booking URL (optional)</label>
                        <input
                          className="w-full border rounded-md px-3 py-2"
                          placeholder="https://…"
                          value={loc.booking_url || ""}
                          onChange={(e) => updateLocation(idx, { booking_url: e.target.value })}
                        />
                      </div>
                    </div>

                    {form.locations.length > 1 && (
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => removeLocation(idx)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button onClick={onSave} disabled={saving}>
                {saving ? "Saving..." : "Save Specialist"}
              </Button>
              <Button variant="outline" onClick={() => setForm({ ...emptyForm })}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default AdminPartnerSpecialistForm;
