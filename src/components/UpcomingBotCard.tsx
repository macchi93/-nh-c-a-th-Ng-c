import React from 'react';
import { Plus, Sparkles } from 'lucide-react';

interface UpcomingBotCardProps {
  onOpenSuggest?: () => void;
}

export const UpcomingBotCard: React.FC<UpcomingBotCardProps> = () => {
  return (
    <a 
      href="https://facebook.com/profile.php?id=61569227221503"
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-2xl p-3.5 sm:p-5 md:p-6 transition-all duration-300 flex flex-col justify-between border-dashed border-2 border-pink-300/70 bg-pink-100/30 hover:bg-pink-100/45 backdrop-blur-sm group hover:border-pink-400 hover:shadow-md cursor-pointer no-underline text-inherit"
      id="card-upcoming-bot"
      title="Góp ý ý tưởng bot mới qua Facebook"
    >
      <div className="flex flex-col items-center justify-center h-full py-4 sm:py-6 text-center">
        <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white/60 text-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl mb-2 sm:mb-3 shadow-2xs group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
          <Plus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </div>
        <h3 className="font-handwriting text-base sm:text-xl font-bold text-slate-800 group-hover:text-pink-700 transition-colors">
          Chờ đón chòn iu mới
        </h3>
        <span className="mt-3 sm:mt-4 inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-pink-600 group-hover:text-pink-700 bg-white/70 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-pink-200/60 shadow-2xs">
          <Sparkles className="w-3 h-3 text-pink-500" />
          Góp ý ý tưởng bot ➜
        </span>
      </div>
    </a>
  );
};

