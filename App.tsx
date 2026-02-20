
import React, { useState } from 'react';
import { GameState, Lead, Message, VoiceSettings, Industry } from './types';
import { LEAD_DATABASE, SERVICE_BRIEFINGS, INDUSTRIES, getRandomVoiceSettings } from './constants';
import Header from './components/Header';
import Setup from './components/Setup';
import Roleplay from './components/Roleplay';
import CoachFeedback from './components/CoachFeedback';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    step: "setup",
    setupView: "industry",
    selectedIndustry: null,
    userIndustry: null,
    difficulty: "Medium",
    currentLead: null,
    voiceSettings: {
      pitch: "Balanced",
      speed: "Normal",
      accent: "Neutral"
    },
    messages: [],
    isCallEnded: false
  });

  const handleSelectIndustry = (industry: Industry) => {
    setState(prev => ({
      ...prev,
      selectedIndustry: industry,
      setupView: "leads"
    }));
  };

  const handleStartSetup = (lead: Lead) => {
    setState(prev => ({
      ...prev,
      step: "dossier",
      userIndustry: lead.industry,
      difficulty: lead.difficulty,
      currentLead: lead,
      voiceSettings: getRandomVoiceSettings(),
      messages: []
    }));
  };

  const handleBeginCall = () => {
    setState(prev => ({ ...prev, step: "roleplay" }));
  };

  const handleEndCall = (finalMessages: Message[], evaluation: string) => {
    setState(prev => ({
      ...prev,
      step: "coaching",
      messages: finalMessages,
      finalEvaluation: evaluation,
      isCallEnded: true
    }));
  };

  const handleReset = () => {
    setState({
      step: "setup",
      setupView: "industry",
      selectedIndustry: null,
      userIndustry: null,
      difficulty: "Medium",
      currentLead: null,
      voiceSettings: {
        pitch: "Balanced",
        speed: "Normal",
        accent: "Neutral"
      },
      messages: [],
      isCallEnded: false
    });
  };

  const handleNavigateBack = () => {
    setState(prev => {
      // If we are in leads view, go back to industry selection
      if (prev.step === "setup" && prev.setupView === "leads") {
        return { ...prev, setupView: "industry", selectedIndustry: null };
      }
      // If in dossier, go back to leads page
      if (prev.step === "dossier") {
        return { ...prev, step: "setup", setupView: "leads" };
      }
      // If in roleplay, go back to dossier for review
      if (prev.step === "roleplay") {
        return { ...prev, step: "dossier" };
      }
      // If in coaching, direct back to the leads page as requested
      if (prev.step === "coaching") {
        return { ...prev, step: "setup", setupView: "leads" };
      }
      return prev;
    });
  };

  const isBackDisabled = state.step === "setup" && state.setupView === "industry";

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 selection:bg-indigo-500/30 font-sans">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-start py-12 px-6">
        <div className="w-full max-w-4xl">
          <div className="flex mb-8">
            <button 
              onClick={handleNavigateBack}
              disabled={isBackDisabled}
              className={`group flex items-center gap-2 text-sm font-bold transition-all duration-300 uppercase tracking-widest ${
                isBackDisabled ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-indigo-400'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Go Back
            </button>
          </div>

          {state.step === "setup" && (
            <Setup 
              onStart={handleStartSetup} 
              onSelectIndustry={handleSelectIndustry}
              onBackToIndustry={() => setState(prev => ({ ...prev, setupView: "industry", selectedIndustry: null }))}
              view={state.setupView}
              selectedIndustry={state.selectedIndustry}
            />
          )}

          {state.step === "dossier" && state.currentLead && (
            <div className="bg-slate-900/50 rounded-3xl p-8 md:p-10 border border-slate-800 animate-in fade-in zoom-in duration-300 max-w-2xl mx-auto shadow-xl backdrop-blur-xl">
              <div className="flex items-start justify-between mb-10">
                <div className="fade-in-up">
                  <h2 className="text-2xl font-bold text-white tracking-tight">Lead Dossier</h2>
                  <p className="text-slate-400 text-sm mt-1">Review the briefing before initiating contact.</p>
                </div>
              </div>

              <div className="space-y-8 fade-in-up stagger-1">
                <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800/60">
                  <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 block">Campaign Goal</label>
                  <p className="text-slate-200 text-sm leading-relaxed font-medium">
                    {SERVICE_BRIEFINGS[state.currentLead.industry]}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/40">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg font-bold text-white shadow-inner">
                      {state.currentLead.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{state.currentLead.name}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">{state.currentLead.industry}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950/40 p-5 rounded-2xl border border-slate-800/40">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Difficulty Level</label>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                      state.difficulty === 'Hard' ? 'border-rose-500/30 text-rose-400 bg-rose-500/10' : 
                      state.difficulty === 'Medium' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' : 
                      'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                    }`}>{state.difficulty.toUpperCase()}</span>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/40">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Behavioral Profile & Pain Point</label>
                  <p className="text-slate-300 text-sm italic leading-relaxed font-medium">"{state.currentLead.context}"</p>
                </div>
              </div>

              <div className="mt-12 flex flex-col items-center fade-in-up stagger-3">
                <button
                  onClick={handleBeginCall}
                  className="group w-full py-4 bg-indigo-600 text-white font-bold rounded-xl text-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  Start Simulation
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                <p className="mt-4 text-[10px] font-semibold text-slate-600 uppercase tracking-[0.2em]">Objective: Secure a firm follow-up appointment</p>
              </div>
            </div>
          )}

          {state.step === "roleplay" && state.currentLead && (
            <Roleplay 
              lead={state.currentLead} 
              voiceSettings={state.voiceSettings}
              onEndCall={handleEndCall} 
            />
          )}

          {state.step === "coaching" && (
            <CoachFeedback 
              evaluation={state.finalEvaluation || ""} 
              transcript={state.messages}
              onReset={handleReset} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
