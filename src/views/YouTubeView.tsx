import React, { useState } from 'react';
import { Play, ArrowRight, Video, Film, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { motion } from 'motion/react';
import { YOUTUBE_VIDEOS } from '../data/recipesData';
import { YouTubeVideo } from '../types';
import { extractYoutubeId } from '../lib/youtube';

interface YouTubeViewProps {
  videos?: YouTubeVideo[];
  onPlayVideo?: (videoId: string) => void;
}

export const YouTubeView: React.FC<YouTubeViewProps> = ({ videos }) => {
  const [selectedSeries, setSelectedSeries] = useState<string>('All');
  // Store the UNIQUE item id of the playing video, or 'featured' for the top hero player
  const [playingItemId, setPlayingItemId] = useState<string | null>(null);
  const [isTheater, setIsTheater] = useState<boolean>(false);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);
  const [activeFeaturedVideo, setActiveFeaturedVideo] = useState<YouTubeVideo | null>(null);

  const availableVideos = (videos || YOUTUBE_VIDEOS).filter((v) => !v.archived && !v.draft);

  const defaultFeatured =
    availableVideos.find((v) => v.featured) ||
    availableVideos.find((v) => v.id === 'v-feat') ||
    availableVideos[0];

  const featuredVideo = activeFeaturedVideo || defaultFeatured;
  const isFeaturedPlaying = playingItemId === 'featured';

  // Dynamically compute all available series / categories from videos
  const allUniqueSeries = Array.from(
    new Set(availableVideos.map((v) => v.series).filter(Boolean))
  );

  // Filter videos based on selection
  const filteredVideos =
    selectedSeries === 'All'
      ? availableVideos
      : availableVideos.filter((v) => v.series === selectedSeries);

  const handleStartPlayingFeatured = (theaterMode = false) => {
    setPlayingItemId('featured');
    setIsVideoLoading(true);
    setIsTheater(theaterMode);
  };

  const handleStartPlayingCard = (video: YouTubeVideo) => {
    // Only play this exact unique video card
    setPlayingItemId(video.id);
    setIsVideoLoading(true);
  };

  const handleOpenInTheater = (video: YouTubeVideo) => {
    // Switch featured player to this video and open cinema mode in-place
    setActiveFeaturedVideo(video);
    setPlayingItemId('featured');
    setIsTheater(true);
    setIsVideoLoading(true);
    document.getElementById('featured-video-player')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStopPlaying = () => {
    setPlayingItemId(null);
    setIsTheater(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-dala-cream min-h-screen py-10 sm:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Top Hero Section */}
        <section className="flex flex-col-reverse md:flex-row gap-8 items-center justify-between mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-center md:text-left"
          >
            {/* <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Video size={14} /> Dala Kitchen Studio
            </div> */}
            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-dala-text uppercase tracking-wider mb-2">
              WATCH &amp; COOK
            </h1>
            <p className="font-signature text-2xl sm:text-3xl text-dala-text-light mb-8">
              Step-by-step culinary science in your home kitchen. New videos every week.
            </p>

            <div className="flex justify-center md:justify-start">
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href="https://www.youtube.com/@quinn_Achieng"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-widest rounded-none shadow-md shadow-red-600/20 transition-all cursor-pointer"
              >
                <Play size={16} className="fill-white" />
                SUBSCRIBE ON YOUTUBE
              </motion.a>
            </div>
          </motion.div>

          {/* Right Circular Chef Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0"
          >
            <div className="relative inline-block">
              <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-dala-green/30">
                <img
                  src="/images/achieng.png"
                  alt="Chef Achieng"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Featured Video Section ("LATEST EPISODE" / In-Context Player) */}
        {featuredVideo && (
          <motion.section
            id="featured-video-player"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`bg-[#F6F3F2] border border-gray-200/80 rounded-none shadow-2xs relative overflow-hidden mb-12 sm:mb-16 scroll-mt-24 transition-all duration-300 ${
              isTheater && isFeaturedPlaying
                ? 'p-4 sm:p-6 lg:p-8 ring-2 ring-[#3D4A31]/30'
                : 'p-6 sm:p-8'
            }`}
          >
            {/* If in Theater Mode in-place */}
            {isTheater && isFeaturedPlaying ? (
              <div className="space-y-4">
                {/* In-Context Options Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-300/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#3D4A31]">
                      {featuredVideo.series || 'FEATURED EPISODE'} • IN-CONTEXT THEATER VIEW
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleStopPlaying}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                    >
                      <RotateCcw size={12} />
                      Hide Video
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsTheater(false)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#3D4A31] hover:bg-[#24331e] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                      title="Exit theater mode"
                    >
                      <Minimize2 size={12} />
                      Default View
                    </button>
                    <a
                      href={`https://www.youtube.com/watch?v=${extractYoutubeId(featuredVideo.videoId)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors"
                    >
                      <i className="fa-brands fa-youtube"></i>
                      YouTube
                    </a>
                  </div>
                </div>

                {/* Theater Iframe Video */}
                <div className="relative w-full aspect-video bg-black rounded-none overflow-hidden shadow-xl border border-gray-300">
                  {isVideoLoading && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 text-white">
                      <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mb-3"></div>
                      <span className="text-xs uppercase font-bold tracking-widest text-emerald-300">
                        Loading Masterclass Video...
                      </span>
                    </div>
                  )}
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYoutubeId(featuredVideo.videoId)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                    title={featuredVideo.title}
                    className="w-full h-full border-0 relative z-10"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="eager"
                    onLoad={() => setIsVideoLoading(false)}
                  />
                </div>

                <div className="pt-2">
                  <span className="inline-block bg-[#E2E8DC] text-[#3D4A31] font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-none mb-2">
                    {featuredVideo.series || 'FEATURED EPISODE'}
                  </span>
                  <h2 className="font-serif font-bold text-2xl text-dala-text uppercase tracking-wide leading-tight mb-2">
                    {featuredVideo.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-dala-text-light leading-relaxed">
                    {featuredVideo.description}
                  </p>
                </div>
              </div>
            ) : (
              /* Default Grid: Left 7 cols, Right 5 cols (Identical to Original UI Look) */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Thumbnail or In-Context Embed */}
                <div className="lg:col-span-7">
                  {isFeaturedPlaying ? (
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-300 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#3D4A31]">
                            NOW PLAYING
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handleStopPlaying}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-[11px] font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                          >
                            <RotateCcw size={11} /> Hide
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsTheater(true)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#3D4A31] hover:bg-[#24331e] text-white text-[11px] font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                            title="Expand to in-page theater view"
                          >
                            <Maximize2 size={11} /> Theater
                          </button>
                          <a
                            href={`https://www.youtube.com/watch?v=${extractYoutubeId(featuredVideo.videoId)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold uppercase tracking-wider rounded-full transition-colors"
                          >
                            <i className="fa-brands fa-youtube"></i> YouTube
                          </a>
                        </div>
                      </div>

                      <div className="relative aspect-video bg-black rounded-none overflow-hidden shadow-md">
                        {isVideoLoading && (
                          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 text-white">
                            <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mb-2"></div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
                              Loading...
                            </span>
                          </div>
                        )}
                        <iframe
                          src={`https://www.youtube.com/embed/${extractYoutubeId(featuredVideo.videoId)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                          title={featuredVideo.title}
                          className="w-full h-full border-0 relative z-10"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="eager"
                          onLoad={() => setIsVideoLoading(false)}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Original Thumbnail Look */
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="aspect-video bg-black rounded-none overflow-hidden relative shadow-md group cursor-pointer"
                      onClick={() => handleStartPlayingFeatured(false)}
                    >
                      <img
                        src={featuredVideo.thumbnail}
                        alt={featuredVideo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center rounded-full shadow-xl shadow-red-600/30 transition-transform duration-300"
                        >
                          <Play size={32} className="fill-white ml-1" />
                        </motion.div>
                      </div>
                      <span className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-mono font-bold px-2 py-0.5 rounded-none">
                        {featuredVideo.duration}
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Right Details */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <span className="inline-block bg-[#E2E8DC] text-[#3D4A31] font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-none w-max mb-4">
                    {featuredVideo.series || 'FEATURED EPISODE'}
                  </span>
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-dala-text uppercase tracking-wide leading-tight mb-4">
                    {featuredVideo.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-dala-text-light leading-relaxed mb-6">
                    {featuredVideo.description ||
                      'Demystifying the science behind wild yeast. Learn how to cultivate, feed, and maintain a robust sourdough starter that will give your breads incredible oven spring and complex flavor.'}
                  </p>

                  {isFeaturedPlaying ? (
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-xs uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Playing Now
                      </span>
                      <button
                        type="button"
                        onClick={handleStopPlaying}
                        className="text-xs text-gray-500 hover:text-gray-800 underline font-semibold uppercase tracking-wider cursor-pointer"
                      >
                        Stop
                      </button>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStartPlayingFeatured(false)}
                      className="inline-flex items-center gap-2 text-[#765845] font-bold text-xs uppercase tracking-widest hover:text-dala-green transition-colors cursor-pointer w-max group"
                    >
                      WATCH NOW{' '}
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  )}
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* Dynamic Series Selector Navigation */}
        <section className="mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedSeries('All')}
              className={`px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedSeries === 'All'
                  ? 'bg-[#24331e] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Series ({availableVideos.length})
            </motion.button>
            {allUniqueSeries.map((s) => {
              const count = availableVideos.filter((v) => v.series === s).length;
              return (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedSeries(s)}
                  className={`px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    selectedSeries === s
                      ? 'bg-[#24331e] text-white shadow-xs'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {s} ({count})
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Videos Display: Filtered View vs Categorized Shelves */}
        {selectedSeries !== 'All' ? (
          <section className="mb-16">
            <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-8">
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-dala-text uppercase tracking-wider flex items-center gap-2">
                <Film size={22} className="text-dala-green" /> {selectedSeries}
              </h2>
              <span className="text-xs text-gray-500 font-semibold">
                {filteredVideos.length} Video{filteredVideos.length === 1 ? '' : 's'}
              </span>
            </div>

            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video, idx) => {
                const cleanId = extractYoutubeId(video.videoId);
                const isCardPlaying = playingItemId === video.id;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    key={video.id}
                    className="bg-white rounded-none overflow-hidden border border-gray-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col group"
                  >
                    {/* Aspect Video Box: Thumbnail vs In-Context Embed */}
                    <div className="relative aspect-video rounded-none overflow-hidden bg-gray-100">
                      {isCardPlaying ? (
                        <div className="w-full h-full relative bg-black">
                          {/* Top In-Context Overlay Options */}
                          <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between pointer-events-auto">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/80 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Playing
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStopPlaying();
                                }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/80 hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                <RotateCcw size={10} /> Hide
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenInTheater(video);
                                }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#3D4A31] hover:bg-[#24331e] text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                title="Open in-page theater view"
                              >
                                <Maximize2 size={10} /> Theater
                              </button>
                              <a
                                href={`https://www.youtube.com/watch?v=${cleanId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider transition-colors"
                              >
                                <i className="fa-brands fa-youtube"></i>
                              </a>
                            </div>
                          </div>

                          <iframe
                            src={`https://www.youtube.com/embed/${cleanId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                            title={video.title}
                            className="w-full h-full border-0 relative z-10"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="eager"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-full h-full relative cursor-pointer"
                          onClick={() => handleStartPlayingCard(video)}
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <div className="w-12 h-12 bg-red-600/90 text-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                              <Play size={20} className="fill-white ml-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-none">
                            {video.duration}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="font-serif font-bold text-lg text-dala-text group-hover:text-dala-green transition-colors mb-2 leading-snug">
                        {video.title}
                      </h3>
                      <p className="text-xs text-dala-text-light leading-relaxed line-clamp-2 mb-4">
                        {video.description}
                      </p>

                      {isCardPlaying ? (
                        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            In-Context Playing
                          </span>
                          <button
                            type="button"
                            onClick={handleStopPlaying}
                            className="text-[11px] text-gray-500 hover:text-gray-900 font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Hide Video
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartPlayingCard(video)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#765845] group-hover:text-dala-green transition-colors mt-auto text-left cursor-pointer"
                        >
                          Watch Episode <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </section>
        ) : (
          /* Dynamic Shelves for All Series */
          <div className="space-y-16 mb-16">
            {allUniqueSeries.map((seriesName) => {
              const seriesVideos = availableVideos.filter((v) => v.series === seriesName);
              if (seriesVideos.length === 0) return null;

              return (
                <motion.section
                  key={seriesName}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45 }}
                >
                  <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-8">
                    <h2 className="font-serif font-bold text-xl sm:text-2xl text-dala-text uppercase tracking-wider flex items-center gap-2">
                      <Film size={22} className="text-dala-green" /> {seriesName}
                    </h2>
                    <motion.button
                      whileHover={{ x: 2 }}
                      onClick={() => setSelectedSeries(seriesName)}
                      className="text-xs font-bold uppercase tracking-widest text-[#765845] hover:text-dala-green transition-colors cursor-pointer"
                    >
                      VIEW ALL ({seriesVideos.length})
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {seriesVideos.map((video, idx) => {
                      const cleanId = extractYoutubeId(video.videoId);
                      const isCardPlaying = playingItemId === video.id;

                      return (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, delay: idx * 0.05 }}
                          className="bg-white rounded-none overflow-hidden border border-gray-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col group"
                        >
                          <div className="relative aspect-video rounded-none overflow-hidden bg-gray-100">
                            {isCardPlaying ? (
                              <div className="w-full h-full relative bg-black">
                                <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between pointer-events-auto">
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-black/80 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Playing
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStopPlaying();
                                      }}
                                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-black/80 hover:bg-black text-white text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                    >
                                      <RotateCcw size={9} /> Hide
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenInTheater(video);
                                      }}
                                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#3D4A31] hover:bg-[#24331e] text-white text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                      title="Open in-page theater view"
                                    >
                                      <Maximize2 size={9} /> Theater
                                    </button>
                                    <a
                                      href={`https://www.youtube.com/watch?v=${cleanId}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[9px] font-bold uppercase tracking-wider transition-colors"
                                    >
                                      <i className="fa-brands fa-youtube"></i>
                                    </a>
                                  </div>
                                </div>

                                <iframe
                                  src={`https://www.youtube.com/embed/${cleanId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                                  title={video.title}
                                  className="w-full h-full border-0 relative z-10"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                  loading="eager"
                                />
                              </div>
                            ) : (
                              <div
                                className="w-full h-full relative cursor-pointer"
                                onClick={() => handleStartPlayingCard(video)}
                              >
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                  <div className="w-10 h-10 bg-red-600/90 text-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    <Play size={18} className="fill-white ml-0.5" />
                                  </div>
                                </div>
                                <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-none">
                                  {video.duration}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-4 flex flex-col flex-grow">
                            <h3 className="font-serif font-bold text-base text-dala-text uppercase leading-snug group-hover:text-dala-green transition-colors mb-1.5 line-clamp-2">
                              {video.title}
                            </h3>
                            <p className="text-xs text-dala-text-light line-clamp-2 leading-relaxed mb-3">
                              {video.description}
                            </p>

                            {isCardPlaying ? (
                              <div className="mt-auto flex items-center justify-between pt-1 border-t border-gray-100">
                                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                                  Playing In-Context
                                </span>
                                <button
                                  type="button"
                                  onClick={handleStopPlaying}
                                  className="text-[10px] text-gray-500 hover:text-gray-900 font-bold uppercase tracking-wider cursor-pointer"
                                >
                                  Hide
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleStartPlayingCard(video)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#765845] group-hover:text-dala-green transition-colors mt-auto text-left cursor-pointer"
                              >
                                Watch Episode <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.section>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
