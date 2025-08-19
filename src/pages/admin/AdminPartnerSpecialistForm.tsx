// src/pages/admin/AdminPartnerSpecialistForm.tsx
import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { supabase } from "@/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, CheckCircle, Plus, Save } from "lucide-react";

type FormData = {
  name: string;
  clinic_name: string;
  address: string;
  phone_number: string;
  website: string;
  appointment_url: string;
  /** NEW: dedicated Doctor profile page URL */
  profile_url: string;
  region: string;
  specialties: string; // comma-separated; will be saved as string[]
  photo_url: string;
  display_order: number;
  is_active: boolean;
};

const REGION_OPTIONS = ["North", "South", "East", "West", "Central"];

const AdminPartnerSpecialistForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState<FormData>({
    name: "",
    clinic_name: "",
    address: "",
    phone_number: "",
    website: "",
    appointment_url: "",
    profile_url: "", // NEW
    region: "",
    specialties: "",
    photo_url: "",
    display_order: 100,
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    setForm((p) => ({
      ...p,
      [name]:
        type === "checkbox"
          ? checked
          : name === "display_order"
          ? Number(value)
          : value,
    }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setOkMsg(null);

    try {
      if (!user) throw new Error("You must be logged in.");

      const { error } = await supabase.from("partner_specialists").insert({
        name: form.name.trim(),
        clinic_name: form.clinic_name.trim(),
        address: form.address.trim() || null,
        phone_number: form.phone_number.trim() || null,
        website: form.website.trim() || null,
        appointment_url:
          form.appointment_url.trim() || form.website.trim() || null,
        /** NEW: save profile_url (doctor bio page) */
        profile_url: form.profile_url.trim() || null,
        region: form.region || null,
        specialties: form.specialties
          ? form.specialties
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        photo_url: form.photo_url.trim() || null,
        is_active: form.is_active,
        display_order: form.display_order,
        created_by: user.id,
      });

      if (error) throw error;

      setOkMsg("Partner specialist saved.");
      setTimeout(() => navigate("/find-a-specialist"), 600);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to save.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-20 pb-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Plus className="h-7 w-7 text-indigo-600" /> Add Partner Specialist (Admin)
            </h1>
            <p className="text-gray-600 mt-1">
              Curated listing for the public directory. Only admins can create or edit entries.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg border border-red-300 bg-red-50 text-red-700 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> {errorMsg}
            </div>
          )}
          {okMsg && (
            <div className="mb-4 p-3 rounded-lg border border-green-300 bg-green-50 text-green-700 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" /> {okMsg}
            </div>
          )}

          <Card className="shadow-md">
            <CardContent className="p-6">
              <form onSubmit={onSubmit} className="space-y-8" noValidate>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    name="name"
                    id="name"
                    label="Doctor's Name"
                    value={form.name}
                    onChange={onChange}
                    required
                    placeholder="Dr Francis Seow‑Choen"
                  />
                  <InputField
                    name="clinic_name"
                    id="clinic_name"
                    label="Clinic / Centre Name"
                    value={form.clinic_name}
                    onChange={onChange}
                    required
                    placeholder="Seow‑Choen Colorectal Centre Pte Ltd"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    name="phone_number"
                    id="phone_number"
                    label="Contact Number"
                    value={form.phone_number}
                    onChange={onChange}
                    placeholder="+65 6738 6887"
                  />
                  <InputField
                    name="website"
                    id="website"
                    label="Clinic Website"
                    value={form.website}
                    onChange={onChange}
                    placeholder="https://www.colorectalcentre.com"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    name="appointment_url"
                    id="appointment_url"
                    label="Appointment/Booking Link (CTA)"
                    value={form.appointment_url}
                    onChange={onChange}
                    placeholder="Direct booking URL (if different from website)"
                  />
                  <InputField
                    name="profile_url"
                    id="profile_url"
                    label="Doctor Profile Page URL"
                    value={form.profile_url}
                    onChange={onChange}
                    placeholder="https://www.colorectalcentre.com/profile/about-prof-seow"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                    <select
                      name="region"
                      value={form.region}
                      onChange={onChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Select region</option>
                      {REGION_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <InputField
                    name="address"
                    id="address"
                    label="Clinic Address"
                    value={form.address}
                    onChange={onChange}
                    placeholder="Paragon Medical Centre, 290 Orchard Road #06‑06, Singapore 238859"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    name="specialties"
                    id="specialties"
                    label="Specialties (comma‑separated)"
                    value={form.specialties}
                    onChange={onChange}
                    placeholder="Colonoscopy (Screening), Polypectomy, CRC Treatment"
                  />
                  <InputField
                    name="photo_url"
                    id="photo_url"
                    label="Photo URL"
                    value={form.photo_url}
                    onChange={onChange}
                    placeholder="https://.../doctor.jpg"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    name="display_order"
                    id="display_order"
                    label="Display Order (lower appears first)"
                    type="number"
                    value={String(form.display_order)}
                    onChange={onChange}
                  />
                  <div className="flex items-center mt-6">
                    <input
                      id="is_active"
                      name="is_active"
                      type="checkbox"
                      checked={form.is_active}
                      onChange={onChange}
                      className="mr-2"
                    />
                    <label htmlFor="is_active" className="text-sm text-gray-800">
                      Active (visible on site)
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={submitting} className="flex items-center">
                    {submitting ? (
                      <Save className="h-4 w-4 mr-2 animate-pulse" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Partner Specialist
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default AdminPartnerSpecialistForm;
