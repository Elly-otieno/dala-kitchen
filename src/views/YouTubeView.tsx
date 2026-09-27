import React, { useState } from 'react';
import { Play, ArrowRight, Video, Sparkles, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { YOUTUBE_VIDEOS } from '../data/recipesData';
import { YouTubeVideo } from '../types';

interface YouTubeViewProps {
  videos?: YouTubeVideo[];
  onPlayVideo: (videoId: string) => void;
}

export const YouTubeView: React.FC<YouTubeViewProps> = ({ videos, onPlayVideo }) => {
  const [selectedSeries, setSelectedSeries] = useState<string>('All');

  const availableVideos = (videos || YOUTUBE_VIDEOS).filter((v) => !v.archived && !v.draft);

  const featuredVideo =
    availableVideos.find((v) => v.featured) ||
    availableVideos.find((v) => v.id === 'v-feat') ||
    availableVideos[0];

  // Dynamically compute all available series / categories from videos
  const allUniqueSeries = Array.from(
    new Set(availableVideos.map((v) => v.series).filter(Boolean))
  );

  // Filter videos based on selection
  const filteredVideos =
    selectedSeries === 'All'
      ? availableVideos
      : availableVideos.filter((v) => v.series === selectedSeries);

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

        {/* Featured Video Section ("LATEST EPISODE") */}
        {featuredVideo && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#F6F3F2] border border-gray-200/80 rounded-none p-6 sm:p-8 shadow-2xs relative overflow-hidden mb-12 sm:mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Thumbnail */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="lg:col-span-7 aspect-video bg-black rounded-none overflow-hidden relative shadow-md group cursor-pointer"
                onClick={() => onPlayVideo(featuredVideo.videoId)}
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

                <motion.button
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onPlayVideo(featuredVideo.videoId)}
                  className="inline-flex items-center gap-2 text-[#765845] font-bold text-xs uppercase tracking-widest hover:text-dala-green transition-colors cursor-pointer w-max group"
                >
                  WATCH NOW{' '}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </div>
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
              {filteredVideos.map((video, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  key={video.id}
                  onClick={() => onPlayVideo(video.videoId)}
                  className="bg-white rounded-none overflow-hidden border border-gray-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
                >
                  <div className="relative aspect-video rounded-none overflow-hidden bg-gray-100">
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

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-serif font-bold text-lg text-dala-text group-hover:text-dala-green transition-colors mb-2 leading-snug">
                      {video.title}
                    </h3>
                    <p className="text-xs text-dala-text-light leading-relaxed line-clamp-2 mb-4">
                      {video.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#765845] group-hover:text-dala-green transition-colors mt-auto">
                      Watch Episode <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </motion.div>
              ))}
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
                    {seriesVideos.map((video, idx) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: idx * 0.05 }}
                        whileHover={{ y: -4 }}
                        onClick={() => onPlayVideo(video.videoId)}
                        className="bg-white rounded-none overflow-hidden border border-gray-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
                      >
                        <div className="relative aspect-video rounded-none overflow-hidden bg-gray-100">
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

                        <div className="p-4 flex flex-col flex-grow">
                          <h3 className="font-serif font-bold text-base text-dala-text uppercase leading-snug group-hover:text-dala-green transition-colors mb-1.5 line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-xs text-dala-text-light line-clamp-2 leading-relaxed">
                            {video.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
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
