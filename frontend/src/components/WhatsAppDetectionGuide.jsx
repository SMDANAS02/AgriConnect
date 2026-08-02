import React, { useState } from 'react';
import {
  MessageCircle,
  Smartphone,
  Send,
  CheckCircle2,
  Camera,
  HelpCircle,
  Loader2,
  ShieldCheck,
  Image as ImageIcon,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../services/apiClient';
import { SAMPLE_IMAGES } from '../utils/sampleImages';

const WhatsAppDetectionGuide = () => {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_IMAGES?.[0] || {
    url: 'https://images.unsplash.com/photo-1536053464738-4e892c9060b9?auto=format&fit=crop&q=80&w=800',
    label: 'Paddy Leaf with Blast'
  });
  const [caption, setCaption] = useState('My paddy crop leaf has brown spots and drying tip. Please diagnose.');
  const [senderPhone, setSenderPhone] = useState('+91 98765-43210');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const handleSimulate = async (e) => {
    e.preventDefault();
    if (!caption && !selectedSample?.url) {
      toast.error('Please select an image or enter a text description.');
      return;
    }

    // Add user message bubble to chat preview immediately
    const userMessage = {
      sender: 'user',
      text: caption,
      image: selectedSample?.url || null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await apiClient.post('/whatsapp/simulate', {
        imageUrl: selectedSample?.url || null,
        caption: caption.trim(),
        from: senderPhone,
        senderName: 'Tamil Nadu Farmer'
      });

      const replyData = response?.data?.data;

      if (replyData && replyData.whatsAppBotReply) {
        const botMessage = {
          sender: 'bot',
          text: replyData.whatsAppBotReply,
          diagnosis: replyData.diagnosis,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory((prev) => [...prev, botMessage]);
        toast.success('WhatsApp Bot reply generated!');
      } else {
        toast.error('Did not receive a formatted reply from server.');
      }
    } catch (err) {
      console.error('WhatsApp simulation error:', err);
      toast.error('Failed to communicate with WhatsApp detection service.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setChatHistory([]);
    setCaption('My paddy crop leaf has brown spots and drying tip. Please diagnose.');
    toast.success('Simulation chat reset');
  };

  return (
    <div id="whatsapp-section" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden my-8">
      {/* Top Banner - NO glassmorphism, clean solid & gradient typography */}
      <div className="bg-gradient-to-r from-emerald-900 via-agri-800 to-slate-900 p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800">
        <div className="space-y-3 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/30 text-emerald-300 font-bold text-xs rounded-full border border-emerald-400/40 uppercase tracking-wider">
            <MessageCircle className="w-4 h-4 text-emerald-400 fill-current" />
            Zero App Installation Required
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            WhatsApp AI Crop Disease Doctor
          </h2>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Diagnose plant diseases straight from your field even on low-bandwidth networks. Just send a leaf photo to our dedicated official WhatsApp number for instant Tamil & English remedy prescriptions.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-700 p-5 rounded-2xl text-center shrink-0 shadow-xl space-y-2 w-full sm:w-auto">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">24/7 Farmer Helpline</p>
          <p className="text-2xl font-black text-white tracking-tight">+91 1800-425-AGRI</p>
          <p className="text-xs text-slate-400">Save contact as &quot;AgriConnect Bot&quot;</p>
          <div className="pt-2">
            <a
              href="#simulate-tester"
              className="inline-flex items-center justify-center w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-colors gap-1.5"
            >
              <Smartphone className="w-4 h-4" /> Try Interactive Simulator
            </a>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-10">
        {/* 3-Step Instruction Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-agri-600" />
            How to Use WhatsApp Crop Detection in 3 Simple Steps
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 relative hover:border-emerald-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-slate-800 text-base">Save WhatsApp Contact</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Add <strong>+91 1800-425-AGRI</strong> to your mobile phonebook. Send a quick hello message or type <strong>&quot;START&quot;</strong> to initialize the farmer menu.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 relative hover:border-emerald-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-slate-800 text-base">Send Crop Leaf Photo</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Take a sharp photo of the discolored or infected crop leaf under natural sunlight. Send it in chat with the crop name (e.g., &quot;Paddy&quot; or &quot;Tomato&quot;).
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 relative hover:border-emerald-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-slate-800 text-base">Receive AI Prescription</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                In less than 5 seconds, receive an automated response with the identified pathogen, immediate fungicide dosages, and government subsidy links.
              </p>
            </div>
          </div>
        </div>

        <hr className="border-slate-200" />

        {/* Live Simulator Tester Section */}
        <div id="simulate-tester" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-emerald-600" />
                Live Interactive WhatsApp Bot Simulator
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Test the backend webhook and preview exact WhatsApp chat formatting in real-time.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="btn-outline py-2 px-3.5 text-xs text-slate-600 border-slate-300 hover:bg-slate-100 self-start sm:self-auto flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Chat History
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Control Panel (5 Columns) */}
            <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Step A: Pick Sample Crop Leaf Photo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_IMAGES && SAMPLE_IMAGES.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedSample(img)}
                      className={`rounded-xl overflow-hidden border-2 transition-all p-0.5 aspect-square relative ${
                        selectedSample?.url === img.url ? 'border-emerald-600 ring-2 ring-emerald-500/30 shadow-md' : 'border-slate-200 opacity-80 hover:opacity-100'
                      }`}
                      title={img.label}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover rounded-lg" />
                      <div className="absolute inset-x-0 bottom-0 bg-slate-900/80 text-[9px] font-bold text-white p-1 truncate text-center">
                        {img.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSimulate} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Step B: Add WhatsApp Message / Caption
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={3}
                    placeholder="Describe symptoms or crop name..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Farmer WhatsApp Number (Demo ID)
                  </label>
                  <input
                    type="text"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>Sending to Webhook...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 fill-current" />
                      <span>Simulate WhatsApp Message</span>
                    </>
                  )}
                </button>
              </form>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 p-2.5 rounded-xl border border-emerald-300/60">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                Webhook payload is validated against live backend Q&amp;A pipeline without commercial Twilio tokens.
              </div>
            </div>

            {/* Chat Screen Simulator (7 Columns) */}
            <div className="lg:col-span-7 bg-slate-100 rounded-2xl border border-slate-300 overflow-hidden flex flex-col h-[520px] shadow-inner">
              {/* WhatsApp UI Top Bar */}
              <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shrink-0 shadow">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white text-[#075e54] font-black flex items-center justify-center text-sm shadow">
                    AG
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight text-white">AgriConnect Crop Doctor</h4>
                    <p className="text-[11px] text-emerald-200 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                      Online • Official Verified Bot
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-800 px-2.5 py-1 rounded border border-emerald-600">
                  Sandbox View
                </span>
              </div>

              {/* Chat Bubble Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#ece5dd]" style={{ backgroundImage: 'radial-gradient(#d1cbbd 1px, transparent 0)', backgroundSize: '20px 20px' }}>
                {/* Default Welcome Message */}
                <div className="flex justify-start">
                  <div className="bg-white text-slate-800 rounded-2xl rounded-tl-none p-3.5 max-w-[85%] shadow-sm border border-slate-200 space-y-1">
                    <p className="text-xs font-extrabold text-emerald-700">AgriConnect AI Bot</p>
                    <p className="text-sm font-medium leading-relaxed">
                       வணக்கம்! Welcome to AgriConnect WhatsApp Diagnostic line. Send me a photograph of your crop leaf with a brief description to receive immediate disease remedies in Tamil &amp; English! 🌿
                    </p>
                    <div className="text-[10px] text-slate-400 text-right font-medium">10:00 AM</div>
                  </div>
                </div>

                {/* Render Simulated Conversation */}
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`rounded-2xl p-3.5 max-w-[88%] shadow-md space-y-2 ${
                        msg.sender === 'user'
                          ? 'bg-[#dcf8c6] text-slate-900 rounded-tr-none border border-emerald-200'
                          : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                      }`}
                    >
                      {msg.sender === 'bot' && (
                        <div className="flex items-center justify-between text-xs font-extrabold text-emerald-700 border-b border-slate-100 pb-1">
                          <span>🌾 AI Crop Diagnosis</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Verified</span>
                        </div>
                      )}

                      {msg.image && (
                        <div className="rounded-xl overflow-hidden border border-slate-300 max-w-[220px]">
                          <img src={msg.image} alt="Submitted leaf" className="w-full h-auto object-cover max-h-[160px]" />
                        </div>
                      )}

                      <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap font-sans">
                        {msg.text}
                      </div>

                      <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 font-bold pt-1">
                        <span>{msg.time}</span>
                        {msg.sender === 'user' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-current" />}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-none p-3 max-w-[60%] shadow-sm border border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600 shrink-0" />
                      <span>AgriConnect Bot is typing...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Dummy Input Strip */}
              <div className="bg-[#f0f2f5] p-3 border-t border-slate-300 flex items-center gap-2 text-slate-500 text-xs">
                <Camera className="w-5 h-5 text-slate-600 shrink-0" />
                <div className="flex-1 bg-white border border-slate-300 rounded-full px-4 py-2 truncate text-slate-400 font-medium">
                  Use panel on left to send simulated photos...
                </div>
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow">
                  <Send className="w-4 h-4 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppDetectionGuide;
