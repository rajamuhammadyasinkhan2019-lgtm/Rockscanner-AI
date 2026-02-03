
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-black font-bold text-xl shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          RS
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase italic">Rockscanner</h1>
          <p className="text-[10px] text-green-500 mono font-bold tracking-widest uppercase">Geological Intelligence v2.5</p>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <span className="text-xs text-neutral-400 font-semibold tracking-wide uppercase">Analytical Head</span>
        <span className="text-sm text-neutral-100 font-bold">Muhammad Yasin Khan</span>
      </div>
    </header>
  );
};

export default Header;
