import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/30 bg-white/40 text-center py-5 text-xs text-slate-700 font-medium backdrop-blur-md mt-auto z-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-center space-x-2 text-slate-700 font-semibold">
          <span>© 2026 thingoc.ai.studio. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
