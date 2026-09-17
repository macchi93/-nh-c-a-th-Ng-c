import React, { useState, useMemo } from 'react';
import { X, Check, Filter, RotateCcw, CheckSquare, Square, Search, Sparkles } from 'lucide-react';
import { TAG_DESCRIPTIONS } from '../data/tags';
import { CHATBOTS } from '../data/chatbots';

interface HashtagFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export const HashtagFilterModal: React.FC<HashtagFilterModalProps> = ({
  isOpen,
  onClose,
  allTags,
  selectedTags,
  onToggleTag,
  onSelectAll,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate bot count per tag
  const tagCounts = useMemo(() => {
    const map = new Map<string, number>();
    allTags.forEach((t) => {
      map.set(t, CHATBOTS.filter((b) => b.tags?.includes(t)).length);
    });
    return map;
  }, [allTags]);

  // Filter tags based on search input
  const filteredTags = useMemo(() => {
    if (!searchTerm.trim()) return allTags;
    const lower = searchTerm.toLowerCase();
    return allTags.filter((tag) => {
      const desc = TAG_DESCRIPTIONS[tag] || '';
      return tag.toLowerCase().includes(lower) || desc.toLowerCase().includes(lower);
    });
  }, [allTags, searchTerm]);

  // Number of matching chatbots given selected tags (matching ALL selected tags)
  const matchingBotsCount = useMemo(() => {
    if (selectedTags.length === 0) return CHATBOTS.length;
    return CHATBOTS.filter((bot) => {
      if (!bot.tags || bot.tags.length === 0) return false;
      const botTagSet = new Set(bot.tags.map((t) => t.toLowerCase()));
      return selectedTags.every((tag) => botTagSet.has(tag.toLowerCase()));
    }).length;
  }, [selectedTags]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      id="hashtag-filter-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-2xl max-h-[88vh] bg-white/95 backdrop-blur-xl border border-pink-200/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        id="hashtag-filter-modal-dialog"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#d94c6f] text-white flex items-center justify-center shadow-xs">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-lg">Fiu-tơ</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-semibold">
                  {selectedTags.length > 0 ? `Đã chọn ${selectedTags.length}/${allTags.length}` : 'Tất cả'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tick để chọn chòn
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-pink-100/80 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            title="Đóng Fiu-tơ"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Search */}
        <div className="px-6 py-3 bg-white/60 border-b border-pink-100/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm tag hoặc từ khóa..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-pink-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick select buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={onSelectAll}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200/60 transition cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Chọn tất cả</span>
            </button>
            <button
              type="button"
              onClick={onClearAll}
              disabled={selectedTags.length === 0}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200/60 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Bỏ chọn</span>
            </button>
          </div>
        </div>

        {/* Hashtags Checkbox List (Scrollable) */}
        <div className="p-6 overflow-y-auto max-h-[50vh] space-y-2">
          {filteredTags.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-sm">
              Không tìm thấy tag nào phù hợp với &quot;{searchTerm}&quot;
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-2.5">
              {filteredTags.map((tag) => {
                const isChecked = selectedTags.includes(tag);
                const count = tagCounts.get(tag) || 0;
                const desc = TAG_DESCRIPTIONS[tag] || '';

                return (
                  <div
                    key={tag}
                    onClick={() => onToggleTag(tag)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'bg-pink-50/90 border-[#d94c6f]/60 shadow-xs ring-1 ring-[#d94c6f]/30'
                        : 'bg-white/70 hover:bg-pink-50/40 border-pink-100 hover:border-pink-200'
                    }`}
                  >
                    {/* Custom Checkbox */}
                    <div className="mt-0.5 shrink-0">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-[#d94c6f] text-white shadow-2xs'
                            : 'border-2 border-slate-300 bg-white hover:border-pink-400'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Tag Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span
                          className={`text-sm font-bold truncate ${
                            isChecked ? 'text-[#d94c6f]' : 'text-slate-800'
                          }`}
                        >
                          {tag.replace(/^#/, '')}
                        </span>
                        <span
                          className={`text-[11px] px-2 py-0.2 rounded-full font-semibold shrink-0 ${
                            isChecked
                              ? 'bg-[#d94c6f] text-white'
                              : 'bg-pink-100 text-pink-700'
                          }`}
                        >
                          {count} bot
                        </span>
                      </div>
                      {desc && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {desc}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/90 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
            <Sparkles className="w-4 h-4 text-[#d94c6f]" />
            <span>
              Tìm thấy <strong className="text-slate-900 font-bold">{matchingBotsCount}</strong> anh chòn phù hợp
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {selectedTags.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
              >
                Đặt lại
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-[#d94c6f] hover:bg-[#c23f60] text-white shadow-md transition cursor-pointer"
            >
              Lọc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
