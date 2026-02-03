
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ScannerOverlay from './components/ScannerOverlay';
import ResultDisplay from './components/ResultDisplay';
import { AppMode, UserTier, BasinContext, AnalysisResult, StratigraphyEntry } from './types';
import { BASINS } from './constants';
import { analyzeGeologicalSample } from './services/geminiService';

const App: React.FC = () => {
  // Application State
  const [mode, setMode] = useState<AppMode>(AppMode.FIELD);
  const [tier, setTier] = useState<UserTier>(UserTier.STUDENT);
  const [activeBasin, setActiveBasin] = useState<BasinContext>('GLOBAL');
  const [isScanning, setIsScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [fieldLog, setFieldLog] = useState<StratigraphyEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Camera Initialization
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setError(null);
      }
    } catch (err) {
      console.error('Camera Access Error:', err);
      setError('Camera access denied. Please enable permissions.');
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Analysis Trigger
  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current || isScanning) return;

    setIsScanning(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.85);
        
        const result = await analyzeGeologicalSample(imageData, mode, tier, activeBasin);
        setAnalysisResult(result);
      }
    } catch (err) {
      console.error('Analysis Error:', err);
      setError('Geological analysis failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950">
      <Header />

      <main className="flex-1 relative flex flex-col lg:flex-row h-full overflow-hidden">
        {/* Left Side: Main View (Scanner/Microscope) */}
        <div className="flex-1 relative bg-black flex items-center justify-center min-h-[400px] lg:min-h-0 border-r border-neutral-800">
          {!error ? (
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              className={`w-full h-full object-cover transition-opacity duration-500 ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
            />
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-neutral-400 font-medium mb-4">{error}</p>
              <button 
                onClick={() => startCamera()}
                className="px-6 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors"
              >
                Retry Camera
              </button>
            </div>
          )}

          {/* Scanner HUD Overlay */}
          {cameraActive && (
            <ScannerOverlay 
              isLocked={isScanning} 
              statusText={isScanning ? "Quantizing Matrix..." : "Awaiting Target Capture"}
            />
          )}

          {/* Hidden Canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Floating Controls (Bottom Center) */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6">
            <button 
              onClick={handleScan}
              disabled={isScanning || !cameraActive}
              className={`group relative flex items-center justify-center w-20 h-20 rounded-full bg-white transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${isScanning ? 'animate-pulse' : ''}`}
            >
              <div className="w-16 h-16 rounded-full border-4 border-black/10 group-hover:scale-105 transition-transform" />
              <div className={`absolute w-full h-full rounded-full border-2 border-white animate-ping opacity-25 ${isScanning ? 'block' : 'hidden'}`} />
            </button>
          </div>
        </div>

        {/* Right Side: Command Console */}
        <div className="w-full lg:w-[450px] bg-neutral-900 border-l border-neutral-800 flex flex-col h-full overflow-y-auto lg:h-[calc(100vh-140px)]">
          
          {/* Section: Mode & Basin Selection */}
          <div className="p-6 space-y-6 border-b border-neutral-800">
            <div>
              <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest block mb-3">Operating Mode</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-black rounded-lg border border-neutral-800">
                <button 
                  onClick={() => setMode(AppMode.FIELD)}
                  className={`py-2 px-3 rounded text-xs font-bold transition-all uppercase tracking-tighter ${mode === AppMode.FIELD ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  Field Observation
                </button>
                <button 
                  onClick={() => setMode(AppMode.LAB)}
                  className={`py-2 px-3 rounded text-xs font-bold transition-all uppercase tracking-tighter ${mode === AppMode.LAB ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  Lab Analysis
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest block mb-3">User Authorization</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-black rounded-lg border border-neutral-800">
                <button 
                  onClick={() => setTier(UserTier.STUDENT)}
                  className={`py-2 px-3 rounded text-xs font-bold transition-all uppercase tracking-tighter ${tier === UserTier.STUDENT ? 'bg-green-600 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  Student/Edu
                </button>
                <button 
                  onClick={() => setTier(UserTier.RESEARCHER)}
                  className={`py-2 px-3 rounded text-xs font-bold transition-all uppercase tracking-tighter ${tier === UserTier.RESEARCHER ? 'bg-blue-600 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  Researcher
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest block mb-3">Basin Context Awareness</label>
              <div className="space-y-2">
                {BASINS.map((basin) => (
                  <button
                    key={basin.id}
                    onClick={() => setActiveBasin(basin.id)}
                    className={`w-full text-left p-3 rounded border transition-all ${
                      activeBasin === basin.id 
                      ? 'bg-neutral-800 border-neutral-600 ring-1 ring-neutral-500' 
                      : 'bg-black border-neutral-800 hover:border-neutral-700 text-neutral-500'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-neutral-200">{basin.name}</span>
                      {activeBasin === basin.id && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
                    </div>
                    <p className="text-[10px] opacity-60 leading-tight">{basin.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Neural Stratigraphy Log (Field Notebook) */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Neural Stratigraphy Log</h3>
              <span className="text-[10px] mono text-neutral-500">{fieldLog.length} ENTRIES</span>
            </div>
            
            <div className="space-y-3">
              {fieldLog.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-neutral-800 rounded-lg">
                  <svg className="w-8 h-8 text-neutral-700 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-[10px] text-neutral-600 font-bold uppercase">No records detected in local cache</p>
                </div>
              ) : (
                fieldLog.map(entry => (
                  <div key={entry.id} className="p-3 bg-black border border-neutral-800 rounded hover:border-neutral-700 transition-all cursor-pointer group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-green-500 uppercase">{entry.unit}</span>
                      <span className="text-[10px] mono text-neutral-600">{entry.timestamp}</span>
                    </div>
                    <p className="text-xs text-neutral-300 font-semibold mb-1">{entry.lithology}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-neutral-800 rounded overflow-hidden">
                        <div className="h-full bg-neutral-600" style={{width: '60%'}}></div>
                      </div>
                      <span className="text-[10px] text-neutral-500 mono">{entry.thickness}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Analysis Result Modal */}
      {analysisResult && (
        <ResultDisplay 
          result={analysisResult} 
          tier={tier} 
          onClose={() => setAnalysisResult(null)} 
        />
      )}

      <Footer />
    </div>
  );
};

export default App;
