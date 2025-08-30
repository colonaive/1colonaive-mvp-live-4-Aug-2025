// /src/pages/SpecialistPublicForm.tsx
import React, { useState } from "react";
import { supabase } from "../supabase";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";

const SpecialistPublicForm: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    clinic_name: "",
    phone_number: "",
    website: "",
    appointment_url: "",
    profile_url: "",
    region: "",
    photo_url: "",
    credentials: "",
    specialties: "",
    address: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async () => {
    if (!form.name.trim() || !form.clinic_name.trim()) {
      alert("Doctor’s name and clinic name are required.");
      return;
    }
    try {
      const { error } = await supabase.from("partner_specialists").insert([
        {
          ...form,
          specialties: form.specialties
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          is_active: false, // always inactive until admin approves
          is_pending: true,
          submitted_by: "public_form",
        },
      ]);
      if (error) throw error;

      // OPTIONAL: trigger a Netlify Function to send email to admin
      await fetch("/.netlify/functions/notify-admin", {
        method: "POST",
        body: JSON.stringify({
          subject: "New Specialist Submission",
          message: `A new specialist ${form.name} (${form.clinic_name}) has submitted details.`,
        }),
      });

      setSubmitted(true);
    } catch (e: any) {
      alert("Failed: " + e.message);
    }
  };

  if (submitted) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-xl font-semibold">
          Thank you! Your submission has been received and is pending admin
          review.
        </h1>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-xl font-semibold mb-4">
            Submit Your Specialist Profile
          </h1>

          {[
            ["name", "Doctor’s Name *"],
            ["clinic_name", "Clinic / Centre Name *"],
            ["phone_number", "Contact Number"],
            ["website", "Clinic Website"],
            ["appointment_url", "Booking Link"],
            ["profile_url", "Doctor Profile URL"],
            ["region", "Region (Central / East / West / North / NE)"],
            ["photo_url", "Photo URL"],
            ["credentials", "Credentials / Achievements"],
            ["specialties", "Specialties (comma separated)"],
            ["address", "Main Clinic Address"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                className="w-full border rounded-md px-3 py-2"
                value={(form as any)[key]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: e.target.value }))
                }
              />
            </div>
          ))}

          <Button onClick={onSubmit}>Submit for Review</Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SpecialistPublicForm;
