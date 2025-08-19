// src/pages/admin/NewsFeedAdminPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { Container } from "../../components/ui/Container";
import { Button } from "../../components/ui/Button";

type NewsCategory = "clinical" | "policy" | "awareness";
type NewsStatus = "pending" | "approved" | "rejected" | "hidden";

interface NewsItem {
  id: string;
  title: string;
  link: string;
  source_name: string;
  pub_date: string; // ISO
  category: NewsCategory;
  excerpt: string | null;
  thumbnail_url: string | null;
  status: NewsStatus;
  created_at: string;
  updated_at: string;
}

// Using shared supabase client from import

const AdminRow: React.FC<{
  item: NewsItem;
  onChangeStatus: (id: string, status: NewsStatus) => void;
}> = ({ item, onChangeStatus }) => {
  const dateStr = new Date(item.pub_date).toLocaleString();
  return (
    <tr className="border-b">
      <td className="py-3 pr-3 align-top">
        <div className="font-medium">{item.title}</div>
        <div className="text-xs text-gray-500 break-all">{item.link}</div>
        <div className="text-xs text-gray-500">
          {item.source_name} • {dateStr}
        </div>
      </td>
      <td className="py-3 px-3 align-top capitalize">{item.category}</td>
      <td className="py-3 px-3 align-top capitalize">{item.status}</td>
      <td className="py-3 pl-3 align-top">
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onChangeStatus(item.id, "approved")}>
            Approve
          </Button>
          {/* changed from "secondary" -> "outline" */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onChangeStatus(item.id, "rejected")}
          >
            Reject
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onChangeStatus(item.id, "hidden")}
          >
            Hide
          </Button>
        </div>
      </td>
    </tr>
  );
};

const NewsFeedAdminPage: React.FC = () => {
  const [pending, setPending] = useState<NewsItem[]>([]);
  const [approved, setApproved] = useState<NewsItem[]>([]);
  const [form, setForm] = useState({
    title: "",
    link: "",
    source_name: "",
    pub_date: "",
    category: "awareness" as NewsCategory,
    excerpt: "",
    thumbnail_url: ""
  });
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const [p1, p2] = await Promise.all([
      supabase
        .from("news_items")
        .select("*")
        .eq("status", "pending")
        .order("pub_date", { ascending: false }),
      supabase
        .from("news_items")
        .select("*")
        .eq("status", "approved")
        .order("pub_date", { ascending: false })
        .limit(20)
    ]);
    if (!p1.error && p1.data) setPending(p1.data as NewsItem[]);
    if (!p2.error && p2.data) setApproved(p2.data as NewsItem[]);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const upsertManual = async () => {
    if (!form.title || !form.link || !form.source_name || !form.pub_date) {
      alert("Title, Link, Source, and Pub date are required.");
      return;
    }
    // hash = sha256(title|link)
    const enc = new TextEncoder().encode(form.title + "|" + form.link);
    const hashBuffer = await crypto.subtle.digest("SHA-256", enc);
    const hash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const { error } = await supabase.from("news_items").insert({
      title: form.title,
      link: form.link,
      source_name: form.source_name,
      pub_date: new Date(form.pub_date).toISOString(),
      category: form.category,
      excerpt: form.excerpt || null,
      thumbnail_url: form.thumbnail_url || null,
      status: "pending",
      hash
    });
    if (error) {
      alert("Insert failed: " + error.message);
    } else {
      setForm({
        title: "",
        link: "",
        source_name: "",
        pub_date: "",
        category: "awareness",
        excerpt: "",
        thumbnail_url: ""
      });
      await refresh();
    }
  };

  const changeStatus = async (id: string, status: NewsStatus) => {
    const { error } = await supabase
      .from("news_items")
      .update({ status })
      .eq("id", id);
    if (error) alert(error.message);
    await refresh();
  };

  return (
    <section className="py-10">
      <Container>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">News Feed Admin</h1>

        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-3">Add manual item</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="border rounded-lg p-2"
              placeholder="Title*"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              className="border rounded-lg p-2"
              placeholder="Link*"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
            <input
              className="border rounded-lg p-2"
              placeholder="Source name*"
              value={form.source_name}
              onChange={(e) => setForm({ ...form, source_name: e.target.value })}
            />
            <input
              className="border rounded-lg p-2"
              type="datetime-local"
              placeholder="Published at*"
              value={form.pub_date}
              onChange={(e) => setForm({ ...form, pub_date: e.target.value })}
            />
            <select
              className="border rounded-lg p-2"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as NewsCategory })
              }
            >
              <option value="clinical">Clinical</option>
              <option value="policy">Policy</option>
              <option value="awareness">Awareness</option>
            </select>
            <input
              className="border rounded-lg p-2"
              placeholder="Thumbnail URL (optional)"
              value={form.thumbnail_url}
              onChange={(e) =>
                setForm({ ...form, thumbnail_url: e.target.value })
              }
            />
            <textarea
              className="border rounded-lg p-2 sm:col-span-2"
              rows={3}
              placeholder="Excerpt (optional, use publisher meta text)"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />
          </div>
          <div className="mt-3">
            <Button onClick={upsertManual} disabled={loading}>
              Save as Pending
            </Button>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pending items</h2>
          {/* changed from "secondary" -> "outline" */}
          <Button variant="outline" onClick={refresh} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3 font-medium">Item</th>
                <th className="text-left p-3 font-medium">Category</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((it) => (
                <AdminRow key={it.id} item={it} onChangeStatus={changeStatus} />
              ))}
              {pending.length === 0 && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={4}>
                    No pending items.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-semibold mt-8 mb-3">Recently approved</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3 font-medium">Item</th>
                <th className="text-left p-3 font-medium">Category</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {approved.map((it) => (
                <AdminRow key={it.id} item={it} onChangeStatus={changeStatus} />
              ))}
              {approved.length === 0 && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={4}>
                    No approved items yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
};

export default NewsFeedAdminPage;
