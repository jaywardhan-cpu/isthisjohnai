import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-slate-800/60 py-4 px-8 sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-white">
            Isthisjohn <span className="text-indigo-500 uppercase">AI</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
            <span>Real-time Simulation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            <span>AI Evaluation</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;