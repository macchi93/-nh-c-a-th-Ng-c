import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="text-center max-w-2xl mx-auto mb-12 bg-white/45 p-7 sm:p-9 rounded-3xl backdrop-blur-md border border-white/40 shadow-sm relative overflow-hidden">
      {/* Decorative subtle ambient circle */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-pink-300/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-rose-200/25 rounded-full blur-2xl pointer-events-none" />

      <h1 className="font-dancing text-5xl sm:text-6xl lg:text-7xl font-bold tracking-normal mb-4 leading-normal flex items-center justify-center flex-wrap gap-x-3">
        <span className="text-[#17080d]">Ổ nhỏ</span>
        <span className="text-[#d94c6f]">của</span>
        <span className="text-[#ffe9ef] drop-shadow-[0_1.5px_2px_rgba(217,76,111,0.85)] [text-shadow:_0_2px_4px_rgba(23,8,13,0.35)]">
          thị Ngọc
        </span>
      </h1>
      
      <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium max-w-xl mx-auto">
        Chào mừng các bbi đã đến với chiếc ổ nhỏ xinh của thị Ngọc.
        <br />
        Chúc các bbi lọ vui vẻ.
      </p>
    </section>
  );
};
