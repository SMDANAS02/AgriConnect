/**
 * TamilVoiceAssistant.jsx
 * Reusable voice-first Tamil farming assistant component.
 *
 * States: IDLE → LISTENING → PROCESSING → RESULT
 *
 * Technology:
 *  - Speech-to-Text  : Web Speech API (SpeechRecognition, lang: ta-IN)
 *  - Text-to-Speech  : Web Speech API (SpeechSynthesis, lang: ta-IN)
 *  - AI Backend      : POST /api/voice/query  (Tamil keyword Q&A engine)
 *
 * Props:
 *  - context  ('advisory' | 'disease' | 'general') — shapes the answer focus
 *  - className  optional extra Tailwind classes on the wrapper
 */

import React, {
  useState,
  useRef,
  useEffect,
  useCallback
} from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Loader2,
  Send,
  StopCircle,
  MessageSquare,
  Sprout,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { voiceService } from '../services/voiceService';

// ─── State machine constants ─────────────────────────────────────────────────
const S = {
  IDLE: 'idle',
  LISTENING: 'listening',
  PROCESSING: 'processing',
  RESULT: 'result'
};

// ─── Context-specific prompt text ────────────────────────────────────────────
const CONTEXT_PROMPTS = {
  advisory: {
    title: 'வானிலை & வேளாண் உதவியாளர்',
    subtitle: 'Weather & Farming Voice Guide',
    placeholder: 'எ.கா: "மழை வந்தால் நெல்லுக்கு என்ன செய்வது?"',
    hint: 'மழை, வெப்பம், உரம், பாசனம் பற்றி கேளுங்கள்'
  },
  disease: {
    title: 'பயிர் நோய் தமிழ் உதவியாளர்',
    subtitle: 'Crop Disease Tamil Voice Guide',
    placeholder: 'எ.கா: "நெல் கருகல் நோய்க்கு என்ன மருந்து?"',
    hint: 'நோய், பூச்சி, விதை, சிகிச்சை பற்றி கேளுங்கள்'
  },
  general: {
    title: 'தமிழ் வேளாண் உதவியாளர்',
    subtitle: 'Tamil Farming Voice Assistant',
    placeholder: 'எ.கா: "டிராக்டர் வாடகை எவ்வளவு?"',
    hint: 'எந்த விவசாய கேள்வியும் தமிழில் கேளுங்கள்'
  }
};

// ─── Category icon mapping ───────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  disease: { label: 'நோய் மேலாண்மை', color: 'text-red-700 bg-red-50 border-red-200' },
  pest: { label: 'பூச்சி கட்டுப்பாடு', color: 'text-orange-700 bg-orange-50 border-orange-200' },
  irrigation: { label: 'நீர் மேலாண்மை', color: 'text-sky-700 bg-sky-50 border-sky-200' },
  fertilizer: { label: 'உரம் மேலாண்மை', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  weather: { label: 'வானிலை ஆலோசனை', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  equipment: { label: 'இயந்திர வாடகை', color: 'text-harvest-700 bg-harvest-50 border-harvest-200' },
  season: { label: 'பருவகால வழிகாட்டி', color: 'text-agri-700 bg-agri-50 border-agri-200' },
  general: { label: 'பொது ஆலோசனை', color: 'text-slate-700 bg-slate-50 border-slate-200' }
};

// ─── Waveform bar animation component ────────────────────────────────────────
const WaveformBars = () => (
  <div className="flex items-end gap-[3px] h-8" aria-hidden="true">
    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
      <div
        key={i}
        className="w-1.5 bg-red-500 rounded-full"
        style={{
          height: `${Math.random() * 60 + 20}%`,
          animation: `waveBar 0.8s ease-in-out ${i * 0.1}s infinite alternate`
        }}
      />
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const TamilVoiceAssistant = ({ context = 'general', className = '' }) => {
  const [voiceState, setVoiceState] = useState(S.IDLE);
  const [transcript, setTranscript] = useState('');
  const [answer, setAnswer] = useState('');
  const [answerCategory, setAnswerCategory] = useState('general');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasMicSupport, setHasMicSupport] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const isMountedRef = useRef(true);

  const prompt = CONTEXT_PROMPTS[context] || CONTEXT_PROMPTS.general;

  // ── Sync transcript ref to avoid stale closures in event handlers ──────────
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // ── Check browser support & cleanup on unmount ────────────────────────────
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setHasMicSupport(false);
      setShowTextInput(true);
    }
    return () => {
      isMountedRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ── Tamil TTS helper ──────────────────────────────────────────────────────
  const speakTamil = useCallback((text) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ta-IN';
    utterance.rate = 0.88;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to select a Tamil voice if available
    const voices = window.speechSynthesis.getVoices();
    const tamilVoice = voices.find(
      (v) => v.lang === 'ta-IN' || v.lang.startsWith('ta')
    );
    if (tamilVoice) utterance.voice = tamilVoice;

    utterance.onstart = () => {
      if (isMountedRef.current) setIsSpeaking(true);
    };
    utterance.onend = () => {
      if (isMountedRef.current) setIsSpeaking(false);
    };
    utterance.onerror = () => {
      if (isMountedRef.current) setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // ── Send query to backend & handle response ───────────────────────────────
  const processQuery = useCallback(
    async (queryText) => {
      const trimmed = queryText.trim();
      if (!trimmed) return;

      if (isMountedRef.current) setVoiceState(S.PROCESSING);

      try {
        const res = await voiceService.queryTamilAssistant(trimmed, context);
        const { answer: ans, category } = res?.data || {};

        if (!isMountedRef.current) return;

        const finalAnswer =
          ans || 'மன்னிக்கவும், பதில் பெற இயலவில்லை. மீண்டும் முயலுங்கள்.';

        setAnswer(finalAnswer);
        setAnswerCategory(category || 'general');
        setVoiceState(S.RESULT);
        speakTamil(finalAnswer);
      } catch (err) {
        if (!isMountedRef.current) return;
        toast.error('இணைப்பு தவறு — மீண்டும் முயலுங்கள்');
        setVoiceState(S.IDLE);
      }
    },
    [context, speakTamil]
  );

  // ── Start voice recognition ───────────────────────────────────────────────
  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setShowTextInput(true);
      return;
    }

    // Reset transcript ref before new session
    transcriptRef.current = '';
    setTranscript('');

    const recognition = new SpeechRecognition();
    recognition.lang = 'ta-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      if (isMountedRef.current) setVoiceState(S.LISTENING);
    };

    recognition.onresult = (event) => {
      // Concatenate all partial results
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        interim += event.results[i][0].transcript;
      }
      if (isMountedRef.current) {
        setTranscript(interim);
        transcriptRef.current = interim;
      }
    };

    recognition.onend = () => {
      const captured = transcriptRef.current;
      if (captured && captured.trim()) {
        processQuery(captured);
      } else {
        if (isMountedRef.current) {
          setVoiceState(S.IDLE);
          toast('பேச்சு கேட்கவில்லை — மீண்டும் முயலுங்கள் 🎤', { icon: '🎙️' });
        }
      }
    };

    recognition.onerror = (event) => {
      if (!isMountedRef.current) return;
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        toast.error('மைக்ரோஃபோன் அனுமதி தேவை — Browser settings-ல் Allow செய்யுங்கள்');
        setShowTextInput(true);
      } else if (event.error === 'no-speech') {
        toast('பேச்சு கேட்கவில்லை', { icon: '🎙️' });
      } else if (event.error === 'network') {
        toast.error('இணைப்பு இல்லை');
      }
      setVoiceState(S.IDLE);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      toast.error('மைக்ரோஃபோன் தொடங்க இயலவில்லை');
      setVoiceState(S.IDLE);
    }
  }, [processQuery]);

  // ── Stop recognition manually ─────────────────────────────────────────────
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
  }, []);

  // ── Reset all state ───────────────────────────────────────────────────────
  const reset = useCallback(() => {
    stopSpeaking();
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (_) {}
    }
    setVoiceState(S.IDLE);
    setTranscript('');
    setAnswer('');
    setAnswerCategory('general');
    setTextInput('');
    transcriptRef.current = '';
  }, [stopSpeaking]);

  // ── Text fallback submit ──────────────────────────────────────────────────
  const handleTextSubmit = (e) => {
    e.preventDefault();
    const val = textInput.trim();
    if (!val) return;
    setTranscript(val);
    transcriptRef.current = val;
    processQuery(val);
  };

  // ── Replay audio ─────────────────────────────────────────────────────────
  const replayAnswer = () => {
    if (answer) speakTamil(answer);
  };

  const catConfig =
    CATEGORY_CONFIG[answerCategory] || CATEGORY_CONFIG.general;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Inject waveform keyframe animation once */}
      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.3); opacity: 0.6; }
          to   { transform: scaleY(1);   opacity: 1;   }
        }
        @keyframes micPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          50%       { box-shadow: 0 0 0 14px rgba(239,68,68,0); }
        }
        @keyframes idlePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(22,163,74,0.4); }
          50%       { box-shadow: 0 0 0 10px rgba(22,163,74,0); }
        }
      `}</style>

      <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-agri-900 via-agri-800 to-slate-900 cursor-pointer select-none"
          onClick={() => setIsExpanded((p) => !p)}
          role="button"
          aria-expanded={isExpanded}
          aria-label="Toggle voice assistant"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-agri-500/30 border border-agri-400/40 flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5 text-agri-300" />
            </div>
            <div>
              <p className="text-white font-bold text-base leading-tight">
                {prompt.title}
              </p>
              <p className="text-agri-300 text-xs font-medium">
                {prompt.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language badge */}
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-agri-700/60 text-agri-200 rounded-full border border-agri-600/40">
              ta-IN
            </span>
            {isExpanded
              ? <ChevronUp className="w-4 h-4 text-slate-400" />
              : <ChevronDown className="w-4 h-4 text-slate-400" />
            }
          </div>
        </div>

        {/* ── Collapsible body ────────────────────────────────────────────── */}
        {isExpanded && (
          <div className="p-5 space-y-5">

            {/* ── IDLE state ─────────────────────────────────────────────── */}
            {voiceState === S.IDLE && (
              <div className="flex flex-col items-center gap-4 py-4">
                {/* Large mic button */}
                <button
                  onClick={hasMicSupport ? startListening : () => setShowTextInput(true)}
                  aria-label="Start Tamil voice input"
                  className="w-20 h-20 rounded-full bg-agri-600 hover:bg-agri-700 active:scale-95 flex items-center justify-center transition-all duration-200 shadow-lg shadow-agri-600/40"
                  style={{ animation: 'idlePulse 2.5s ease-in-out infinite' }}
                >
                  <Mic className="w-9 h-9 text-white" />
                </button>

                <div className="text-center space-y-1">
                  <p className="text-base font-bold text-slate-800">
                    {hasMicSupport
                      ? 'தமிழில் கேளுங்கள் — கிளிக் செய்யுங்கள்'
                      : 'கீழே தட்டச்சு செய்யுங்கள்'}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {prompt.hint}
                  </p>
                </div>

                {/* Text fallback toggle */}
                {hasMicSupport && (
                  <button
                    onClick={() => setShowTextInput((p) => !p)}
                    className="text-xs font-bold text-agri-600 hover:text-agri-700 hover:underline flex items-center gap-1 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {showTextInput ? 'உரை மறை' : 'தமிழில் தட்டச்சு செய்யவும்'}
                  </button>
                )}

                {/* Text input (always shown if no mic, toggle otherwise) */}
                {showTextInput && (
                  <form
                    onSubmit={handleTextSubmit}
                    className="w-full flex gap-2 pt-1"
                  >
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={prompt.placeholder}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-agri-500 transition-colors"
                      lang="ta"
                      dir="ltr"
                    />
                    <button
                      type="submit"
                      disabled={!textInput.trim()}
                      className="btn-primary py-2.5 px-4 text-sm disabled:opacity-40 shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ── LISTENING state ────────────────────────────────────────── */}
            {voiceState === S.LISTENING && (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-4 py-3">
                  {/* Pulsing red mic */}
                  <button
                    onClick={stopListening}
                    aria-label="Stop listening"
                    className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 active:scale-95 flex items-center justify-center transition-all duration-200 shadow-lg shadow-red-500/40"
                    style={{ animation: 'micPulse 1.2s ease-out infinite' }}
                  >
                    <MicOff className="w-9 h-9 text-white" />
                  </button>

                  {/* Waveform animation */}
                  <div className="flex items-center gap-3">
                    <WaveformBars />
                    <span className="text-sm font-bold text-red-600 animate-pulse">
                      கேட்கிறேன்...
                    </span>
                    <WaveformBars />
                  </div>

                  <p className="text-xs text-slate-500 font-medium text-center">
                    பேசி முடிந்தால் தானாக நிற்கும் • Tap to stop early
                  </p>
                </div>

                {/* Live transcript */}
                {transcript && (
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">
                      கேட்கிறது
                    </p>
                    <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                      {transcript}
                      <span className="inline-block w-0.5 h-4 bg-agri-600 ml-0.5 animate-pulse align-middle" />
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── PROCESSING state ───────────────────────────────────────── */}
            {voiceState === S.PROCESSING && (
              <div className="space-y-4">
                {/* Transcript recap */}
                {transcript && (
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">
                      உங்கள் கேள்வி
                    </p>
                    <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                      "{transcript}"
                    </p>
                  </div>
                )}

                {/* Spinner */}
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-4 border-agri-100 border-t-agri-600 animate-spin" />
                    <Sprout className="w-6 h-6 text-agri-600 absolute inset-0 m-auto" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">
                    பதில் தயாராகிறது...
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    Preparing your Tamil farming answer
                  </p>
                </div>
              </div>
            )}

            {/* ── RESULT state ───────────────────────────────────────────── */}
            {voiceState === S.RESULT && (
              <div className="space-y-4">
                {/* Transcript */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">
                    உங்கள் கேள்வி
                  </p>
                  <p className="text-sm font-semibold text-slate-700 leading-relaxed italic">
                    "{transcript}"
                  </p>
                </div>

                {/* Category badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${catConfig.color}`}
                  >
                    {catConfig.label}
                  </span>
                  {isSpeaking && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-agri-600 animate-pulse">
                      <Volume2 className="w-3.5 h-3.5" />
                      ஒலிக்கிறது...
                    </span>
                  )}
                </div>

                {/* Answer card */}
                <div className="bg-agri-50 rounded-2xl border border-agri-200 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-agri-800 font-bold text-sm">
                    <Sprout className="w-4 h-4 text-agri-600 shrink-0" />
                    பதில் (Answer)
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {answer}
                  </p>
                </div>

                {/* Action row */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {/* Replay / Stop audio */}
                  {isSpeaking ? (
                    <button
                      onClick={stopSpeaking}
                      className="btn-outline py-2 px-4 text-xs text-red-600 hover:bg-red-50 border-red-200"
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                      நிறுத்து
                    </button>
                  ) : (
                    <button
                      onClick={replayAnswer}
                      className="btn-outline py-2 px-4 text-xs"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-agri-600" />
                      மீண்டும் கேளுங்கள்
                    </button>
                  )}

                  {/* New voice question */}
                  {hasMicSupport && (
                    <button
                      onClick={() => {
                        reset();
                        // slight delay so state settles before starting
                        setTimeout(startListening, 150);
                      }}
                      className="btn-primary py-2 px-4 text-xs"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      புதிய கேள்வி
                    </button>
                  )}

                  {/* Reset */}
                  <button
                    onClick={reset}
                    className="btn-outline py-2 px-4 text-xs ml-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    மீட்டமை
                  </button>
                </div>
              </div>
            )}

            {/* ── Browser compatibility notice ──────────────────────────── */}
            {!hasMicSupport && voiceState === S.IDLE && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-3">
                <span className="text-amber-500 text-base shrink-0">⚠️</span>
                <p className="text-xs font-medium text-amber-800 leading-relaxed">
                  உங்கள் browser வாய்ஸ் ஆதரிக்கவில்லை. Chrome அல்லது Edge-ல்
                  திறந்து பயன்படுத்துங்கள். கீழே தட்டச்சு மூலம் கேளுங்கள்.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TamilVoiceAssistant;
