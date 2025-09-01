// /src/pages/public/SpecialistSelfSignup.tsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { supabase } from "@/supabase";
import { Plus, X as XIcon } from "lucide-react";

type Form = {
  name: string;
  clinic_name: string;
  website: string;
  appointment_url: string;
  profile_url: string;
  region: string;
  specialties: string; // comma separated
  photo_url: string;
  locations: string[]; // addresses only (simple)
  phone_number: string;
};

const empty: Form = {
  name: "",
  clinic_name: "",
  website: "",
  appointment_url: "",
  profile_url: "",
  region: "",
  specialties: "",
  photo_url: "",
  locations: [""],
  phone_number: "",
};

const SpecialistSelfSignup: React.FC = () => {
  const [form, setForm] = useState<Form>({ ...empty });
  const [saving, setSaving] = useState(false);

  const addLoc = () => setForm((f) => ({ ...f, locations: [...f.locations, ""] }));
  const rmLoc = (idx: number) =>
    setForm((f) => {
      const next = f.locations.filter((_, i) => i !== idx);
      return { ...f, locations: next.length ? next : [""] };
    });
  const setLoc = (idx: number, v: string) =>
    setForm((f) => {
      const next = [...f.locations];
      next[idx] = v;
      return { ...f, locations: next };
    });

  const onSubmit = async () => {
    if (!form.name.trim() || !form.clinic_name.trim()) {
      alert("Doctor's name and clinic / centre name are required.");
      return;
    }
    try {
      setSaving(true);

      const specialtiesArray = (form.specialties || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const cleanedLocations = Array.from(
        new Set(form.locations.map((l) => l.trim()).filter(Boolean))
      );

      // save as pending (inactive) - admin will review and activate
      const payload: any = {
        name: form.name.trim(),
        clinic_name: form.clinic_name.trim(),
        website: form.website.trim() || null,
        appointment_url: form.appointment_url.trim() || null,
        profile_url: form.profile_url.trim() || null,
        region: form.region || null,
        specialties: specialtiesArray.length ? specialtiesArray : null,
        photo_url: form.photo_url.trim() || null,
        phone_number: form.phone_number.trim() || null,
        display_order: 100,
        is_active: false, // IMPORTANT: pending
        // legacy single address + multi addresses
        address: cleanedLocations[0] ?? null,
        locations: cleanedLocations.length ? cleanedLocations : null,
      };

      const { error } = await supabase.from("partner_specialists").insert([payload]);
      if (error) throw error;

      // Notify admin by email
      try {
        await fetch("/.netlify/functions/notify-admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: "New specialist self-submission (Pending Review)",
            message:
              `A specialist submitted a new listing for review:\n` +
              `Name: ${form.name}\nClinic: ${form.clinic_name}\nRegion: ${form.region}\n` +
              `Website: ${form.website}\nProfile: ${form.profile_url}\n` +
              `Addresses: ${cleanedLocations.join(" | ")}`,
          }),
        });
      } catch {
        // ignore email errors for user UX
      }

      alert(
        "Thank you! Your details have been submitted for review. Our team will verify and approve shortly."
      );
      setForm({ ...empty });
    } catch (e: any) {
      console.error(e);
      alert(`Submission failed: ${e.message || e}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <Container className="py-6">
          <h1 className="text-2xl font-bold">COLONAiVE™ Partner Specialist - Self Sign-Up</h1>
          <p className="text-gray-600 mt-1">
            Complete this form to request a listing. Submissions are reviewed by our admin team before going live.
          </p>
        </Container>
      </div>

      <Container className="py-8">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Doctor's Name *</label>
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
                  <label className="block text-sm font-medium mb-1">Clinic Website</label>
                  <input
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="https://…"
                    value={form.website}
                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Doctor Profile Page URL</label>
                  <input
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Clinic bio page"
                    value={form.profile_url}
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
                    value={form.appointment_url}
                    onChange={(e) => setForm((f) => ({ ...f, appointment_url: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Region</label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={form.region}
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
                  <label className="block text-sm font-medium mb-1">Contact Number</label>
                  <input
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="+65 …"
                    value={form.phone_number}
                    onChange={(e) => setForm((f) => ({ ...f, phone_number: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Treatments & Specialties (comma-separated)</label>
                  <input
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="e.g., Colonoscopy, Robotic colorectal surgery"
                    value={form.specialties}
                    onChange={(e) => setForm((f) => ({ ...f, specialties: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Locations */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Clinic Address(es)</h3>
                <Button variant="outline" onClick={addLoc}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add address
                </Button>
              </div>
              <div className="space-y-3">
                {form.locations.map((loc, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      className="flex-1 border rounded-md px-3 py-2"
                      placeholder="e.g., 290 Orchard Rd #06-06, Singapore 238859"
                      value={loc}
                      onChange={(e) => setLoc(idx, e.target.value)}
                    />
                    <Button
                      variant="outline"
                      className="px-3"
                      onClick={() => rmLoc(idx)}
                      disabled={form.locations.length === 1}
                      title="Remove"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                We'll save all addresses. The first address will appear as the main location.
              </p>
            </div>

            <div className="pt-2">
              <Button onClick={onSubmit} disabled={saving}>
                {saving ? "Submitting…" : "Submit for Review"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default SpecialistSelfSignup;
