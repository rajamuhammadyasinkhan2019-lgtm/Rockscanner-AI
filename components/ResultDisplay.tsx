
import React from 'react';
import { AnalysisResult, UserTier } from '../types';

interface ResultDisplayProps {
  result: AnalysisResult;
  tier: UserTier;
  onClose: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, tier, onClose }) => {
  const isPro = tier === UserTier.RESEARCHER;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex justify-between items-start sticky top-0 bg-neutral-900 z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-white uppercase tracking-tight">{result.identification}</h2>
              <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/30 text-green-500 text-[10px] mono font-bold rounded">
                CONF: {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-neutral-400 mono">{result.type} | {result.geologicalAge}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Properties */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-800 pb-2">Physical Matrix</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-neutral-800/50 rounded border border-neutral-700/50">
                  <p className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Hardness (Mohs)</p>
                  <p className="text-lg font-bold text-neutral-100 mono">{result.physicalProperties.hardness}</p>
                </div>
                <div className="p-3 bg-neutral-800/50 rounded border border-neutral-700/50">
                  <p className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Specific Gravity</p>
                  <p className="text-lg font-bold text-neutral-100 mono">{result.physicalProperties.specificGravity}</p>
                </div>
                <div className="p-3 bg-neutral-800/50 rounded border border-neutral-700/50 col-span-2">
                  <p className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Grain Size Distribution</p>
                  <p className="text-sm font-bold text-neutral-100 mono">{result.physicalProperties.grainSize}</p>
                </div>
              </div>
            </div>

            {/* Mineralogy */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-800 pb-2">Mineral Composition</h3>
              <div className="flex flex-wrap gap-2">
                {result.mineralogy.map((min, idx) => (
                  <span key={idx} className="px-3 py-1 bg-neutral-800 text-neutral-300 text-xs rounded-full border border-neutral-700">
                    {min}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Research Section (Pro Only) */}
          {isPro && result.provenance && (
            <div className="space-y-4 p-5 bg-neutral-800/30 rounded-lg border border-neutral-700/30">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Provenance Analysis (Research Grade)
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase mb-1">Rounding</p>
                  <p className="text-sm font-semibold text-neutral-200">{result.provenance.rounding}</p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase mb-1">Transport Dist.</p>
                  <p className="text-sm font-semibold text-neutral-200">{result.provenance.transportDistance}</p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase mb-1">Source Basin</p>
                  <p className="text-sm font-semibold text-neutral-200">{result.provenance.basinSource}</p>
                </div>
              </div>
            </div>
          )}

          {/* Fossil Warning/Info */}
          {result.isFossil && (
            <div className={`p-4 rounded border flex items-center gap-4 ${
              result.fossilAuthenticity && result.fossilAuthenticity > 0.8 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                : 'bg-red-500/10 border-red-500/30 text-red-500'
            }`}>
              <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide">Fossil Remains Detected</p>
                <p className="text-xs opacity-80">
                  {result.fossilAuthenticity && result.fossilAuthenticity > 0.8 
                    ? `Authentic morphology confirmed (${(result.fossilAuthenticity * 100).toFixed(0)}% verification).`
                    : 'Unusual structure detected. Potential artifact or pseudofossil. Further testing required.'}
                </p>
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-800 pb-2">Interpretive Summary</h3>
            {tier === UserTier.STUDENT ? (
              <p className="text-sm text-neutral-300 leading-relaxed italic border-l-2 border-green-500 pl-4">
                {result.educationalNote}
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                  {result.professionalInsight}
                </p>
                {result.stratigraphicContext && (
                  <div className="text-[10px] mono bg-neutral-800 p-2 rounded text-neutral-400">
                    STRATIGRAPHIC CORRELATION: {result.stratigraphicContext}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-neutral-800 bg-neutral-800/20 flex gap-4">
          <button className="flex-1 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded font-bold transition-colors uppercase tracking-widest text-xs flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Export PDF Report
          </button>
          <button className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white rounded font-bold transition-colors uppercase tracking-widest text-xs flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add to Field Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
