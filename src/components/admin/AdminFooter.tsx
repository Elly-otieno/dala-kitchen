import React from 'react';

interface AdminFooterProps {
  onNavigateHome?: () => void;
  onOpenLegal?: () => void;
}

export const AdminFooter: React.FC<AdminFooterProps> = () => {
  return (
    <footer className="bg-white border-t border-[#e6e2dc] py-4 px-6 sm:px-10 text-xs font-sans flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
      <div className="flex items-center gap-3">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz7JEDgKCPIKFgy3Gav7l9pEUVX4wa0h9vP-nIfpBR1-HGUdHdWBfVd7cYzMusFLM0UGlW3YI1GoBz2Xtei9YOsiLv8IRIxOgJ7XIi47KtxemiqBsIT-0apni9puHrz2iSMPlmPIj-WLpsF6Baxbk3H88d2GuRU0MuFPrSxfIA70MbCynJeOXazLal3frFxzv_mH5wQ5y-2s13jzKhgQzgBng-q9egV-XRLuzt_4OwmT9XouHYPw_7lxkWckq_ZViWog"
          alt="Dala Kitchen Logo"
          className="h-7 w-auto object-contain"
        />
        <div>
          <span className="font-serif font-black tracking-widest text-[#1b1c1c] text-sm uppercase block leading-none">
            DALAKITCHEN
          </span>
          <span className="text-[10px] font-serif italic text-[#765845] block mt-0.5">Admin Portal</span>
        </div>
      </div>

      <p className="text-[11px] text-gray-500 font-medium">
        © {new Date().getFullYear()} Dala Kitchen. All rights reserved.
      </p>
    </footer>
  );
};
