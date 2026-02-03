
import React from 'react';

interface ScannerOverlayProps {
  isLocked: boolean;
  statusText: string;
}

const ScannerOverlay: React.FC<ScannerOverlayProps> = ({ isLocked, statusText }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
      {/* Corner Brackets */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-green-500/50"></div>
      <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-green-500/50"></div>
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-green-500/50"></div>
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-green-500/50"></div>

      {/* Reticle */}
      <div className={`w-48 h-48 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
        isLocked ? 'border-green-500 scanner-reticle scale-110' : 'border-neutral-500/30'
      }`}>
        {isLocked && <div className="scan-line"></div>}
        <div className={`w-1 h-1 rounded-full ${isLocked ? 'bg-green-500' : 'bg-neutral-500/30'}`}></div>
      </div>

      {/* Info Overlay */}
      <div className="absolute bottom-16 w-full px-12 flex justify-between items-end">
        <div className="mono text-[10px] text-neutral-400 space-y-1">
          <p>AZM: 142.4°</p>
          <p>ALT: 2834m</p>
          <p>LOC: 34.20°N 72.35°E</p>
        </div>
        
        <div className="text-right">
          <div className={`inline-block px-3 py-1 mb-2 border rounded-sm font-bold mono text-[10px] tracking-widest ${
            isLocked ? 'bg-green-500 text-black border-green-500' : 'bg-neutral-800 text-neutral-400 border-neutral-700'
          }`}>
            {isLocked ? 'TARGET LOCKED' : 'SEARCHING...'}
          </div>
          <p className="text-xs text-neutral-300 font-medium uppercase tracking-tighter">{statusText}</p>
        </div>
      </div>
    </div>
  );
};

export default ScannerOverlay;
