// /src/pages/admin/PartnerSpecialistsAdminPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import {
  ArrowLeft,
  RefreshCw,
  Plus,
  CheckCircle2,
  XCircle,
  Trash2,
  Link as LinkIcon,
  Globe,
  Search as SearchIcon,
} from "lucide-react";
import { supabase } from "../../supabase";

/** ---- Types (tolerant to small schema differences) ---- */
type Row = {
  id: string;
  name: string;                    // doctor's name
  clinic_name: string;
  address?: string | null;
  phone_number?: string | null;
  website?: string | null;
  appointment_url?: string | null;
  profile_url?: string | null;     // if your table uses this
  profile_page_url?: string | null; // (some projects used this name)
  region?: string | null;
  specialties?: string[] | string | null;
  photo_url?: string | null;
  is_active?: boolean;             // in your table listing this exists
  is_approved?: boolean | null;    // some legacy code used this
  display_order?: number | null;
  created_at?: string;
};

type EditForm = {
  name: string;
  clinic_name: string;
  website: string;
  appointment_url: string;
  profile_url: string;
  region: string;
  specialties: string; // comma separated in the form; we convert on save
  photo_url: string;
  is_active: boolean;
  display_order: number;
};

const emptyForm: EditForm = {
  name: "",
  clinic_name: "",
  website: "",
  appointment_url: "",
  profile_url: "",
  region: "",
  specialties: "",
  photo_url: "",
  is_active: true,
  display_order: 100,
};

const PartnerSpecialistsAdminPage: React.FC = () => {
  const nav = useNavigate();

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EditForm>({ ...emptyForm });

  // Discover which optional columns actually exist (profile_url vs profile_page_url, etc.)
  const columnSupport = useMemo(() => {
    const sample = rows[0] || ({} as Row);
    return {
      hasProfileUrl: "profile_url" in sample,
      hasProfilePageUrl: "profile_page_url" in sample,
      hasIsActive: "is_active" in sample,
      hasIsApproved: "is_approved" in sample,
    };
  }, [rows]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("partner_specialists")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setRows([]);
    } else {
      setRows((data || []) as Row[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // Start editing a row
  const startEdit = (r: Row) => {
    setEditingId(r.id);
    setForm({
      name: r.name || "",
      clinic_name: r.clinic_name || "",
      website: r.website || "",
      appointment_url: r.appointment_url || "",
      profile_url: (r.profile_url ?? r.profile_page_url) || "",
      region: r.region || "",
      specialties: Array.isArray(r.specialties)
        ? r.specialties.join(", ")
        : (r.specialties || ""),
      photo_url: r.photo_url || "",
      is_active:
        (columnSupport.hasIsActive && !!r.is_active) ||
        (!columnSupport.hasIsActive && !!r.is_approved),
      display_order:
        typeof r.display_order === "number" ? r.display_order : 100,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
  };

  const onSave = async () => {
    if (!editingId) return;
    if (!form.name.trim() || !form.clinic_name.trim()) {
      alert("Doctor’s name and clinic name are required.");
      return;
    }

    try {
      setSaving(true);

      // Convert specialties to array if possible
      const specialtiesArray = (form.specialties || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      // Build update payload based on columns that actually exist
      const updateFields: any = {
        name: form.name.trim(),
        clinic_name: form.clinic_name.trim(),
        website: form.website.trim() || null,
        appointment_url: form.appointment_url.trim() || null,
        region: form.region || null,
        specialties: specialtiesArray.length ? specialtiesArray : null,
        photo_url: form.photo_url.trim() || null,
        display_order: Number(form.display_order ?? 100),
      };

      // Handle profile link column name
      if (columnSupport.hasProfileUrl) {
        updateFields.profile_url = form.profile_url.trim() || null;
      } else if (columnSupport.hasProfilePageUrl) {
        updateFields.profile_page_url = form.profile_url.trim() || null;
      }

      // Handle status column name
      if (columnSupport.hasIsActive) {
        updateFields.is_active = !!form.is_active;
      } else if (columnSupport.hasIsApproved) {
        updateFields.is_approved = !!form.is_active;
      }

      const { error } = await supabase
        .from("partner_specialists")
        .update(updateFields)
        .eq("id", editingId);

      if (error) throw error;

      await load();
      cancelEdit();
      alert("Saved.");
    } catch (e: any) {
      console.error(e);
      alert(`Save failed: ${e.message || e}`);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (row: Row) => {
    if (!confirm(`Delete "${row.name}" at "${row.clinic_name}"? This cannot be undone.`)) return;
    const { error } = await supabase
      .from("partner_specialists")
      .delete()
      .eq("id", row.id);
    if (error) {
      console.error(error);
      alert("Delete failed.");
      return;
    }
    await load();
  };

  const onToggleActive = async (row: Row) => {
    const next = !(
      (columnSupport.hasIsActive && row.is_active) ||
      (!columnSupport.hasIsActive && row.is_approved)
    );

    const patch: any = {};
    if (columnSupport.hasIsActive) patch.is_active = next;
    else if (columnSupport.hasIsApproved) patch.is_approved = next;

    const { error } = await supabase
      .from("partner_specialists")
      .update(patch)
      .eq("id", row.id);

    if (error) {
      console.error(error);
      alert("Failed to update status.");
      return;
    }
    await load();
  };

  // Quick inline rank-save (no full edit)
  const onQuickRankSave = async (row: Row, rank: number) => {
    const { error } = await supabase
      .from("partner_specialists")
      .update({ display_order: rank })
      .eq("id", row.id);
    if (error) {
      console.error(error);
      alert("Failed to update rank.");
      return;
    }
    await load();
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const blob = `${r.name} ${r.clinic_name} ${r.address ?? ""} ${
        r.region ?? ""
      }`.toLowerCase();
      return blob.includes(q);
    });
  }, [rows, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header bar */}
      <div className="bg-white border-b">
        <Container className="py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button
                className="bg-slate-100 text-slate-700 hover:bg-slate-200"
                onClick={() => nav("/admin/dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
              <h1 className="text-xl font-semibold">
                Partner Specialists Management
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={load}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <a href="/find-a-specialist" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Globe className="h-4 w-4 mr-2" />
                  View Public Directory
                </Button>
              </a>
              <a href="/admin/partner-specialists/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Specialist
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Editor (only when a row is selected) */}
        {editingId && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Edit Specialist</h2>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Doctor’s Name *
                    </label>
                    <input
                      className="w-full border rounded-md px-3 py-2"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Clinic / Centre Name *
                    </label>
                    <input
                      className="w-full border rounded-md px-3 py-2"
                      value={form.clinic_name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, clinic_name: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Clinic Website
                    </label>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 h-10 bg-gray-100 rounded-l-md border border-r-0">
                        <LinkIcon className="h-4 w-4" />
                      </span>
                      <input
                        className="w-full border rounded-r-md px-3 py-2 h-10"
                        placeholder="https://example.com"
                        value={form.website}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, website: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Booking Link (CTA)
                    </label>
                    <input
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="Direct booking URL if any"
                      value={form.appointment_url}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          appointment_url: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Doctor Profile Page URL
                    </label>
                    <input
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="Bio page link"
                      value={form.profile_url}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, profile_url: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Region
                    </label>
                    <input
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="Central / East / West / North / North-East"
                      value={form.region}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, region: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Specialties (comma-separated)
                    </label>
                    <input
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="e.g., Colonoscopy, Robotic surgery"
                      value={form.specialties}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, specialties: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Photo URL
                    </label>
                    <input
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="https://…"
                      value={form.photo_url}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, photo_url: e.target.value }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Display Order (rank)
                      </label>
                      <input
                        type="number"
                        className="w-full border rounded-md px-3 py-2"
                        value={form.display_order}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            display_order: Number(e.target.value || 0),
                          }))
                        }
                      />
                    </div>
                    <label className="flex items-center gap-2 mt-6">
                      <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, is_active: e.target.checked }))
                        }
                      />
                      <span className="text-sm">Active</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button onClick={onSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Toolbar */}
        <div className="mb-4 flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              className="pl-9 pr-3 py-2 border rounded-md w-[320px]"
              placeholder="Search by doctor, clinic, or region…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-600">
            {filtered.length} record{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        {/* List */}
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <p className="text-gray-600">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="text-gray-600">No specialists found.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filtered.map((r) => {
                  const isOn =
                    (columnSupport.hasIsActive && !!r.is_active) ||
                    (!columnSupport.hasIsActive && !!r.is_approved);

                  return (
                    <div
                      key={r.id}
                      className="border rounded-lg p-4 flex gap-4 items-start bg-white"
                    >
                      {r.photo_url ? (
                        <img
                          src={r.photo_url}
                          alt={r.name}
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-100 border" />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold truncate">
                            {r.name}
                          </h3>
                          {isOn ? (
                            <span className="inline-flex items-center text-green-700 bg-green-100 rounded-full px-2 py-0.5 text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-gray-700 bg-gray-100 rounded-full px-2 py-0.5 text-xs">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-700">
                          {r.clinic_name}
                        </div>

                        {/* Quick rank + actions */}
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <label className="text-xs text-gray-500">
                            Rank:
                          </label>
                          <input
                            type="number"
                            defaultValue={
                              typeof r.display_order === "number"
                                ? r.display_order
                                : 100
                            }
                            className="border rounded-md px-2 py-1 w-20"
                            onBlur={(e) =>
                              onQuickRankSave(
                                r,
                                Number((e.target as HTMLInputElement).value || 0)
                              )
                            }
                          />
                          <Button
                            variant="outline"
                            onClick={() => startEdit(r)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant={isOn ? "outline" : "primary"}
                            className={isOn ? "bg-slate-600 hover:bg-slate-700" : ""}
                            onClick={() => onToggleActive(r)}
                          >
                            {isOn ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => onDelete(r)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>

                        {/* Helpful links */}
                        <div className="mt-2 text-xs text-blue-700 flex gap-3">
                          {r.website && (
                            <a href={r.website} target="_blank" rel="noopener noreferrer">
                              Clinic site →
                            </a>
                          )}
                          {(r.profile_url || r.profile_page_url) && (
                            <a
                              href={(r.profile_url || r.profile_page_url)!}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Doctor profile →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default PartnerSpecialistsAdminPage;
