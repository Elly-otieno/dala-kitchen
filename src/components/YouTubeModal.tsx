import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { YOUTUBE_VIDEOS } from '../data/recipesData';

interface YouTubeModalProps {
  videoId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const YouTubeModal: React.FC<YouTubeModalProps> = ({
  videoId,
  isOpen,
  onClose,
}) => {
  const currentVideo = YOUTUBE_VIDEOS.find((v) => v.videoId === videoId) || YOUTUBE_VIDEOS[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-3xl rounded-xs shadow-2xl overflow-hidden relative flex flex-col"
          >
            <div className="p-4 bg-dala-green text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <i className="fa-brands fa-youtube text-red-500 text-2xl"></i>
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Dala Kitchen YouTube Video
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Responsive Video Container */}
            <div className="relative pt-[56.25%] w-full bg-black">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${currentVideo.videoId || 'dQw4w9WgXcQ'}?autoplay=1`}
                title={currentVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-5 bg-dala-cream border-t border-gray-200">
              <h4 className="font-serif font-bold text-lg text-dala-text mb-1">
                {currentVideo.title}
              </h4>
              <p className="text-xs text-dala-text-light">
                Published on YouTube • {currentVideo.duration} • Subscribe to Dala Kitchen on YouTube for weekly tutorials.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
