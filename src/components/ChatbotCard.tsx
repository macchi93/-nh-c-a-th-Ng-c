import React from 'react';
import { ChatBot } from '../types';
import { TAG_DESCRIPTIONS } from '../data/tags';

interface ChatbotCardProps {
  bot: ChatBot;
  selectedTag?: string | null;
  selectedTags?: string[];
  onSelectTag?: (tag: string) => void;
}

export const ChatbotCard: React.FC<ChatbotCardProps> = ({ 
  bot, 
  selectedTag,
  selectedTags,
  onSelectTag 
}) => {
  // Ensure tags are sorted alphabetically (case-insensitive)
  const sortedTags = [...(bot.tags || [])].sort((a, b) => 
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );

  return (
    <div 
      className="pink-glass-card rounded-2xl p-3.5 sm:p-5 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative"
      id={`bot-card-${bot.id}`}
    >
      <div>
        {/* Header row with Icon and Badge */}
        <div className="flex items-center justify-between mb-2.5 sm:mb-4 gap-1.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white/70 text-rose-500 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl md:text-2xl shadow-xs group-hover:scale-110 transition-transform duration-200 shrink-0">
            <span className={bot.icon.includes('♰') ? 'font-black font-serif text-slate-800 text-xl sm:text-2xl' : ''}>
              {bot.icon}
            </span>
          </div>
          {bot.badge && (
            <span className="font-playfair text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/80 text-pink-700 border border-pink-200/60 shadow-2xs truncate max-w-[120px] sm:max-w-none text-center">
              {bot.badge}
            </span>
          )}
        </div>

        <h3 className="font-handwriting text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-1 group-hover:text-pink-700 transition-colors leading-snug">
          {bot.name}
        </h3>
        
        <p className="text-xs sm:text-sm text-slate-600 mb-2.5 sm:mb-4 leading-relaxed font-normal line-clamp-3 sm:line-clamp-none">
          {bot.isItalicDescription !== false ? (
            <span className="italic">{bot.description}</span>
          ) : (
            bot.description
          )}
        </p>

        {/* Alphabetically Sorted Hashtags with description on hover */}
        {sortedTags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2.5 sm:mb-4">
            {sortedTags.map((tag) => {
              const isSelected = (selectedTags ? selectedTags.includes(tag) : false) || selectedTag === tag;
              const desc = TAG_DESCRIPTIONS[tag] || tag;
              return (
                <div key={tag} className="relative group/tag inline-block">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectTag) onSelectTag(tag);
                    }}
                    className={`inline-flex items-center text-[10px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#d94c6f] text-white shadow-2xs scale-105 font-semibold'
                        : 'bg-white/60 hover:bg-pink-100 text-slate-700 hover:text-pink-800 border border-pink-200/40'
                    }`}
                    title={`${tag.replace(/^#/, '')}: ${desc}`}
                  >
                    <span>{tag.replace(/^#/, '')}</span>
                  </button>

                  {/* Hover tooltip */}
                  <div className="pointer-events-none opacity-0 group-hover/tag:opacity-100 transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 p-2 bg-slate-900/95 text-white text-[11px] rounded-lg shadow-xl backdrop-blur-xs z-50 text-center font-normal leading-snug">
                    <span className="font-semibold text-pink-300 block mb-0.5">{tag.replace(/^#/, '')}</span>
                    <span>{desc}</span>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-pink-200/40">
        {/* Primary Action Link or Coming Soon indicator */}
        {bot.externalUrl ? (
          <a
            href={bot.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center inline-flex justify-center items-center px-2.5 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition pink-btn shadow-xs cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-pink-400"
            id={`btn-chat-${bot.id}`}
          >
            <span>{bot.actionText}</span>
          </a>
        ) : (
          <div
            className="group/btn relative w-full text-center inline-flex justify-center items-center px-2.5 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 pink-btn shadow-xs cursor-not-allowed select-none overflow-hidden"
            id={`btn-chat-${bot.id}`}
            title="Coming soon"
          >
            <span className="inline-block transition-all duration-200 group-hover/btn:opacity-0 group-hover/btn:scale-95">
              {bot.actionText}
            </span>
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/btn:opacity-100 transition-all duration-200 font-bold tracking-wider text-pink-700 bg-white/95 backdrop-blur-xs">
              Coming soon
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
