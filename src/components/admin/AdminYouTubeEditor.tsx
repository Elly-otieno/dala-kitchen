import React, { useState } from 'react';
import {
  Youtube,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Tag,
  Image as ImageIcon,
  ExternalLink,
  CheckCircle2,
  FileText,
  Star,
} from 'lucide-react';
import { YouTubeVideo } from '../../types';
import { ImageUploadOrUrlInput } from './ImageUploadOrUrlInput';

interface AdminYouTubeEditorProps {
  initialVideo?: YouTubeVideo | null;
  existingSeriesList?: string[];
  onSave: (video: YouTubeVideo) => void;
  onCancel: () => void;
}

export const AdminYouTubeEditor: React.FC<AdminYouTubeEditorProps> = ({
  initialVideo,
  existingSeriesList = [],
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(
    initialVideo?.title || 'Mastering Sourdough Fermentation Lab'
  );
  const [thumbnail, setThumbnail] = useState(
    initialVideo?.thumbnail ||
      'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80'
  );
  const [youtubeUrl, setYoutubeUrl] = useState(
    (initialVideo as any)?.youtubeVideoId || initialVideo?.videoId
      ? `https://www.youtube.com/watch?v=${(initialVideo as any)?.youtubeVideoId || initialVideo?.videoId}`
      : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  );
  const [youtubeVideoId, setYoutubeVideoId] = useState(
    (initialVideo as any)?.youtubeVideoId || initialVideo?.videoId || 'dQw4w9WgXcQ'
  );
  const [duration, setDuration] = useState(initialVideo?.duration || '18:45');
  
  // Default series options
  const defaultSeriesOptions = [
    'Sourdough Masterclass',
    'Kenyan Culinary Classics',
    'Air Fryer Quick Meals',
    'Fermentation Lab',
    'Weekend Baking',
  ];

  // Merge default, passed, and initial series into unique list
  const allInitialSeries = Array.from(
    new Set([
      ...defaultSeriesOptions,
      ...existingSeriesList.filter(Boolean),
      ...(initialVideo?.series ? [initialVideo.series] : []),
    ])
  );

  const [seriesOptions, setSeriesOptions] = useState<string[]>(allInitialSeries);
  const [selectedSeriesSelect, setSelectedSeriesSelect] = useState<string>(
    initialVideo?.series && allInitialSeries.includes(initialVideo.series)
      ? initialVideo.series
      : initialVideo?.series
      ? initialVideo.series
      : 'Sourdough Masterclass'
  );
  const [customSeriesName, setCustomSeriesName] = useState<string>('');
  const [isCreatingOtherSeries, setIsCreatingOtherSeries] = useState<boolean>(false);

  const [description, setDescription] = useState(
    initialVideo?.description ||
      'In this episode of DalaKitchen TV, Chef Achieng breaks down wild yeast maintenance, hydro-ratios, and oven-spring mechanics.'
  );
  const [featured, setFeatured] = useState<boolean>(
    initialVideo?.featured ?? false
  );

  // Science Tip Feature
  const [scienceTip, setScienceTip] = useState(
    'Lactic acid fermentation reduces sourdough phytic acid, making nutrients far more bioavailable.'
  );

  // Tags
  const [tags, setTags] = useState<string[]>([
    'Sourdough',
    'Baking',
    'Fermentation',
    'Bread Science',
  ]);
  const [newTagInput, setNewTagInput] = useState('');

  // Auto extract Youtube ID
  const handleUrlChange = (url: string) => {
    setYoutubeUrl(url);
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      setYoutubeVideoId(match[2]);
    } else if (url.length === 11) {
      setYoutubeVideoId(url);
    }
  };

  // Tag Helpers
  const handleAddTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSaveVideo = (isDraft: boolean = false) => {
    if (!title.trim()) {
      alert('Please enter a video title.');
      return;
    }

    let finalSeries = selectedSeriesSelect;
    if (isCreatingOtherSeries) {
      if (!customSeriesName.trim()) {
        alert('Please enter the name of the new Series / Playlist.');
        return;
      }
      finalSeries = customSeriesName.trim();
    }

    const videoObj: YouTubeVideo = {
      id: initialVideo?.id || `yt-${Date.now()}`,
      title: title.trim(),
      videoId: youtubeVideoId || 'dQw4w9WgXcQ',
      thumbnail,
      duration,
      series: finalSeries,
      description,
      publishedAt: initialVideo?.publishedAt || 'Just Now',
      featured,
      archived: initialVideo?.archived ?? false,
      draft: isDraft,
    };

    onSave(videoObj);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveVideo(false);
  };

  return (
    <div className="bg-[#fcf9f8] min-h-screen py-4 sm:py-8 px-3 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        {/* Editor Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#1b1c1c] uppercase tracking-wider flex items-center gap-2">
                <Youtube size={22} className="text-red-600" />
                {initialVideo ? 'EDIT YOUTUBE VIDEO' : 'ADD YOUTUBE VIDEO'}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                DalaKitchen Official Video Tutorials
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center justify-center"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSaveVideo(true)}
              className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <FileText size={15} /> Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSaveVideo(false)}
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Save size={16} /> Save &amp; Publish
            </button>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Primary Details */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
              <h2 className="font-serif font-bold text-lg text-[#1b1c1c] border-b border-gray-100 pb-3 flex items-center gap-2">
                <Youtube size={18} className="text-red-600" /> Video Details
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Video Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Perfect Sourdough Starter from Scratch"
                  className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl px-4 py-3 text-sm font-serif font-bold text-dala-text focus:outline-none focus:border-[#27331c] focus:bg-white"
                />
              </div>

              {/* YouTube Link & Extract */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    YouTube URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={youtubeUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono text-gray-700 focus:outline-none focus:border-[#27331c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Video ID
                  </label>
                  <input
                    type="text"
                    value={youtubeVideoId}
                    onChange={(e) => setYoutubeVideoId(e.target.value)}
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-gray-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Series & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Series / Playlist Category
                  </label>
                  <select
                    value={isCreatingOtherSeries ? '__OTHER__' : selectedSeriesSelect}
                    onChange={(e) => {
                      if (e.target.value === '__OTHER__') {
                        setIsCreatingOtherSeries(true);
                      } else {
                        setIsCreatingOtherSeries(false);
                        setSelectedSeriesSelect(e.target.value);
                      }
                    }}
                    className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-dala-text focus:outline-none focus:border-[#27331c] focus:bg-white"
                  >
                    {seriesOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                    <option value="__OTHER__" className="font-bold text-dala-green">
                      + Other (Create New Series / Playlist)...
                    </option>
                  </select>

                  {/* Custom Series Input if "Other" is chosen */}
                  {isCreatingOtherSeries && (
                    <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <label className="block text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                        ✨ New Series / Playlist Title:
                      </label>
                      <input
                        type="text"
                        value={customSeriesName}
                        onChange={(e) => setCustomSeriesName(e.target.value)}
                        placeholder="e.g., Traditional Swahili Baking"
                        className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-xs font-semibold text-dala-text focus:outline-none focus:ring-2 focus:ring-amber-400"
                        autoFocus
                      />
                      <p className="text-[10px] text-amber-800">
                        This will create a new Series / Playlist category and update it in your database when saved.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Duration (MM:SS)
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="18:45"
                    className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#27331c]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Video Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed video summary and key timestamps..."
                  className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl p-4 text-xs text-dala-text leading-relaxed focus:outline-none focus:border-[#27331c] focus:bg-white"
                />
              </div>
            </div>

            {/* Science Feature Tip */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <h2 className="font-serif font-bold text-lg text-[#1b1c1c] border-b border-gray-100 pb-3 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" /> Featured Science Highlight
              </h2>

              <textarea
                rows={2}
                value={scienceTip}
                onChange={(e) => setScienceTip(e.target.value)}
                placeholder="Scientific tip displayed under video player..."
                className="w-full bg-[#fcf9f8] border border-gray-200 rounded-xl p-3 text-xs font-medium text-dala-text focus:outline-none focus:border-[#27331c]"
              />
            </div>

            {/* Tags Manager */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <h2 className="font-serif font-bold text-lg text-[#1b1c1c] border-b border-gray-100 pb-3 flex items-center gap-2">
                <Tag size={18} className="text-[#27331c]" /> Topic Tags
              </h2>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  className="bg-[#fcf9f8] border border-gray-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#27331c]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-[#27331c] text-white text-xs font-bold rounded-xl hover:bg-[#3d4a31] cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-gray-400 hover:text-red-600 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Thumbnail Preview */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <ImageUploadOrUrlInput
                label="Video Thumbnail Image"
                value={thumbnail}
                onChange={(newImg) => setThumbnail(newImg)}
                placeholder="https://... or drop file"
                aspectRatioClass="h-44"
              />
            </div>

            {/* Featured Video Spotlight Toggle */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
                    <Star size={16} className="fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1b1c1c] uppercase tracking-wide">
                      Featured Video
                    </h4>
                    <p className="text-[11px] text-amber-900/70">
                      Main Episode Spotlight (Only 1 active)
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Featured videos are displayed in the main hero stage on the Watch &amp; Cook (YouTube) page. Enabling this will automatically replace the currently featured video.
              </p>
            </div>

            {/* Save Box */}
            <div className="bg-[#27331c] text-white p-6 rounded-2xl shadow-md space-y-4">
              <h3 className="font-serif font-bold text-base uppercase tracking-wider text-white">
                YouTube Channel Sync
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Save as draft for later or publish to display live on DalaKitchen TV.
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSaveVideo(true)}
                  className="w-full py-2.5 bg-[#3d4a31] hover:bg-[#4d5c3e] text-amber-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer border border-amber-400/30"
                >
                  <FileText size={15} /> Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveVideo(false)}
                  className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save size={16} /> Save &amp; Publish Video
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
