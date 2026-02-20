
import React, { useState } from 'react';
import { Message } from '../types';

interface CoachFeedbackProps {
  evaluation: string;
  transcript: Message[];
  onReset: () => void;
}

const CoachFeedback: React.FC<CoachFeedbackProps> = ({ evaluation, transcript, onReset }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'transcript'>('analysis');
  const scoreMatch = evaluation.match(/OVERALL SCORE: \[?(\d+)\/10\]?/i);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
  
  const sections = evaluation.split(/\d+\.\s+/).filter(Boolean);

  return (
    <div className="bg-slate-900/50 rounded-3xl shadow-xl border border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-2xl mx-auto mb-20">
      <div className="bg-slate-950/40 p-8 flex justify-between items-center border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Post-Call Analysis</h2>
          <p className="text-slate-500 text-xs mt-1">Detailed performance scorecard</p>
        </div>
        <div className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-colors duration-500 ${
          score >= 8 ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 
          score >= 5 ? 'border-amber-500/50 bg-amber-500/5 text-amber-400' : 
          'border-rose-500/50 bg-rose-500/5 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
        }`}>
          <span className="text-2xl font-bold">{score}</span>
          <span className="text-[10px] font-bold opacity-60">/10</span>
        </div>
      </div>

      <div className="bg-slate-950/20 p-2 flex border-b border-slate-800">
        <button 
          onClick={() => setActiveTab('analysis')}
          className={`flex-1 py-3 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'analysis' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Coaching Report
        </button>
        <button 
          onClick={() => setActiveTab('transcript')}
          className={`flex-1 py-3 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'transcript' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Call Transcript
        </button>
      </div>

      <div className="p-10 min-h-[400px]">
        {activeTab === 'analysis' ? (
          <div className="space-y-12">
            {sections.map((section, idx) => {
              const parts = section.split(':');
              const title = parts[0]?.trim();
              const body = parts.slice(1).join(':').trim();
              
              if (!body) return <div key={idx} className="text-slate-300 font-medium leading-relaxed">{section}</div>;

              const upperTitle = title?.toUpperCase();
              const isBrutalTruth = upperTitle === "THE BRUTAL TRUTH";
              const isSummary = upperTitle === "CALL SUMMARY";

              return (
                <div key={idx} className={`
                  ${isBrutalTruth ? 'bg-rose-500/5 p-6 rounded-2xl border border-rose-500/10' : ''}
                  ${isSummary ? 'bg-slate-950/40 p-6 rounded-2xl border-l-4 border-l-indigo-500/50 border-y border-r border-slate-800' : ''}
                `}>
                  <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-3 
                    ${isBrutalTruth ? 'text-rose-400' : 
                      isSummary ? 'text-indigo-400' : 'text-slate-500 opacity-80'}
                  `}>
                    {title}
                  </h3>
                  <div className={`
                    ${isBrutalTruth ? 'text-white italic font-medium text-lg' : 
                      isSummary ? 'text-slate-300 font-medium text-sm' : 'text-slate-400 text-sm'}
                    leading-relaxed whitespace-pre-wrap
                  `}>
                    {body}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {transcript.length > 0 ? (
              transcript.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1 px-1">
                    {m.role === 'user' ? 'You (SDR)' : 'Prospect'}
                  </span>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] ${
                    m.role === 'user' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-500 italic text-center py-20 text-sm">No transcript data available.</div>
            )}
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-slate-800">
          <button
            onClick={onReset}
            className="w-full py-4 bg-white text-slate-950 font-bold rounded-xl text-md hover:bg-slate-100 transition-all active:scale-95 shadow-lg"
          >
            New Mission
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoachFeedback;
