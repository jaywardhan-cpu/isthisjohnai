import React from 'react';
import { Industry, Lead } from '../types';
import { INDUSTRIES, LEAD_DATABASE } from '../constants';

interface SetupProps {
  onStart: (lead: Lead) => void;
  onSelectIndustry: (industry: Industry) => void;
  onBackToIndustry: () => void;
  view: 'industry' | 'leads';
  selectedIndustry: Industry | null;
}

const Setup: React.FC<SetupProps> = ({ 
  onStart, 
  onSelectIndustry, 
  onBackToIndustry,
  view, 
  selectedIndustry 
}) => {
  const filteredLeads = selectedIndustry 
    ? LEAD_DATABASE.filter(l => l.industry === selectedIndustry)
    : [];

  if (view === 'leads' && selectedIndustry) {
    return (
      <div className="bg-slate-900/40 rounded-[2rem] shadow-2xl p-8 border border-slate-800/80 animate-in fade-in slide-in-from-right-8 duration-700 max-w-4xl mx-auto backdrop-blur-3xl">
        <div className="flex justify-between items-center mb-10">
          <div className="fade-in-up">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
              Select a Lead
            </h2>
            <p className="text-slate-500 text-sm mt-1 ml-4">{selectedIndustry}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
          {filteredLeads.map((lead, idx) => (
            <button
              key={lead.id}
              onClick={() => onStart(lead)}
              className="p-6 text-left rounded-2xl border border-slate-800 bg-slate-950/40 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all group fade-in-up hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 shimmer"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-bold text-white group-hover:text-indigo-300 transition-colors text-lg tracking-tight">{lead.name}</span>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border transition-all ${
                  lead.difficulty === 'Hard' ? 'border-rose-500/30 text-rose-400 bg-rose-500/10' : 
                  lead.difficulty === 'Medium' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' : 
                  'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                }`}>
                  {lead.difficulty.toUpperCase()}
                </span>
              </div>
              <p className="text-indigo-400/80 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">{lead.persona.split('.')[0]}</p>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 font-medium">{lead.context}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 rounded-[3rem] shadow-2xl p-12 md:p-16 border border-slate-800/50 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-2xl mx-auto text-center backdrop-blur-2xl relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/10 blur-[100px] rounded-full"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/10 blur-[100px] rounded-full"></div>

      <div className="fade-in-up stagger-1 relative z-10">
        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
          <span className="animate-gradient-text">Isthisjohn</span> 
          <span className="text-white ml-2 drop-shadow-lg uppercase">
            AI
          </span>
        </h2>
        <p className="text-slate-400 mb-14 font-medium text-lg leading-relaxed max-w-md mx-auto">
          Learn the art of cold calling with AI.
        </p>
      </div>

      <div className="space-y-10 text-left fade-in-up stagger-2 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-6 ml-1">
            <div className="h-[1px] w-6 bg-indigo-500/50"></div>
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">Industry Verticals</label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INDUSTRIES.map((ind, idx) => (
              <button
                key={ind}
                onClick={() => onSelectIndustry(ind)}
                className={`p-6 text-left rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/15 fade-in-up shimmer group ${
                  selectedIndustry === ind 
                    ? "border-indigo-500 bg-indigo-500/15 text-indigo-300 shadow-indigo-500/20" 
                    : "border-slate-800/80 hover:border-slate-600 text-slate-400 bg-slate-950/60"
                }`}
                style={{ animationDelay: `${(idx + 5) * 70}ms` }}
              >
                <div className="flex items-center gap-4">
                   <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${selectedIndustry === ind ? 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]' : 'bg-slate-700 group-hover:bg-slate-500'}`}></div>
                   <span className="font-bold text-sm tracking-tight group-hover:text-slate-200 transition-colors">{ind}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;