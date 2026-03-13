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
  Image as ImageIcon,
  Send,
  ExternalLink,
  BarChart3,
  X,
} from 'lucide-react';
import { cockpitService, type LinkedInPost } from '@/services/cockpitService';
import { useNavigate } from 'react-router-dom';

/* ── toast notification ── */

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastId = 0;

const ToastContainer: React.FC<{ toasts: Toast[]; onDismiss: (id: number) => void }> = ({
  toasts,
  onDismiss,
}) => (
  <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-slide-in ${
          t.type === 'success'
            ? 'bg-emerald-600 text-white'
            : t.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-[#0A385A] text-white'
        }`}
      >
        {t.type === 'success' && <CheckCircle size={16} />}
        {t.type === 'error' && <AlertCircle size={16} />}
        {t.type === 'info' && <Linkedin size={16} />}
        <span>{t.message}</span>
        <button onClick={() => onDismiss(t.id)} className="ml-2 opacity-70 hover:opacity-100">
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
);

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

/* ── LinkedIn-style preview (live synced) ── */

const LinkedInPreview: React.FC<{
  title: string;
  content: string;
  hashtags: string;
  sourceUrl: string;
  imageUrl?: string | null;
  imagePrompt?: string;
}> = ({ title, content, hashtags, sourceUrl, imageUrl, imagePrompt }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    {/* Profile header */}
    <div className="flex items-center gap-3 p-4 pb-2">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0A385A] to-[#0F766E] flex items-center justify-center text-white font-bold text-lg">
        MC
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">M. Chandramohan</p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          Founder &amp; CEO, Saver&apos;s Med | ColonAiVE Movement
        </p>
        <p className="text-[10px] text-gray-400">Just now</p>
      </div>
    </div>

    {/* Body — live synced from editor */}
    <div className="px-4 pb-3">
      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{title}</p>
      <div className="text-[13px] text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
        {content}
      </div>
    </div>

    {/* Image — real image if available, otherwise prompt placeholder */}
    {imageUrl ? (
      <div className="mx-4 mb-3">
        <img
          src={imageUrl}
          alt="Generated post image"
          className="w-full rounded-lg object-cover max-h-64"
        />
      </div>
    ) : imagePrompt ? (
      <div className="mx-4 mb-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center min-h-[100px]">
        <ImageIcon size={24} className="text-gray-400 mb-2" />
        <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center italic line-clamp-2">
          {imagePrompt}
        </p>
      </div>
    ) : null}

    {/* Source link */}
    {sourceUrl && (
      <div className="mx-4 mb-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline truncate block"
        >
          {sourceUrl}
        </a>
      </div>
    )}

    {/* Hashtags */}
    {hashtags && (
      <div className="px-4 pb-2">
        <p className="text-[12px] text-blue-600 dark:text-blue-400">{hashtags}</p>
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
  const [publishing, setPublishing] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Editor state — all fields synced live to preview
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editHashtags, setEditHashtags] = useState('');
  const [editImagePrompt, setEditImagePrompt] = useState('');
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

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

  // Load post into editor when selection changes
  useEffect(() => {
    if (selectedPost) {
      setEditTitle(selectedPost.title);
      setEditContent(selectedPost.draft_content || '');
      setEditHashtags(selectedPost.hashtags || '');
      setEditImagePrompt(selectedPost.image_prompt || '');
      setEditImageUrl(selectedPost.image_url || null);
    }
  }, [selectedPost]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await cockpitService.generateLinkedInPosts();
      if (result.generated > 0) {
        await loadPosts();
      }
      addToast(`Generated ${result.generated} new post(s) from ${result.scanned} articles.`, 'success');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Generation failed', 'error');
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
        image_url: editImageUrl,
        status: 'draft',
      });
      await loadPosts();
      addToast('Draft saved.', 'success');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Save failed', 'error');
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
      addToast('Post marked as published.', 'success');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    const fullText = `${editTitle}\n\n${editContent}\n\n${editHashtags}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      addToast('Post copied to clipboard.', 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleGenerateImage = async () => {
    if (!editImagePrompt || !selectedId) return;
    setGeneratingImage(true);
    addToast('Generating image with DALL-E 3...', 'info');
    try {
      const result = await cockpitService.generatePostImage(editImagePrompt, selectedId);
      setEditImageUrl(result.image_url);
      await loadPosts();
      addToast('Image generated successfully.', 'success');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Image generation failed', 'error');
    } finally {
      setGeneratingImage(false);
    }
  };

  const handlePublishToLinkedIn = async () => {
    if (!selectedId || !selectedPost) return;
    setPublishing(true);
    addToast('Publishing to LinkedIn...', 'info');
    try {
      const fullText = `${editTitle}\n\n${editContent}\n\n${editHashtags}`;
      const result = await cockpitService.publishToLinkedIn(
        selectedId,
        fullText,
        selectedPost.source_url,
        editImageUrl || undefined,
      );
      if (result.success) {
        await loadPosts();
        addToast('Published to LinkedIn!', 'success');
        setSelectedId(null);
      } else {
        addToast(result.error || 'LinkedIn publish failed', 'error');
      }
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Publish failed', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const postTypeLabel = (post: LinkedInPost): string => {
    if (post.colonaiq_context) return 'Blood-Based Screening';
    if ((post.relevance_score || 0) >= 50) return 'High-Relevance Research';
    return 'CRC Awareness';
  };

  const pendingCount = posts.filter((p) => p.status !== 'posted').length;
  const postedThisWeek = posts.filter((p) => {
    if (p.status !== 'posted' || !p.posted_at) return false;
    return (Date.now() - new Date(p.posted_at).getTime()) < 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

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
                    Click &quot;Generate&quot; to scan CRC news.
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
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-gray-400">{postTypeLabel(post)}</p>
                      {post.linkedin_url && (
                        <a
                          href={post.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] text-blue-500 hover:underline flex items-center gap-0.5"
                        >
                          <ExternalLink size={10} /> View
                        </a>
                      )}
                    </div>
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

                {/* Image Prompt + Generate Image */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Image Prompt
                  </label>
                  <div className="flex gap-2">
                    <textarea
                      value={editImagePrompt}
                      onChange={(e) => setEditImagePrompt(e.target.value)}
                      rows={2}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[12px] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none resize-y italic"
                    />
                    <button
                      onClick={handleGenerateImage}
                      disabled={generatingImage || !editImagePrompt}
                      className="self-end px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {generatingImage ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <ImageIcon size={14} />
                      )}
                    </button>
                  </div>
                  {editImageUrl && (
                    <div className="mt-2">
                      <img
                        src={editImageUrl}
                        alt="Generated"
                        className="w-full rounded-lg max-h-40 object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Performance placeholder */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 size={14} className="text-gray-400" />
                    <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Performance
                    </p>
                  </div>
                  {selectedPost.status === 'posted' ? (
                    <div className="flex gap-4 text-[11px] text-gray-500 dark:text-gray-400">
                      <span>Views: 0</span>
                      <span>Likes: 0</span>
                      <span>Comments: 0</span>
                      <span>Shares: 0</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic">
                      Analytics available after publishing.
                    </p>
                  )}
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
                    onClick={handlePublishToLinkedIn}
                    disabled={publishing || selectedPost.status === 'posted'}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0077B5] hover:bg-[#006097] text-white text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {publishing ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                    Publish to LinkedIn
                  </button>
                  <button
                    onClick={handleMarkPosted}
                    disabled={saving || selectedPost.status === 'posted'}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    <CheckCircle size={14} />
                    Mark As Posted
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Preview — live synced */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Post Preview
                </h2>
                <p className="text-[10px] text-gray-400 mt-0.5">Live synced with editor</p>
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
                    hashtags={editHashtags}
                    sourceUrl={selectedPost.source_url}
                    imageUrl={editImageUrl}
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
