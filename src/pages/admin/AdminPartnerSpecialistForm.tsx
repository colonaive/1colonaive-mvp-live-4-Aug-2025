// /src/pages/admin/AdminPartnerSpecialistForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { supabase } from "../../supabase";
import { ArrowLeft, Plus, Trash2, RefreshCw, Link as LinkIcon, Phone } from "lucide-react";

type LocationItem = {
  label?: string;
  address?: string;
  phone?: string;
  booking_url?: string;
};

type SpecialistForm = {
  doctor_name: string;
  clinic_name: string;
  contact_number?: string;
  clinic_website?: string;
  profile_page_url?: string;
  booking_url?: string;
  region?: string;
  specialties?: string;     // comma-separated input; we’ll split before save
  clinic_address?: string;  // legacy single-address (optional)
  photo_url?: string;
  is_approved: boolean;     // UI flag; saved as is_active in DB
  locations: LocationItem[]; // kept for future JSONB column, not saved yet
};

const emptyForm: SpecialistForm = {
  doctor_name: "",
  clinic_name: "",
  contact_number: "",
  clinic_website: "",
  profile_page_url: "",
  booking_url: "",
  region: "",
  specialties: "",
  clinic_address: "",
  photo_url: "",
  is_approved: true,
  locations: [{ label: "Main clinic", address: "", phone: "", booking_url: "" }],
};

const AdminPartnerSpecialistForm: React.FC = () => {
  const nav = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SpecialistForm>({ ...emptyForm });

  // Prefill helper (optional)
  const seedDr = () => {
    setForm((f) => ({
      ...f,
      doctor_name: "Dr Daniel Lee Jin Keat",
      clinic_name: "Seow-Choen Colorectal Centre Pte Ltd",
      clinic_website: "https://www.colorectalsurgeon.com",
      profile_page_url: "https://www.colorectalclinic.com/dr-daniel-lee",
      contact_number: "+65 6738 6887",
      region: "Central",
      specialties: "Colorectal surgery, Robotic surgery, Colonoscopy",
      locations: [
        {
          label: "Paragon",
          address: "Paragon Medical Centre, 290 Orchard Road #06-06, Singapore",
          phone: "+65 6738 6887",
          booking_url: "",
        },
        {
          label: "Novena",
          address:
            "38 Irrawaddy Road #06-30, Mount Elizabeth Novena Specialist Centre, Singapore",
          phone: "+65 6738 6887",
          booking_url: "",
        },
      ],
    }));
  };

  // Locations helpers
  const addLocation = () =>
    setForm((f) => ({
      ...f,
      locations: [
        ...f.locations,
        { label: `Location ${f.locations.length + 1}`, address: "", phone: "", booking_url: "" },
      ],
    }));

  const removeLocation = (idx: number) =>
    setForm((f) => ({ ...f, locations: f.locations.filter((_, i) => i !== idx) }));

  const updateLocation = (idx: number, patch: Partial<LocationItem>) =>
    setForm((f) => {
      const next = [...f.locations];
      next[idx] = { ...next[idx], ...patch };
      return { ...f, locations: next };
    });

  const onSave = async () => {
    if (!form.doctor_name.trim() || !form.clinic_name.trim()) {
      alert("Doctor’s name and clinic name are required.");
      return;
    }
    try {
      setSaving(true);

      // Split specialties into text[]
      const specialtiesArray =
        (form.specialties || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

      // Prefer first location’s address; fall back to legacy clinic_address
      const primaryAddress =
        form.locations?.[0]?.address?.trim() || form.clinic_address?.trim() || null;

      // Map UI fields to your table columns
      const payload: any = {
        // DB: name (doctor’s name)
        name: form.doctor_name.trim(),
        clinic_name: form.clinic_name.trim(),

        // DB: phone_number, website, appointment_url, profile_url
        phone_number: form.contact_number?.trim() || null,
        website: form.clinic_website?.trim() || null,
        appointment_url: form.booking_url?.trim() || null,
        profile_url: form.profile_page_url?.trim() || null,

        region: form.region || null,
        specialties: specialtiesArray.length ? specialtiesArray : null,
        photo_url: form.photo_url?.trim() || null,

        // DB: is_active
        is_active: form.is_approved,

        // DB: address (single)
        address: primaryAddress,
      };

      // NOTE: We are NOT sending `locations` because your table
      // doesn’t have a JSONB `locations` column yet.
      // Add it later, then you can include `locations: form.locations`.

      const { error } = await supabase.from("partner_specialists").insert(payload);
      if (error) throw error;

      alert("Saved.");
      setForm({ ...emptyForm });
      // nav("/admin/partner-specialists"); // enable if you have the list page
    } catch (e: any) {
      console.error(e);
      alert(`Save failed: ${e.message || e}`);
    } finally {
      setSaving(false);
    }
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
                    value={form.doctor_name}
                    onChange={(e) => setForm((f) => ({ ...f, doctor_name: e.target.value }))}
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
                      value={form.contact_number || ""}
                      onChange={(e) => setForm((f) => ({ ...f, contact_number: e.target.value }))}
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
                      value={form.clinic_website || ""}
                      onChange={(e) => setForm((f) => ({ ...f, clinic_website: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Doctor Profile Page URL</label>
                  <input
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Clinic bio page for this doctor"
                    value={form.profile_page_url || ""}
                    onChange={(e) => setForm((f) => ({ ...f, profile_page_url: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Booking Link (CTA)</label>
                  <input
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Direct booking link if available"
                    value={form.booking_url || ""}
                    onChange={(e) => setForm((f) => ({ ...f, booking_url: e.target.value }))}
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

                <div>
                  <label className="block text-sm font-medium mb-1">Specialties (comma-separated)</label>
                  <input
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="e.g., Colorectal surgery, Robotic surgery"
                    value={form.specialties || ""}
                    onChange={(e) => setForm((f) => ({ ...f, specialties: e.target.value }))}
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
                    id="approved"
                    type="checkbox"
                    checked={form.is_approved}
                    onChange={(e) => setForm((f) => ({ ...f, is_approved: e.target.checked }))}
                  />
                  <label htmlFor="approved" className="text-sm">
                    Approved
                  </label>
                </div>
              </div>
            </div>

            {/* Multi-location block */}
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
                  <div key={idx} className="border rounded-lg p-4">
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
