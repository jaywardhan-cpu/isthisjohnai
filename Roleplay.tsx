
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Lead, Message, VoiceSettings } from '../types';
import { getCoachEvaluation, getLiveProspectInstruction } from '../services/gemini';
import { createBlob, decode, decodeAudioData } from '../services/audio';
import { getVoiceForLead } from '../constants';

interface RoleplayProps {
  lead: Lead;
  voiceSettings: VoiceSettings;
  onEndCall: (messages: Message[], evaluation: string) => void;
}

const Roleplay: React.FC<RoleplayProps> = ({ lead, voiceSettings, onEndCall }) => {
  const [status, setStatus] = useState("Initializing...");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const [userTranscribing, setUserTranscribing] = useState("");
  const [modelTranscribing, setModelTranscribing] = useState("");
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);
  
  const currentMessagesRef = useRef<Message[]>([]);
  const currentUserTextRef = useRef("");
  const currentModelTextRef = useRef("");
  const isFinishingRef = useRef(false);
  const startTimeRef = useRef<number>(0);
  const hasSpokenRef = useRef<boolean>(false);

  const stopSession = () => {
    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch (e) {}
      sessionRef.current = null;
    }
    sourcesRef.current.forEach(s => {
      try { s.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
  };

  const handleFinish = async (isManual = true) => {
    if (isFinishingRef.current) return;
    
    // Safety check: if call is extremely short and no one spoke, it might be a connection issue
    const duration = Date.now() - startTimeRef.current;
    if (!isManual && duration < 5000 && !hasSpokenRef.current && currentMessagesRef.current.length === 0) {
      setStatus("Connection error.");
      stopSession();
      return;
    }

    isFinishingRef.current = true;
    setIsFinishing(true);
    
    if (!isManual) {
        setStatus("Prospect Hung Up");
    } else {
        setStatus("Analyzing...");
    }
    
    stopSession();
    
    const finalMessages = [...currentMessagesRef.current];
    if (currentUserTextRef.current.trim()) {
      finalMessages.push({ role: 'user', content: currentUserTextRef.current.trim() });
    }
    if (currentModelTextRef.current.trim()) {
      // Filter out "End Scene" from the final stored message
      const cleanedContent = currentModelTextRef.current.replace(/end scene/gi, '').trim();
      if (cleanedContent) {
        finalMessages.push({ role: 'model', content: cleanedContent });
      }
    }
    
    try {
      const evaluation = await getCoachEvaluation(finalMessages, lead);
      onEndCall(finalMessages, evaluation);
    } catch (e) {
      const fallbackEvaluation = `
1. OVERALL SCORE: 0/10
2. THE BRUTAL TRUTH: Technical interference. The line was cut before intelligence could be gathered.
3. TONALITY ANALYSIS: N/A.
4. THE PATTERN INTERRUPT: N/A.
5. VIDEO ALIGNMENT: N/A.
6. OBJECTION HANDLING: N/A.
7. THE CLOSE: Mission aborted.
8. ACTIONABLE ROADMAP: Re-establish connection and try again.
      `.trim();
      onEndCall(finalMessages, fallbackEvaluation);
    }
  };

  useEffect(() => {
    let inputAudioContext: AudioContext;
    let outputAudioContext: AudioContext;
    let stream: MediaStream;

    const startLive = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = outputAudioContext;
        startTimeRef.current = Date.now();

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          callbacks: {
            onopen: () => {
              setStatus("Live Call");
            },
            onmessage: async (message: LiveServerMessage) => {
              if (isFinishingRef.current) return;
              
              // Handle Transcriptions
              if (message.serverContent?.outputTranscription) {
                const text = message.serverContent.outputTranscription.text;
                currentModelTextRef.current += text;
                setModelTranscribing(currentModelTextRef.current);
                hasSpokenRef.current = true;
                
                if (text.toLowerCase().includes("end scene")) {
                    handleFinish(false);
                }
              } else if (message.serverContent?.inputTranscription) {
                const text = message.serverContent.inputTranscription.text;
                currentUserTextRef.current += text;
                setUserTranscribing(currentUserTextRef.current);
              }

              // Handle Turns
              if (message.serverContent?.turnComplete) {
                if (currentUserTextRef.current.trim()) {
                  currentMessagesRef.current.push({ role: 'user', content: currentUserTextRef.current.trim() });
                  setMessages([...currentMessagesRef.current]);
                }
                if (currentModelTextRef.current.trim()) {
                  const cleanedContent = currentModelTextRef.current.replace(/end scene/gi, '').trim();
                  if (cleanedContent) {
                    currentMessagesRef.current.push({ role: 'model', content: cleanedContent });
                    setMessages([...currentMessagesRef.current]);
                  }
                }
                currentUserTextRef.current = "";
                currentModelTextRef.current = "";
                setUserTranscribing("");
                setModelTranscribing("");
              }

              // Handle Audio Output
              const audioPart = message.serverContent?.modelTurn?.parts?.find(p => p.inlineData);
              const base64Audio = audioPart?.inlineData?.data;
              
              if (base64Audio) {
                hasSpokenRef.current = true;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
                const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                const source = outputAudioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputAudioContext.destination);
                source.onended = () => sourcesRef.current.delete(source);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }

              // Handle Interruptions
              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onclose: (e) => {
              if (!isFinishingRef.current) handleFinish(false);
            },
            onerror: (e) => {
              if (!isFinishingRef.current) handleFinish(false);
            }
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: getVoiceForLead(lead.name) as any } }
            },
            systemInstruction: getLiveProspectInstruction(lead, voiceSettings),
            inputAudioTranscription: {},
            outputAudioTranscription: {}
          }
        });

        // Setup Microphone Input
        const sourceNode = inputAudioContext.createMediaStreamSource(stream);
        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
        
        scriptProcessor.onaudioprocess = (e) => {
          if (isFinishingRef.current) return;
          const inputData = e.inputBuffer.getChannelData(0);
          const pcmBlob = createBlob(inputData);
          
          sessionPromise.then((activeSession) => {
            activeSession.sendRealtimeInput({ media: pcmBlob });
          }).catch(err => {});
        };
        
        sourceNode.connect(scriptProcessor);
        scriptProcessor.connect(inputAudioContext.destination);

        sessionPromise.then(s => {
          sessionRef.current = s;
        });

      } catch (err) {
        setStatus("Init Failed");
      }
    };

    startLive();

    return () => {
      stopSession();
      if (inputAudioContext) inputAudioContext.close();
      if (outputAudioContext) outputAudioContext.close();
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [lead]);

  return (
    <div className="flex flex-col h-[600px] bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden animate-in fade-in duration-300 max-w-2xl mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-950/40">
        <div className="relative mb-10">
          {(status === "Live Call" || status === "Prospect Hung Up") && (
            <div className={`absolute inset-0 rounded-full blur-2xl animate-pulse scale-125 ${status === "Prospect Hung Up" ? 'bg-rose-500/20' : 'bg-indigo-500/10'}`}></div>
          )}
          <div className={`w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center relative z-10 border shadow-xl overflow-hidden transition-colors ${status === "Prospect Hung Up" ? 'border-rose-500/50' : 'border-slate-800'}`}>
            <div className="text-white font-bold text-3xl">
              {lead.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h3 className="text-xl font-bold text-white mb-1">{lead.name}</h3>
          <p className={`text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 ${status === "Prospect Hung Up" ? 'text-rose-400' : 'text-slate-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === "Live Call" ? 'bg-indigo-500' : status === "Prospect Hung Up" ? 'bg-rose-500 animate-ping' : 'bg-slate-700'}`}></span>
            {status}
          </p>
        </div>

        <div className="w-full max-w-md h-28 overflow-hidden flex items-center justify-center px-8 bg-slate-900/50 rounded-2xl border border-slate-800/50">
            <p className={`font-medium text-center text-sm italic leading-relaxed ${status === "Prospect Hung Up" ? 'text-rose-300' : 'text-slate-300'}`}>
              {isFinishing && status !== "Prospect Hung Up" ? "Generating scorecard..." : (modelTranscribing || userTranscribing || (status === "Live Call" ? "Say hello..." : status === "Prospect Hung Up" ? "The line is dead." : "Connecting..."))}
            </p>
        </div>
      </div>

      <div className="p-8 bg-slate-900 border-t border-slate-800 flex justify-center">
        <button
          onClick={() => handleFinish(true)}
          disabled={isFinishing}
          className={`px-12 py-4 font-bold rounded-xl transition-all shadow-lg text-sm uppercase tracking-widest flex items-center gap-3 ${
            isFinishing ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-500 text-white'
          }`}
        >
          {isFinishing && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {status === "Prospect Hung Up" ? "View Scorecard" : "End Call"}
        </button>
      </div>
    </div>
  );
};

export default Roleplay;
