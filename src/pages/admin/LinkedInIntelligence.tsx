import React, { useState, useEffect, useCallback } from 'react';
import {
  Linkedin,
  RefreshCw,
  AlertCircle,
  Copy,
  CheckCircle,
  Sparkles,
  Eye,
  ArrowLeft,
  Image,
} from 'lucide-react';
import { cockpitService, type LinkedInPost } from '@/services/cockpitService';
import { useNavigate } from 'react-router-dom';

/* ── status badge ── */

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  draft: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  posted: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wide ${statusColors[status] || statusColors.new}`}
  >
    {status}
  </span>
);

/* ── LinkedIn-style preview ── */

const LinkedInPreview: React.FC<{ title: string; content: string; imagePrompt?: string }> = ({
  title,
  content,
  imagePrompt,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    {/* Profile header */}
    <div className="flex items-center gap-3 p-4 pb-2">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0A385A] to-[#0F766E] flex items-center justify-center text-white font-bold text-lg">
        MC
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">M. Chandramohan</p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          Founder &amp; CEO, Saver's Med | ColonAiVE Movement
        </p>
        <p className="text-[10px] text-gray-400">Just now</p>
      </div>
    </div>

    {/* Body */}
    <div className="px-4 pb-3">
      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{title}</p>
      <div className="text-[13px] text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
        {content}
      </div>
    </div>

    {/* Image placeholder */}
    {imagePrompt && (
      <div className="mx-4 mb-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center min-h-[120px]">
        <Image size={28} className="text-gray-400 mb-2" />
        <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center italic">
          {imagePrompt}
        </p>
      </div>
    )}

    {/* Engagement bar */}
    <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2 flex justify-around text-[11px] text-gray-500 dark:text-gray-400 font-medium">
      <span>Like</span>
      <span>Comment</span>
      <span>Repost</span>
      <span>Send</span>
    </div>
  </div>
);

/* ── main page ── */

const LinkedInIntelligence: React.FC = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editor state
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editHashtags, setEditHashtags] = useState('');
  const [editImagePrompt, setEditImagePrompt] = useState('');

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cockpitService.fetchLinkedInPosts(filter || undefined);
      setPosts(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const selectedPost = posts.find((p) => p.id === selectedId) || null;

  // Load post into editor
  useEffect(() => {
    if (selectedPost) {
      setEditTitle(selectedPost.title);
      setEditContent(selectedPost.draft_content || '');
      setEditHashtags(selectedPost.hashtags || '');
      setEditImagePrompt(selectedPost.image_prompt || '');
    }
  }, [selectedPost]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await cockpitService.generateLinkedInPosts();
      if (result.generated > 0) {
        await loadPosts();
      }
      alert(`Generated ${result.generated} new post(s) from ${result.scanned} articles.`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true);
    try {
      await cockpitService.updateLinkedInPost(selectedId, {
        draft_content: editContent,
        hashtags: editHashtags,
        image_prompt: editImagePrompt,
        status: 'draft',
      });
      await loadPosts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkPosted = async () => {
    if (!selectedId) return;
    setSaving(true);
    try {
      await cockpitService.updateLinkedInPost(selectedId, { status: 'posted' });
      await loadPosts();
      setSelectedId(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    const text = `${editTitle}\n\n${editContent}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const postTypeLabel = (post: LinkedInPost): string => {
    if (post.colonaiq_context) return 'Blood-Based Screening';
    if ((post.relevance_score || 0) >= 50) return 'High-Relevance Research';
    return 'CRC Awareness';
  };

  const pendingCount = posts.filter((p) => p.status !== 'posted').length;
  const postedThisWeek = posts.filter((p) => {
    if (p.status !== 'posted' || !p.posted_at) return false;
    const d = new Date(p.posted_at);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A385A] to-[#0F766E] px-6 py-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate('/admin/ceo-cockpit')}
              className="text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <Linkedin size={22} className="text-white" />
            <h1 className="text-xl font-bold text-white">LinkedIn Intelligence</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/70">
            <span>{pendingCount} pending</span>
            <span>{postedThisWeek} posted this week</span>
          </div>
        </div>
      </div>

      {/* Body — three-panel */}
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* LEFT: Post Opportunities */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Curated Post Opportunities
              </h2>

              {/* Filter tabs */}
              <div className="flex gap-1 mb-3">
                {['', 'new', 'draft', 'posted'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      filter === f
                        ? 'bg-[#0F766E] text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {f || 'All'}
                  </button>
                ))}
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#0A385A] hover:bg-[#0A385A]/90 text-white text-xs font-medium transition-colors disabled:opacity-50"
              >
                {generating ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                {generating ? 'Generating...' : 'Generate From CRC News'}
              </button>
            </div>

            {/* Post list */}
            <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw size={18} className="animate-spin text-gray-400" />
                  <span className="ml-2 text-xs text-gray-400">Loading...</span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center py-8 text-center px-4">
                  <AlertCircle size={20} className="text-amber-400 mb-2" />
                  <p className="text-xs text-amber-600 dark:text-amber-400">{error}</p>
                  <button
                    onClick={loadPosts}
                    className="mt-2 text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Retry
                  </button>
                </div>
              ) : posts.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center px-4">
                  <Linkedin size={28} className="text-gray-300 dark:text-gray-600 mb-2" />
                  <p className="text-xs text-gray-400">No post opportunities yet.</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Click "Generate" to scan CRC news.
                  </p>
                </div>
              ) : (
                posts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => setSelectedId(post.id)}
                    className={`w-full text-left p-3 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors ${
                      selectedId === post.id
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2 flex-1">
                        {post.title}
                      </p>
                      <StatusBadge status={post.status} />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-blue-600 dark:text-blue-400">
                        {post.source_name || 'Unknown'}
                      </span>
                      {post.relevance_score != null && (
                        <span className="text-[10px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                          {post.relevance_score}%
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{postTypeLabel(post)}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* CENTER: Editor */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                LinkedIn Post Editor
              </h2>
            </div>

            {!selectedPost ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <Eye size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-xs text-gray-400">Select a post opportunity to edit.</p>
              </div>
            ) : (
              <div className="p-4 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
                {/* Title */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none"
                  />
                </div>

                {/* Post Content */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Post Content
                  </label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={12}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none resize-y"
                  />
                </div>

                {/* Hashtags */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Hashtags
                  </label>
                  <input
                    type="text"
                    value={editHashtags}
                    onChange={(e) => setEditHashtags(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none"
                  />
                </div>

                {/* Source Link */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Source Link
                  </label>
                  <a
                    href={selectedPost.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {selectedPost.source_url}
                  </a>
                </div>

                {/* ColonAiQ Context */}
                {selectedPost.colonaiq_context && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                    <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                      ColonAiQ Context Included
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                      This post includes the ColonAiQ screening context block because the article
                      mentions blood-based screening topics.
                    </p>
                  </div>
                )}

                {/* Image Prompt */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Image Prompt
                  </label>
                  <textarea
                    value={editImagePrompt}
                    onChange={(e) => setEditImagePrompt(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[12px] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none resize-y italic"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F766E] hover:bg-[#0F766E]/90 text-white text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {saving ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    Save Draft
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium transition-colors"
                  >
                    {copied ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy Post'}
                  </button>
                  <button
                    onClick={handleMarkPosted}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    <CheckCircle size={14} />
                    Mark As Posted
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Preview */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Post Preview
                </h2>
              </div>

              <div className="p-4">
                {!selectedPost ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Linkedin size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-xs text-gray-400">
                      Select a post to see the LinkedIn preview.
                    </p>
                  </div>
                ) : (
                  <LinkedInPreview
                    title={editTitle}
                    content={editContent}
                    imagePrompt={editImagePrompt || undefined}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInIntelligence;
