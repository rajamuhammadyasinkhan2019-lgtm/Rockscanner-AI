
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 px-6 py-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="text-xs text-neutral-500 font-medium mb-1 uppercase tracking-tighter">Expert App Architect</p>
          <p className="text-sm text-neutral-300 font-bold uppercase tracking-widest">Muhammad Yasin Khan</p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] text-neutral-400 font-bold tracking-widest uppercase">System Status: Optimal</span>
          </div>
          <p className="text-xs text-neutral-500 italic">© 2024 Rockscanner Platform</p>
        </div>

        <div className="text-center md:text-right">
          <p className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Core Intelligence</p>
          <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Powered By: Google Gemini 3 Flash Preview
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
