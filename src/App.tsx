import React, { useState, useMemo, useEffect } from 'react';
import { CHATBOTS } from './data/chatbots';
import { TAG_DESCRIPTIONS, TAG_LIST } from './data/tags';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ChatbotCard } from './components/ChatbotCard';
import { UpcomingBotCard } from './components/UpcomingBotCard';
import { IdeaModal } from './components/IdeaModal';
import { HashtagFilterModal } from './components/HashtagFilterModal';
import { Footer } from './components/Footer';
import { SparkleCursorTrail } from './components/SparkleCursorTrail';
import { filterBotByQuery } from './utils/search';
import { getRandomBackground, BackgroundImage } from './data/backgrounds';
import { Filter, X, ChevronDown, ChevronUp, Search } from 'lucide-react';

// Kích thước mỗi đợt hiển thị: ưu tiên hiển thị trọn vẹn các bot (6 vị trí)
function getBatchSize(): number {
  return 6;
}

export default function App() {
  const [bgImage] = useState<BackgroundImage>(() => getRandomBackground());
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [batchSize, setBatchSize] = useState<number>(() => getBatchSize());
  const [batchMultiplier, setBatchMultiplier] = useState(1);
  const [isBoxHovered, setIsBoxHovered] = useState(false);
  const [isBoxExpanded, setIsBoxExpanded] = useState(false);

  // Extract all unique tags (including master tag list) and sort them by bot count from highest to lowest, then alphabetically
  const tagsSortedByCount = useMemo(() => {
    const counts = new Map<string, number>();
    // Pre-populate with all known tags so even tags with 0 bots are accessible
    TAG_LIST.forEach((t) => counts.set(t, 0));
    CHATBOTS.forEach((bot) => {
      bot.tags?.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1));
    });
    const tags = Array.from(counts.keys());
    return tags.sort((a, b) => {
      const countDiff = (counts.get(b) || 0) - (counts.get(a) || 0);
      if (countDiff !== 0) return countDiff;
      return a.localeCompare(b, undefined, { sensitivity: 'base' });
    });
  }, []);

  // Filter chatbots: filter by name, tag, or initials/acronyms via search query, and require all selected tags
  const filteredBots = useMemo(() => {
    let result = CHATBOTS;

    if (searchQuery.trim()) {
      result = result.filter((bot) => filterBotByQuery(bot, searchQuery));
    }

    if (selectedTags.length > 0) {
      result = result.filter((bot) => {
        if (!bot.tags || bot.tags.length === 0) return false;
        const botTagSet = new Set(bot.tags.map((t) => t.toLowerCase()));
        return selectedTags.every((tag) => botTagSet.has(tag.toLowerCase()));
      });
    }

    return result;
  }, [searchQuery, selectedTags]);

  // Lắng nghe thay đổi kích thước màn hình / xoay màn hình (dọc/ngang)
  useEffect(() => {
    const updateSize = () => {
      setBatchSize(getBatchSize());
    };
    window.addEventListener('resize', updateSize);
    const mediaQuery = window.matchMedia('(max-width: 639px) and (orientation: portrait)');
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateSize);
    }
    return () => {
      window.removeEventListener('resize', updateSize);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateSize);
      }
    };
  }, []);

  // Tự động thu lại 2 dòng mới nhất (4 bot với đt dọc, 6 bot với pc/tablet/đt ngang) khi tìm kiếm hoặc đổi hashtag
  useEffect(() => {
    setBatchMultiplier(1);
  }, [searchQuery, selectedTags]);

  const visibleCount = batchSize * batchMultiplier;

  // Hiển thị tối đa theo 2 dòng:
  // - PC & Tablet: 3 cột 2 dòng = 6 bot
  // - ĐT ngang: 3 cột 2 dòng = 6 bot
  // - ĐT dọc: 2 cột 2 dòng = 4 bot
  const displayedBots = useMemo(() => {
    return filteredBots.slice(0, visibleCount);
  }, [filteredBots, visibleCount]);

  const hasMoreBots = filteredBots.length > visibleCount;

  const handleLoadMore = () => {
    setBatchMultiplier((prev) => prev + 1);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
  };

  const handleSelectAllTags = () => {
    setSelectedTags([...tagsSortedByCount]);
  };

  const handleGoHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCategories = () => {
    setIsFilterModalOpen(true);
    const element = document.getElementById('chatbots');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Determine if the hashtag box is open
  const isBoxOpen = isBoxHovered || isBoxExpanded;
  // When collapsed, display maximum 5 hashtags; when expanded, display all
  const displayedTags = isBoxOpen ? tagsSortedByCount : tagsSortedByCount.slice(0, 5);
  const remainingCount = Math.max(0, tagsSortedByCount.length - 5);

  return (
    <div className="relative min-h-screen flex flex-col justify-between text-slate-800 antialiased selection:bg-pink-200 selection:text-pink-900">
      {/* Nền ảnh ngẫu nhiên từ album Google Drive, làm mờ 30% */}
      <div 
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none" 
        aria-hidden="true" 
      >
        <img
          src={bgImage.localUrl}
          alt=""
          className="w-full h-full object-cover scale-105 filter blur-[6px] opacity-85 transition-opacity duration-700 pointer-events-none"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== bgImage.fallbackUrl) {
              target.src = bgImage.fallbackUrl;
            }
          }}
        />
        {/* Lớp phủ hòa sắc nhẹ nhàng giữ trọn vẻ đẹp hoa và tone hồng phấn dịu mắt */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffe9ef]/40 via-white/20 to-[#ffe9ef]/40" />
      </div>

      {/* Nội dung chính đặt trong vùng z-10 để nổi lên trên lớp nền blur */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between w-full">
        {/* Header / Thanh điều hướng */}
        <Header onGoHome={handleGoHome} onOpenCategories={handleOpenCategories} />

        {/* Khu vực hiển thị nội dung chính */}
        <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 w-full">
          {/* Hero Section */}
          <HeroSection />

          {/* Danh sách Chatbots dạng ô màu hồng nhạt #ffe9ef */}
          <section id="chatbots" className="scroll-mt-24">
            {/* Tiêu đề Danh Sách Chatbot căn giữa & tăng size */}
            <div className="text-center mb-6 px-1">
              <h2 className="font-handwriting text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-normal">
                Danh Sách Chatbot
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
                Tìm chòn iu
              </p>

              {/* Nút đếm số bot và nút Lọc căn giữa */}
              <div className="flex items-center justify-center gap-2 mt-3.5">
                <span className="inline-flex items-center text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/65 text-slate-700 border border-white/60 shadow-2xs backdrop-blur-xs">
                  {filteredBots.length} Chatbot sẵn sàng
                </span>

                {/* Nút Lọc hashtag - Bấm vào sẽ mở bảng chọn đầy đủ với ô tick */}
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(true)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                    selectedTags.length > 0
                      ? 'bg-[#d94c6f] text-white hover:bg-[#c23f60] border border-[#d94c6f]'
                      : 'bg-white/70 hover:bg-white text-slate-700 hover:text-pink-700 border border-pink-200/60'
                  }`}
                  id="btn-filter-hashtag"
                  title="Mở bảng lọc hashtag với ô tick chọn"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>
                    {selectedTags.length > 0
                      ? `Lọc tag (${selectedTags.length})`
                      : 'Lọc tag'}
                  </span>
                  {selectedTags.length > 0 && (
                    <span
                      role="button"
                      aria-label="Xóa bộ lọc"
                      className="p-0.5 rounded-full hover:bg-white/20 transition-colors ml-0.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearAllTags();
                      }}
                    >
                      <X className="w-3 h-3 hover:rotate-90 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Thanh tìm kiếm: nhập theo tên hoặc theo tag */}
            <div className="mb-4">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-pink-500 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập tên hoặc tag để tìm chòn (vd: nicolai, trai nga, sb...)"
                  className="w-full pl-10 pr-10 py-2.5 bg-white/75 hover:bg-white focus:bg-white text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm rounded-2xl border border-pink-200/60 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300/40 shadow-2xs backdrop-blur-sm transition-all"
                  id="search-chatbots-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-pink-100 transition-colors"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Box Hashtag linh hoạt: mở rộng khi di chuột đến, sắp xếp theo số lượng nhiều -> ít, tối đa 5 tag khi thu nhỏ */}
            <div
              onMouseEnter={() => setIsBoxHovered(true)}
              onMouseLeave={() => setIsBoxHovered(false)}
              className="mb-6 p-3 sm:p-3.5 rounded-2xl bg-white/50 hover:bg-white/70 backdrop-blur-md border border-pink-200/50 hover:border-pink-300/80 shadow-2xs hover:shadow-md transition-all duration-300 group/hashtag-box"
              id="flexible-hashtag-box"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[#d94c6f] select-none leading-none" aria-hidden="true">ʚɞ</span>
                  <span>Check tag chọn chòn iu</span>
                </span>

                <div className="flex items-center gap-2">
                  {selectedTags.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllTags}
                      className="text-[11px] text-pink-700 hover:text-pink-900 font-medium underline underline-offset-2 transition cursor-pointer"
                    >
                      Bỏ chọn ({selectedTags.length})
                    </button>
                  )}
                  {/* Nút toggle click dành cho mobile hoặc người muốn ghim mở rộng */}
                  <button
                    type="button"
                    onClick={() => setIsBoxExpanded((prev) => !prev)}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-pink-700 font-medium transition cursor-pointer px-2 py-0.5 rounded-md hover:bg-pink-100/50"
                  >
                    <span>{isBoxOpen ? 'Thu gọn' : `+${remainingCount} xem thêm`}</span>
                    {isBoxOpen ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Danh sách hashtag */}
              <div className="flex items-center gap-2 flex-wrap transition-all duration-300">
                {/* Nút Tất cả */}
                <button
                  type="button"
                  onClick={handleClearAllTags}
                  className={`text-xs px-3 py-1 rounded-full transition-all cursor-pointer font-medium ${
                    selectedTags.length === 0
                      ? 'bg-[#d94c6f] text-white shadow-2xs font-semibold'
                      : 'bg-white/80 hover:bg-pink-100 text-slate-700 border border-pink-200/50'
                  }`}
                >
                  Tất cả ({CHATBOTS.length})
                </button>

                {/* Danh sách hashtag (tối đa 5 khi thu nhỏ, đầy đủ khi hover hoặc mở rộng) */}
                {displayedTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  const count = CHATBOTS.filter((b) => b.tags?.includes(tag)).length;
                  const desc = TAG_DESCRIPTIONS[tag] || tag;
                  return (
                    <div key={tag} className="relative group/tag inline-block">
                      <button
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#d94c6f] text-white shadow-2xs font-semibold scale-105'
                            : 'bg-white/80 hover:bg-pink-100 text-slate-700 border border-pink-200/50'
                        }`}
                        title={`${tag.replace(/^#/, '')}: ${desc}`}
                      >
                        <span>{tag.replace(/^#/, '')}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            isSelected
                              ? 'bg-white/25 text-white'
                              : 'bg-pink-100 text-pink-700'
                          }`}
                        >
                          {count}
                        </span>
                      </button>

                      {/* Hover tooltip */}
                      <div className="pointer-events-none opacity-0 group-hover/tag:opacity-100 transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900/95 text-white text-[11px] rounded-lg shadow-xl backdrop-blur-xs z-50 text-center font-normal leading-snug">
                        <span className="font-semibold text-pink-300 block mb-0.5">
                          {tag.replace(/^#/, '')}
                        </span>
                        <span>{desc}</span>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grid hiển thị Chatbot: ĐT dọc 2 cột 2 dòng, PC/Tablet/ĐT ngang 3 cột 2 dòng */}
            <div className="chatbot-grid gap-3.5 sm:gap-6" id="chatbots-grid">
              {filteredBots.length === 0 && (
                <div className="col-span-full p-8 sm:p-10 rounded-2xl bg-white/80 backdrop-blur-md border border-pink-200/80 text-center shadow-sm flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-pink-100/90 flex items-center justify-center text-xl mb-3 text-[#d94c6f] select-none shadow-xs">
                    ʚɞ
                  </div>
                  <p className="text-slate-800 text-base font-semibold mb-1">
                    Không tìm được anh chòn phù hợp.
                  </p>
                  <p className="text-slate-600 text-sm mb-5">
                    Bbi có muốn đề xuất không?
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href="https://facebook.com/profile.php?id=61569227221503"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-[#d94c6f] text-white hover:bg-[#c23f60] transition cursor-pointer shadow-md inline-flex items-center gap-2"
                    >
                      Liên hệ
                    </a>
                    {(selectedTags.length > 0 || searchQuery) && (
                      <button
                        type="button"
                        onClick={() => {
                          handleClearAllTags();
                          setSearchQuery('');
                        }}
                        className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-pink-50 text-[#d94c6f] hover:bg-pink-100 border border-pink-200 transition cursor-pointer"
                      >
                        Xóa tìm kiếm & tag
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Bot hiển thị theo bộ lọc: tối đa 6 bot mới nhất */}
              {displayedBots.map((bot) => (
                <ChatbotCard
                  key={bot.id}
                  bot={bot}
                  selectedTags={selectedTags}
                  onSelectTag={(tag) => handleToggleTag(tag)}
                />
              ))}

              {/* Ưu tiên hiển thị tất cả các bot rồi mới đến phần "chờ đón chòn iu mới" */}
              {!hasMoreBots && filteredBots.length > 0 && (
                <UpcomingBotCard 
                  onOpenSuggest={() => setIsIdeaModalOpen(true)} 
                />
              )}
            </div>

            {/* Nút Xem thêm để hiển thị 6 bot cũ hơn nếu còn bot */}
            {hasMoreBots && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="px-8 py-2.5 rounded-full text-sm font-semibold bg-white/80 hover:bg-white text-[#d94c6f] border border-pink-200/80 hover:border-pink-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer backdrop-blur-sm active:scale-95"
                  id="btn-load-more-chatbots"
                >
                  Xem thêm
                </button>
              </div>
            )}
          </section>
        </main>

        {/* Footer / Bản quyền */}
        <Footer />
      </div>

      {/* Bảng Lọc Hashtag Đầy Đủ kèm Ô Tick */}
      <HashtagFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        allTags={tagsSortedByCount}
        selectedTags={selectedTags}
        onToggleTag={handleToggleTag}
        onSelectAll={handleSelectAllTags}
        onClearAll={handleClearAllTags}
      />

      {/* Suggest New Bot Idea Modal */}
      <IdeaModal 
        isOpen={isIdeaModalOpen} 
        onClose={() => setIsIdeaModalOpen(false)} 
      />

      {/* Hiệu ứng Bling Bling nhẹ sau đuôi cursor khi di chuột nhanh */}
      <SparkleCursorTrail />
    </div>
  );
}
