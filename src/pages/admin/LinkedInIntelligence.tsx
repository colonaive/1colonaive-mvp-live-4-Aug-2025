import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Linkedin,
  RefreshCw,
  AlertCircle,
  Copy,
  CheckCircle,
  Sparkles,
  Eye,
  EyeOff,
  ArrowLeft,
  Image as ImageIcon,
  Send,
  ExternalLink,
  BarChart3,
  X,
  Radar,
  GripVertical,
  List,
  PenLine,
  Wand2,
  RotateCcw,
  Palette,
  ScrollText,
  RotateCw,
} from 'lucide-react';
import type { CockpitAction, ActionType } from '@/types/action';
import { cockpitService, type LinkedInPost } from '@/services/cockpitService';
import { competitiveIntelligenceService } from '@/services/competitiveIntelligenceService';
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
        {content || 'Key update generated from CRC intelligence. Review content before publishing.'}
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

/* ── resize handle ── */

const ResizeHandle: React.FC<{
  onDragStart: () => void;
  onDrag: (deltaX: number) => void;
}> = ({ onDragStart, onDrag }) => {
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onDragStart();
      const startX = e.clientX;
      const onMouseMove = (ev: MouseEvent) => {
        onDrag(ev.clientX - startX);
      };
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [onDragStart, onDrag],
  );

  return (
    <div
      onMouseDown={onMouseDown}
      className="hidden lg:flex w-2 flex-shrink-0 cursor-col-resize items-center justify-center group hover:bg-[#0F766E]/10 transition-colors rounded"
      title="Drag to resize"
    >
      <GripVertical size={14} className="text-gray-300 group-hover:text-[#0F766E] transition-colors" />
    </div>
  );
};

/* ── panel toggle button ── */

const PanelToggle: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
      active
        ? 'bg-white/20 text-white'
        : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70'
    }`}
    title={`${active ? 'Hide' : 'Show'} ${label}`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

/* ── image style presets ── */

const IMAGE_STYLE_PRESETS: { label: string; suffix: string }[] = [
  { label: 'Clean Medical', suffix: 'clean medical illustration, teal and white palette, modern healthcare design, abstract scientific aesthetic' },
  { label: 'Professional Corporate', suffix: 'professional corporate design, navy and silver palette, sleek modern business style, subtle medical iconography' },
  { label: 'Public Health Campaign', suffix: 'public health awareness campaign style, warm inviting colors, community health feel, accessible and inclusive design' },
  { label: 'Minimal Icon Style', suffix: 'minimalist icon-based design, flat vector style, single accent color on white, clean geometric shapes, modern infographic aesthetic' },
];

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

  // Manual source state
  const [manualUrl, setManualUrl] = useState('');
  const [manualText, setManualText] = useState('');
  const [manualGenerating, setManualGenerating] = useState(false);

  // Radar generation state
  const [radarGenerating, setRadarGenerating] = useState(false);

  // Image prompt improvement state
  const [improvingPrompt, setImprovingPrompt] = useState(false);
  const [selectedStylePreset, setSelectedStylePreset] = useState('');

  // Action engine state
  const [actions, setActions] = useState<CockpitAction[]>([]);
  const [showActionLog, setShowActionLog] = useState(true);
  const actionIdRef = useRef(0);

  const createAction = useCallback(
    (type: ActionType, input: Record<string, unknown>, retryFn?: () => void): string => {
      const id = `action-${++actionIdRef.current}`;
      const action: CockpitAction = {
        id,
        type,
        status: 'pending',
        input,
        created_at: new Date().toISOString(),
        retry: retryFn,
      };
      setActions((prev) => [action, ...prev]);
      return id;
    },
    [],
  );

  const updateAction = useCallback(
    (id: string, updates: Partial<CockpitAction>) => {
      setActions((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    },
    [],
  );

  // Editor state — all fields synced live to preview
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editHashtags, setEditHashtags] = useState('');
  const [editImagePrompt, setEditImagePrompt] = useState('');
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);

  // Panel visibility & width state
  const [showSources, setShowSources] = useState(true);
  const [showEditor, setShowEditor] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  // Base widths as percentages (when all three panels visible: 25/42/33)
  const [baseWidths, setBaseWidths] = useState([25, 42, 33]);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartWidths = useRef<number[]>([25, 42, 33]);

  // Compute effective widths based on which panels are visible
  const visiblePanels = [showSources, showEditor, showPreview];
  const visibleCount = visiblePanels.filter(Boolean).length;
  const effectiveWidths = (() => {
    if (visibleCount === 0) return [0, 0, 0];
    const totalVisible = baseWidths.reduce((sum, w, i) => sum + (visiblePanels[i] ? w : 0), 0);
    return baseWidths.map((w, i) => (visiblePanels[i] ? (w / totalVisible) * 100 : 0));
  })();

  const snapshotWidths = useCallback(() => {
    dragStartWidths.current = [...baseWidths];
  }, [baseWidths]);

  const handleDragLeft = useCallback(
    (deltaX: number) => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const deltaPct = (deltaX / containerWidth) * 100;
      const snap = dragStartWidths.current;
      const minW = 15;
      const newLeft = Math.max(minW, Math.min(snap[0] + deltaPct, 100 - snap[2] - minW));
      const newCenter = 100 - newLeft - snap[2];
      if (newCenter < minW) return;
      setBaseWidths([newLeft, newCenter, snap[2]]);
    },
    [],
  );

  const handleDragRight = useCallback(
    (deltaX: number) => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const deltaPct = (deltaX / containerWidth) * 100;
      const snap = dragStartWidths.current;
      const minW = 15;
      const newCenter = Math.max(minW, Math.min(snap[1] + deltaPct, 100 - snap[0] - minW));
      const newRight = 100 - snap[0] - newCenter;
      if (newRight < minW) return;
      setBaseWidths([snap[0], newCenter, newRight]);
    },
    [],
  );

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
      setEditContent(
        selectedPost.draft_content ||
        'Key update generated from CRC intelligence. Review content before publishing.'
      );
      setEditHashtags(selectedPost.hashtags || '');
      setEditImagePrompt(selectedPost.image_prompt || '');
      setEditImageUrl(selectedPost.image_url || null);
      setSelectedStylePreset('');
    }
  }, [selectedPost]);

  const handleGenerate = async () => {
    setGenerating(true);
    const actionId = createAction('generate_post', { source: 'crc_news' }, handleGenerate);
    updateAction(actionId, { status: 'running' });
    try {
      const result = await cockpitService.generateLinkedInPosts();
      if (result.generated > 0) {
        await loadPosts();
      }
      updateAction(actionId, { status: 'success', output: result });
      addToast(`Generated ${result.generated} new post(s) from ${result.scanned} articles.`, 'success');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Generation failed';
      updateAction(actionId, { status: 'failed', error: errorMsg });
      addToast(errorMsg, 'error');
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
    const actionId = createAction('generate_image', { prompt: editImagePrompt, postId: selectedId }, handleGenerateImage);
    updateAction(actionId, { status: 'running' });
    addToast('Generating image with AI...', 'info');
    try {
      const result = await cockpitService.generatePostImage(editImagePrompt, selectedId);
      setEditImageUrl(result.image_url);
      await loadPosts();
      updateAction(actionId, { status: 'success', output: result });
      addToast('Image generated successfully.', 'success');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Image generation failed';
      updateAction(actionId, { status: 'failed', error: errorMsg });
      addToast(
        `Image generation failed. ${errorMsg} You can still publish without an image.`,
        'error',
      );
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleImprovePrompt = async () => {
    if (!editImagePrompt) return;
    setImprovingPrompt(true);
    const actionId = createAction('improve_prompt', { prompt: editImagePrompt, style: selectedStylePreset }, handleImprovePrompt);
    updateAction(actionId, { status: 'running' });
    addToast('Improving image prompt with AI...', 'info');
    try {
      const result = await cockpitService.improveImagePrompt(
        editImagePrompt,
        selectedStylePreset || undefined,
      );
      setEditImagePrompt(result.improved_prompt);
      updateAction(actionId, { status: 'success', output: result });
      addToast('Prompt improved! Review and generate when ready.', 'success');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Prompt improvement failed';
      updateAction(actionId, { status: 'failed', error: errorMsg });
      addToast(errorMsg, 'error');
    } finally {
      setImprovingPrompt(false);
    }
  };

  const handleStylePresetChange = (presetLabel: string) => {
    setSelectedStylePreset(presetLabel);
    const preset = IMAGE_STYLE_PRESETS.find((p) => p.label === presetLabel);
    if (preset && editImagePrompt) {
      // Strip any previous preset suffix by taking content before the first comma-separated style instruction
      const basePrompt = editImagePrompt.split(/,\s*(?:clean medical|professional corporate|public health|minimalist icon)/i)[0].trim();
      setEditImagePrompt(`${basePrompt}, ${preset.suffix}`);
    }
  };

  const handlePublishToLinkedIn = async () => {
    if (!selectedId || !selectedPost) return;
    setPublishing(true);
    const actionId = createAction('publish_post', { postId: selectedId, title: editTitle }, handlePublishToLinkedIn);
    updateAction(actionId, { status: 'running' });
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
        updateAction(actionId, { status: 'success', output: result });
        addToast('Published to LinkedIn!', 'success');
        setSelectedId(null);
      } else {
        const errorMsg = result.error || 'LinkedIn publish failed';
        updateAction(actionId, { status: 'failed', error: errorMsg });
        addToast(errorMsg, 'error');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Publish failed';
      updateAction(actionId, { status: 'failed', error: errorMsg });
      addToast(errorMsg, 'error');
    } finally {
      setPublishing(false);
    }
  };

  const handleRadarGenerate = async () => {
    setRadarGenerating(true);
    const actionId = createAction('radar_generate', { source: 'radar_signals' }, handleRadarGenerate);
    updateAction(actionId, { status: 'running' });
    addToast('Generating posts from Radar signals...', 'info');
    try {
      const result = await competitiveIntelligenceService.generateRadarLinkedInPosts();
      if (result.ok) {
        await loadPosts();
        updateAction(actionId, { status: 'success', output: result });
        addToast(`Generated ${result.generated || 0} post(s) from ${result.scanned || 0} radar signals.`, 'success');
      } else {
        updateAction(actionId, { status: 'failed', error: 'Radar generation returned no results' });
        addToast('Radar generation returned no results', 'error');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Radar generation failed';
      updateAction(actionId, { status: 'failed', error: errorMsg });
      addToast(errorMsg, 'error');
    } finally {
      setRadarGenerating(false);
    }
  };

  const handleManualGenerate = async () => {
    if (!manualUrl && !manualText) {
      addToast('Paste a URL or article text first.', 'error');
      return;
    }
    setManualGenerating(true);
    const actionId = createAction('manual_generate', { url: manualUrl, text: manualText?.slice(0, 100) }, handleManualGenerate);
    updateAction(actionId, { status: 'running' });
    addToast('Generating post from manual source...', 'info');
    try {
      const result = await cockpitService.generateFromManualSource(
        manualUrl || undefined,
        manualText || undefined,
      );
      if (result.ok && result.post) {
        await loadPosts();
        setSelectedId(result.post.id);
        setManualUrl('');
        setManualText('');
        updateAction(actionId, { status: 'success', output: result });
        addToast('Post generated! Select it in the list to edit.', 'success');
      } else {
        const errorMsg = result.error || 'Generation failed';
        updateAction(actionId, { status: 'failed', error: errorMsg });
        addToast(errorMsg, 'error');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Manual generation failed';
      updateAction(actionId, { status: 'failed', error: errorMsg });
      addToast(errorMsg, 'error');
    } finally {
      setManualGenerating(false);
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
      <div className="bg-gradient-to-r from-[#0A385A] to-[#0F766E] px-6 py-4">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/ceo-cockpit')}
                className="text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <Linkedin size={22} className="text-white" />
              <h1 className="text-xl font-bold text-white">LinkedIn Intelligence</h1>
            </div>

            {/* Panel toggles */}
            <div className="hidden lg:flex items-center gap-1.5 bg-white/10 rounded-lg p-1">
              <PanelToggle
                active={showSources}
                onClick={() => setShowSources((v) => !v)}
                icon={<List size={13} />}
                label="Sources"
              />
              <PanelToggle
                active={showEditor}
                onClick={() => setShowEditor((v) => !v)}
                icon={<PenLine size={13} />}
                label="Editor"
              />
              <PanelToggle
                active={showPreview}
                onClick={() => setShowPreview((v) => !v)}
                icon={showPreview ? <Eye size={13} /> : <EyeOff size={13} />}
                label="Preview"
              />
              <PanelToggle
                active={showActionLog}
                onClick={() => setShowActionLog((v) => !v)}
                icon={<ScrollText size={13} />}
                label="Actions"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/70">
            <span>{pendingCount} pending</span>
            <span>{postedThisWeek} posted this week</span>
          </div>
        </div>
      </div>

      {/* Body — resizable panels */}
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        {visibleCount === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <EyeOff size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-400">All panels hidden. Use the toggles above to show panels.</p>
          </div>
        )}
        <div ref={containerRef} className="flex items-start gap-0">
          {/* LEFT: Manual Source + Post Opportunities */}
          {showSources && (
          <div
            className="flex-shrink-0 space-y-4 overflow-hidden"
            style={{ width: `${effectiveWidths[0]}%`, minWidth: 0, padding: '0 8px' }}
          >
            {/* Manual Post Source */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Manual Post Source
                </h2>
                <input
                  type="text"
                  placeholder="Paste article URL"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none mb-2"
                />
                <div className="text-center text-[10px] text-gray-400 mb-2">or</div>
                <textarea
                  placeholder="Paste article text"
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none resize-y mb-3"
                />
                <button
                  onClick={handleManualGenerate}
                  disabled={manualGenerating || (!manualUrl && !manualText)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#0077B5] hover:bg-[#006097] text-white text-xs font-medium transition-colors disabled:opacity-50"
                >
                  {manualGenerating ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  {manualGenerating ? 'Generating...' : 'Generate LinkedIn Post'}
                </button>
              </div>
            </div>

            {/* Radar Intelligence Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Radar size={14} className="text-red-500" />
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Radar Intelligence Posts
                  </h2>
                </div>
                <button
                  onClick={handleRadarGenerate}
                  disabled={radarGenerating}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors disabled:opacity-50"
                >
                  {radarGenerating ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Radar size={14} />
                  )}
                  {radarGenerating ? 'Scanning Radar...' : 'Generate From Radar'}
                </button>
                <p className="text-[10px] text-gray-400 mt-2 text-center">
                  Scans signals with radar score 10+ and creates LinkedIn drafts
                </p>
              </div>
            </div>

            {/* Curated Post Opportunities */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
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
          </div>
          )}

          {/* Drag handle: Sources ↔ Editor */}
          {showSources && showEditor && (
            <ResizeHandle onDragStart={snapshotWidths} onDrag={handleDragLeft} />
          )}

          {/* CENTER: Editor */}
          {showEditor && (
          <div
            className="flex-shrink-0 overflow-hidden"
            style={{ width: `${effectiveWidths[1]}%`, minWidth: 0, padding: '0 8px' }}
          >
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
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

                {/* Image Prompt + Generate/Regenerate Image */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Image Prompt
                  </label>
                  <textarea
                    value={editImagePrompt}
                    onChange={(e) => setEditImagePrompt(e.target.value)}
                    placeholder="Describe image (or use Improve Prompt)"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[12px] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none resize-y"
                  />

                  {/* Style presets */}
                  <div className="flex items-center gap-2 mt-2">
                    <Palette size={12} className="text-gray-400 flex-shrink-0" />
                    <select
                      value={selectedStylePreset}
                      onChange={(e) => handleStylePresetChange(e.target.value)}
                      className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[11px] text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-[#0F766E] focus:border-transparent outline-none"
                    >
                      <option value="">Style Preset...</option>
                      {IMAGE_STYLE_PRESETS.map((p) => (
                        <option key={p.label} value={p.label}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Action buttons row */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleImprovePrompt}
                      disabled={improvingPrompt || !editImagePrompt}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-medium transition-colors disabled:opacity-50"
                      title="AI-improve the prompt for better image results"
                    >
                      {improvingPrompt ? (
                        <RefreshCw size={12} className="animate-spin" />
                      ) : (
                        <Wand2 size={12} />
                      )}
                      {improvingPrompt ? 'Improving...' : 'Improve Prompt'}
                    </button>
                    <button
                      onClick={handleGenerateImage}
                      disabled={generatingImage || !editImagePrompt}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-medium transition-colors disabled:opacity-50"
                    >
                      {generatingImage ? (
                        <RefreshCw size={12} className="animate-spin" />
                      ) : editImageUrl ? (
                        <RotateCcw size={12} />
                      ) : (
                        <ImageIcon size={12} />
                      )}
                      {generatingImage ? 'Generating...' : editImageUrl ? 'Regenerate' : 'Generate Image'}
                    </button>
                  </div>

                  {/* Image preview with remove */}
                  {editImageUrl ? (
                    <div className="mt-3 relative">
                      <img
                        src={editImageUrl}
                        alt="Generated"
                        className="w-full rounded-lg max-h-40 object-cover"
                      />
                      <button
                        onClick={() => setEditImageUrl(null)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                        title="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <p className="mt-2 text-[10px] text-gray-400 italic">
                      You can publish without an image or generate one above.
                    </p>
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
          </div>
          )}

          {/* Drag handle: Editor ↔ Preview */}
          {showEditor && showPreview && (
            <ResizeHandle onDragStart={snapshotWidths} onDrag={handleDragRight} />
          )}

          {/* RIGHT: Preview — live synced */}
          {showPreview && (
          <div
            className="flex-shrink-0 overflow-hidden"
            style={{ width: `${effectiveWidths[2]}%`, minWidth: 0, padding: '0 8px' }}
          >
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
          )}
        </div>

        {/* Action Log Panel */}
        {showActionLog && (
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScrollText size={14} className="text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Action Log</h2>
                {actions.length > 0 && (
                  <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">
                    {actions.length}
                  </span>
                )}
              </div>
              {actions.length > 0 && (
                <button
                  onClick={() => setActions([])}
                  className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="max-h-56 overflow-y-auto">
              {actions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ScrollText size={24} className="text-gray-300 dark:text-gray-600 mb-2" />
                  <p className="text-[11px] text-gray-400">No actions yet. Actions are logged as you generate posts, images, and prompts.</p>
                </div>
              ) : (
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      <th className="text-left px-3 py-2 font-medium">Status</th>
                      <th className="text-left px-3 py-2 font-medium">Action</th>
                      <th className="text-left px-3 py-2 font-medium hidden sm:table-cell">Details</th>
                      <th className="text-left px-3 py-2 font-medium">Time</th>
                      <th className="text-right px-3 py-2 font-medium">Retry</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actions.map((action) => (
                      <tr key={action.id} className="border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                        <td className="px-3 py-2">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              action.status === 'pending'
                                ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                : action.status === 'running'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                  : action.status === 'success'
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            }`}
                          >
                            {action.status === 'running' && <RefreshCw size={10} className="animate-spin" />}
                            {action.status === 'success' && <CheckCircle size={10} />}
                            {action.status === 'failed' && <AlertCircle size={10} />}
                            {action.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-700 dark:text-gray-300 font-medium">
                          {action.type.replace(/_/g, ' ')}
                        </td>
                        <td className="px-3 py-2 text-gray-500 dark:text-gray-400 hidden sm:table-cell max-w-[200px] truncate">
                          {action.error || (action.output ? 'Completed' : '—')}
                        </td>
                        <td className="px-3 py-2 text-gray-400 whitespace-nowrap">
                          {new Date(action.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {action.status === 'failed' && action.retry && (
                            <button
                              onClick={action.retry}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-medium transition-colors"
                            >
                              <RotateCw size={10} />
                              Retry
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedInIntelligence;
