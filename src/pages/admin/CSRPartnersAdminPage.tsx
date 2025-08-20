// /src/pages/admin/CSRPartnersAdminPage.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus, RefreshCw, Eye, Trash2, Loader2, Crown } from 'lucide-react';

type Partner = {
  id: string;
  company_name: string;
  slug: string | null;
  website: string | null;
  blurb_short: string | null;
  pledge_amount: number | null;
  donation_tier: string | null;
  donation_tier_override: string | null;
  brands_csv: string | null;
  tribute: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  featured: boolean;
  active: boolean;
  display_order: number | null;
  status: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const EMPTY_PARTNER: Partner = {
  id: '',
  company_name: '',
  slug: null,
  website: null,
  blurb_short: null,
  pledge_amount: null,
  donation_tier: null,
  donation_tier_override: null,
  brands_csv: null,
  tribute: null,
  logo_url: null,
  hero_image_url: null,
  featured: false,
  active: true,
  display_order: 999,
  status: 'draft',
};

const TIER_OPTIONS = ['', 'Supporter', 'Gold', 'Platinum', 'Diamond'];

const CSRPartnersAdminPage: React.FC = () => {
  const [rows, setRows] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partner>(EMPTY_PARTNER);
  const [filter, setFilter] = useState<string>('');

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from<Partner>('csr_partners')
      .select('*')
      .order('display_order', { ascending: true })
      .order('company_name', { ascending: true });

    if (error) {
      console.error('Fetch partners failed:', error.message);
    } else {
      setRows(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const startCreate = () => {
    setEditing({ ...EMPTY_PARTNER, id: crypto.randomUUID() });
    window.scrollTo(0, 0);
  };

  const startEdit = (p: Partner) => {
    setEditing({ ...p });
    window.scrollTo(0, 0);
  };

  const resetForm = () => setEditing(EMPTY_PARTNER);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setEditing((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'display_order'
          ? (value === '' ? null : Number(value))
          : name === 'pledge_amount'
          ? (value === '' ? null : Number(value))
          : value === '' ? null : value,
    }));
  };

  const save = async () => {
    setSaving(true);

    const payload: Partial<Partner> & { id: string } = {
      id: editing.id || crypto.randomUUID(),
      company_name: editing.company_name,
      website: editing.website ?? null,
      blurb_short: editing.blurb_short ?? null,
      pledge_amount: editing.pledge_amount ?? null,
      donation_tier_override: editing.donation_tier_override ?? null,
      brands_csv: editing.brands_csv ?? null,
      tribute: editing.tribute ?? null,
      logo_url: editing.logo_url ?? null,
      hero_image_url: editing.hero_image_url ?? null,
      featured: !!editing.featured,
      active: !!editing.active,
      display_order: editing.display_order ?? null,
      status: editing.status ?? 'draft',
    };

    const { data, error } = await supabase
      .from('csr_partners')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    setSaving(false);

    if (error) {
      console.error('Save failed:', error.message);
      alert('Save failed: ' + error.message);
      return;
    }

    await fetchRows();
    if (data) setEditing(data as Partner);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this CSR partner?')) return;
    setDeleting(id);
    const { error } = await supabase.from('csr_partners').delete().eq('id', id);
    setDeleting(null);
    if (error) {
      console.error('Delete failed:', error.message);
      alert('Delete failed: ' + error.message);
      return;
    }
    if (editing.id === id) resetForm();
    fetchRows();
  };

  const filtered = rows.filter((r) =>
    [r.company_name, r.slug ?? '', r.donation_tier ?? '', r.status ?? '']
      .join(' ')
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage CSR Partners</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchRows}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Partner
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name *</label>
              <input
                name="company_name"
                value={editing.company_name}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                placeholder="ACME Pte Ltd"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                name="website"
                value={editing.website ?? ''}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                placeholder="https://example.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Short Blurb</label>
              <textarea
                name="blurb_short"
                value={editing.blurb_short ?? ''}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                rows={2}
                placeholder="One-line description for showcase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pledge Amount (S$)</label>
              <input
                name="pledge_amount"
                type="number"
                min={0}
                step="100"
                value={editing.pledge_amount ?? ''}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                placeholder="35500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tier is computed automatically from current unit cost.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tier Override (optional)</label>
              <select
                name="donation_tier_override"
                value={editing.donation_tier_override ?? ''}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              >
                {TIER_OPTIONS.map((t) => (
                  <option key={t} value={t || ''}>
                    {t || '(none)'}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                If set, this will display instead of the computed tier.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Brands (CSV)</label>
              <input
                name="brands_csv"
                value={editing.brands_csv ?? ''}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Brand1,Brand2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tribute</label>
              <input
                name="tribute"
                value={editing.tribute ?? ''}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                placeholder="In memory of..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Logo URL</label>
              <input
                name="logo_url"
                value={editing.logo_url ?? ''}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hero Image URL</label>
              <input
                name="hero_image_url"
                value={editing.hero_image_url ?? ''}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Featured</label>
              <input
                type="checkbox"
                name="featured"
                checked={!!editing.featured}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Active</label>
              <input
                type="checkbox"
                name="active"
                checked={!!editing.active}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Display Order</label>
              <input
                name="display_order"
                type="number"
                value={editing.display_order ?? ''}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={editing.status ?? 'draft'}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              >
                {['draft', 'pending', 'approved', 'rejected'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={save} disabled={saving || !editing.company_name}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save Partner
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Clear
            </Button>
            {editing.slug ? (
              <a
                href={`/csr/${editing.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:underline"
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </a>
            ) : null}
            {editing.donation_tier || editing.donation_tier_override ? (
              <span className="ml-auto inline-flex items-center text-sm px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <Crown className="h-4 w-4 mr-1" />
                {(editing.donation_tier_override || editing.donation_tier || '').toString()}
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">All Partners</h2>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name, slug, tier, status..."
          className="border rounded-md px-3 py-2 w-64"
        />
      </div>

      <div className="overflow-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-3 py-2 w-12">#</th>
              <th className="text-left px-3 py-2">Company</th>
              <th className="text-left px-3 py-2">Slug</th>
              <th className="text-left px-3 py-2">Tier</th>
              <th className="text-left px-3 py-2">Override</th>
              <th className="text-left px-3 py-2">Featured</th>
              <th className="text-left px-3 py-2">Active</th>
              <th className="text-left px-3 py-2">Order</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-right px-3 py-2 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="px-3 py-6 text-center text-gray-500">
                  <Loader2 className="h-5 w-5 inline-block mr-2 animate-spin" />
                  Loading partners…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-3 py-6 text-center text-gray-500">
                  No partners found.
                </td>
              </tr>
            ) : (
              filtered.map((p, idx) => (
                <tr key={p.id} className="border-t">
                  <td className="px-3 py-2">{idx + 1}</td>
                  <td className="px-3 py-2 font-medium">{p.company_name}</td>
                  <td className="px-3 py-2">{p.slug}</td>
                  <td className="px-3 py-2">{p.donation_tier}</td>
                  <td className="px-3 py-2">{p.donation_tier_override}</td>
                  <td className="px-3 py-2">{p.featured ? 'Yes' : 'No'}</td>
                  <td className="px-3 py-2">{p.active ? 'Yes' : 'No'}</td>
                  <td className="px-3 py-2">{p.display_order}</td>
                  <td className="px-3 py-2">{p.status}</td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => startEdit(p)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => remove(p.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        disabled={deleting === p.id}
                      >
                        {deleting === p.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CSRPartnersAdminPage;
