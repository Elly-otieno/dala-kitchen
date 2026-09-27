import React from 'react';
import { Smile, Heart, TestTube } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutKitchenPhilosophy: React.FC = () => {
  const philosophies = [
    {
      icon: Smile,
      title: 'Enjoyable, Not Overwhelming',
      description: "Cooking shouldn't feel like a chore. I focus on approachable techniques and accessible ingredients so you can enjoy the process as much as the meal.",
    },
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Real food, prepared with care. No shortcuts that compromise flavor or nutrition. Every recipe is a testament to the joy of feeding those you love.',
    },
    {
      icon: TestTube,
      title: 'Learning & Testing',
      description: 'Every recipe on DalaKitchen has been rigorously tested in a real home kitchen. I believe in the science of cooking to guarantee reliable results.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center mb-12 sm:mb-16"
      >
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-dala-text mb-2 uppercase tracking-wide">
          My Kitchen Philosophy
        </h2>
        <div className="font-signature text-2xl text-dala-green">
          Simple rules for everyday joy.
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {philosophies.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5 }}
              className="bg-white border border-gray-200/80 rounded-none p-8 flex flex-col items-center text-center shadow-2xs transition-shadow hover:shadow-md"
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="w-16 h-16 rounded-full bg-dala-cream border border-dala-green/30 flex items-center justify-center text-dala-green mb-6"
              >
                <Icon size={30} />
              </motion.div>
              <h3 className="font-serif font-bold text-xl text-dala-text mb-3">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-dala-text-light leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
