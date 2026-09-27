import React, { useState } from 'react';
import { RecipeCategory, SiteSettings } from '../types';
import { PolicyTab } from './LegalPoliciesModal';

interface FooterProps {
  onSelectCategory: (category: RecipeCategory) => void;
  onNavigate: (tab: string) => void;
  onSubscribeSubmit?: (email: string) => void;
  onOpenLegal?: (tab?: PolicyTab) => void;
  siteSettings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onNavigate,
  onSubscribeSubmit,
  onOpenLegal,
  siteSettings,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const fbUrl = siteSettings?.facebookUrl || 'https://www.facebook.com/share/1BBMxx2UTw/';
  const igUrl = siteSettings?.instagramUrl || 'https://www.instagram.com/dala.kitchen?utm_source=qr&igsh=M21jcnQzbDZkYzJx';
  const ytUrl = siteSettings?.youtubeUrl || 'https://youtube.com';
  const pinUrl = siteSettings?.pinterestUrl || 'https://pinterest.com';
  const ttUrl = siteSettings?.tiktokUrl || 'https://tiktok.com';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (onSubscribeSubmit) onSubscribeSubmit(email);
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#f6f3f2] border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col space-y-5">
            <div
              className="w-48 cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz7JEDgKCPIKFgy3Gav7l9pEUVX4wa0h9vP-nIfpBR1-HGUdHdWBfVd7cYzMusFLM0UGlW3YI1GoBz2Xtei9YOsiLv8IRIxOgJ7XIi47KtxemiqBsIT-0apni9puHrz2iSMPlmPIj-WLpsF6Baxbk3H88d2GuRU0MuFPrSxfIA70MbCynJeOXazLal3frFxzv_mH5wQ5y-2s13jzKhgQzgBng-q9egV-XRLuzt_4OwmT9XouHYPw_7lxkWckq_ZViWog"
                alt="Dala Kitchen Logo"
                className="w-full h-auto object-contain hover:opacity-90 transition-opacity"
              />
            </div>
            <p className="text-xs sm:text-sm text-dala-text-light leading-relaxed">
              The Science of Scratch, The Soul of Home. Wholesome recipes made from real ingredients, tested with love.
            </p>
            <div className="flex space-x-4 text-dala-green pt-1">
              <a
                href={fbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-dala-gold transition-colors"
                aria-label="Facebook"
              >
                <i className="fa-brands fa-facebook text-xl"></i>
              </a>
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-dala-gold transition-colors"
                aria-label="Instagram"
              >
                <i className="fa-brands fa-instagram text-xl"></i>
              </a>
              <a
                href={ytUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-dala-gold transition-colors"
                aria-label="YouTube"
              >
                <i className="fa-brands fa-youtube text-xl"></i>
              </a>
              <a
                href={pinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-dala-gold transition-colors"
                aria-label="Pinterest"
              >
                <i className="fa-brands fa-pinterest text-xl"></i>
              </a>
              <a
                href={ttUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-dala-gold transition-colors"
                aria-label="TikTok"
              >
                <i className="fa-brands fa-tiktok text-xl"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Recipes */}
          <div>
            <h4 className="font-serif font-bold text-base text-dala-text mb-5 uppercase tracking-wider">
              Recipes
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-dala-text-light font-medium">
              <li>
                <button
                  onClick={() => onSelectCategory('Breakfast')}
                  className="hover:text-dala-green transition-colors text-left"
                >
                  Breakfast
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Lunch')}
                  className="hover:text-dala-green transition-colors text-left"
                >
                  Lunch &amp; Dinner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Baking')}
                  className="hover:text-dala-green transition-colors text-left"
                >
                  Baking &amp; Sourdough
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Kenyan Recipes')}
                  className="hover:text-dala-green transition-colors text-left"
                >
                  Kenyan Classics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Air Fryer')}
                  className="hover:text-dala-green transition-colors text-left"
                >
                  Air Fryer Recipes
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-serif font-bold text-base text-dala-text mb-5 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-dala-text-light font-medium">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-dala-green transition-colors text-left"
                >
                  About Achieng
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-dala-green transition-colors text-left"
                >
                  Our Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('youtube')}
                  className="hover:text-dala-green transition-colors text-left"
                >
                  YouTube Channel
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-dala-green transition-colors text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-dala-green transition-colors text-left font-semibold text-dala-green"
                >
                  Staff Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div id="footer-newsletter" className="scroll-mt-24 p-4 rounded-xl transition-all duration-300">
            <h4 className="font-serif font-bold text-base text-dala-text mb-5 uppercase tracking-wider">
              Stay Inspired
            </h4>
            <p className="text-xs sm:text-sm text-dala-text-light mb-4 leading-relaxed">
              Join our community for weekly recipes and kitchen tips.
            </p>
            {subscribed ? (
              <p className="text-xs font-bold text-dala-green bg-white p-3 rounded-xs border border-dala-green/20">
                ✓ Thank you for joining Dala Kitchen!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
                <input
                  id="footer-newsletter-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xs focus:ring-2 focus:ring-dala-green focus:border-dala-green focus:outline-none bg-white text-dala-text transition-all duration-200"
                />
                <button
                  type="submit"
                  className="bg-dala-green text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-dala-green-dark transition duration-300 rounded-xs cursor-pointer shadow-2xs"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-dala-text-light">
            © 2026 Dala Kitchen. All Rights Reserved. Made with love from real ingredients.
          </p>
          <div className="flex space-x-6 text-[10px] font-bold uppercase tracking-widest text-dala-text-light">
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-dala-green transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-dala-green transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onNavigate('cookies')}
              className="hover:text-dala-green transition-colors cursor-pointer"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
