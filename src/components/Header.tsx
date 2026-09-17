import React from 'react';
import { MessageSquareHeart, Home, Tags } from 'lucide-react';

interface HeaderProps {
  onGoHome?: () => void;
  onOpenCategories?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGoHome, onOpenCategories }) => {
  return (
    <header className="border-b border-white/30 bg-white/40 sticky top-0 backdrop-blur-md z-40 transition-all">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex justify-center items-center gap-2 sm:gap-4">
        {/* Nhóm các nút điều hướng Header: Trang chủ, Thể loại, Feedback */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Nút Trang chủ */}
          <button
            type="button"
            onClick={() => {
              if (onGoHome) {
                onGoHome();
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="header-nav-btn header-btn-home inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-2xs cursor-pointer active:scale-95"
            id="nav-home-btn"
            title="Về đầu trang"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 text-[#353c9e]" />
            <span>Trang chủ</span>
          </button>

          {/* Nút Thể loại */}
          <button
            type="button"
            onClick={() => {
              if (onOpenCategories) {
                onOpenCategories();
              } else {
                const element = document.getElementById('chatbots');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
            className="header-nav-btn header-btn-category inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-2xs cursor-pointer active:scale-95"
            id="nav-category-btn"
            title="Xem theo thể loại / tag"
          >
            <Tags className="w-4 h-4 sm:w-5 sm:h-5 text-[#9d70aa]" />
            <span>Thể loại</span>
          </button>

          {/* Nút Feedback chuyển hướng tới Facebook */}
          <a
            href="https://www.facebook.com/profile.php?id=61569227221503"
            target="_blank"
            rel="noopener noreferrer"
            className="header-nav-btn header-btn-feedback inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-2xs cursor-pointer active:scale-95"
            id="nav-feedback-btn"
            title="Gửi phản hồi qua Facebook"
          >
            <MessageSquareHeart className="w-4 h-4 sm:w-5 sm:h-5 text-[#e36fc9]" />
            <span>Feedback</span>
          </a>
        </div>
      </div>
    </header>
  );
};
