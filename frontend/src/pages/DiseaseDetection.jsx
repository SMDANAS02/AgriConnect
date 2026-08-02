import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { diseaseService } from '../services/diseaseService';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import { SAMPLE_IMAGES } from '../utils/sampleImages';
import TamilVoiceAssistant from '../components/TamilVoiceAssistant';
import WhatsAppDetectionGuide from '../components/WhatsAppDetectionGuide';
import {
  Stethoscope,
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Share2,
  History,
  RotateCcw,
  Sparkles,
  Loader2,
  ShieldAlert,
  Sprout,
  Image as ImageIcon
} from 'lucide-react';

const DiseaseDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cropName, setCropName] = useState('Paddy / Rice');
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const crops = ['Paddy / Rice', 'Tomato', 'Cotton', 'Sugarcane', 'Groundnut', 'Maize', 'Chilli'];

  // History query
  const { data: historyData, refetch: refetchHistory } = useQuery({
    queryKey: ['diseaseHistory'],
    queryFn: () => diseaseService.getDetectionHistory(),
    enabled: showHistory
  });

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 1
  });

  const handleSelectSample = (sampleUrl, sampleType) => {
    setSelectedFile(null);
    setPreviewUrl(sampleUrl);
    setResult(null);
    toast.success(`Selected ${sampleType} leaf sample!`);
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !previewUrl) {
      toast.error('Please upload or capture a leaf photo first!');
      return;
    }

    setAnalyzing(true);
    setProgress(15);

    // Simulate analysis progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          return 90;
        }
        return prev + 25;
      });
    }, 400);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (previewUrl) {
        formData.append('imageUrl', previewUrl);
      }
      formData.append('cropName', cropName);

      const response = await diseaseService.detectDisease(formData);
      clearInterval(timer);
      setProgress(100);

      setTimeout(() => {
        setResult(response.data || response);
        setAnalyzing(false);
        toast.success('Crop Disease Diagnosis Complete! 🌿');
        if (showHistory) refetchHistory();
      }, 500);
    } catch (err) {
      clearInterval(timer);
      setAnalyzing(false);
      toast.error(err.message || 'AI Diagnosis failed. Please retry.');
    }
  };

  const handleExportPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('AgriConnect AI Disease Diagnosis Report', 14, 20);
    doc.setFontSize(12);
    doc.text(`Crop: ${cropName}`, 14, 32);
    doc.text(`Diagnosis: ${result.diseaseName || 'Paddy Blast (Pyricularia oryzae)'}`, 14, 40);
    doc.text(`Confidence Score: ${result.confidenceScore || '94.5%'}`, 14, 48);
    doc.text(`Recommended Treatment: ${result.treatment || 'Apply Tricyclazole 75% WP @ 0.6g/L water.'}`, 14, 60);
    doc.text(`Preventive Advice: ${result.prevention || 'Maintain proper field drainage and avoid excessive nitrogen fertilizer.'}`, 14, 72);
    doc.save(`AgriConnect_Diagnosis_${cropName.replace(/\s+/g, '_')}.pdf`);
    toast.success('Diagnosis PDF Report downloaded!');
  };

  const handleWhatsAppShare = () => {
    if (!result) return;
    const text = `🌾 *AgriConnect AI Disease Report*\n*Crop:* ${cropName}\n*Disease:* ${result.diseaseName || 'Paddy Blast'}\n*Treatment:* ${result.treatment}\nGet instant AI diagnosis at https://agriconnect.tn`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-agri-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/30 text-emerald-200 text-sm font-bold rounded-full border border-emerald-400/30">
            <Sparkles className="w-4 h-4" /> Powered by Computer Vision AI
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            AI Crop Disease Detection
          </h1>
          <p className="text-slate-200 text-base max-w-xl">
            Upload leaf photos of your crops to diagnose bacterial, fungal, or viral infections instantly with treatment guidelines.
          </p>
        </div>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="btn-outline bg-white/10 hover:bg-white/20 text-white border-white/30 text-sm py-2.5 px-4"
        >
          <History className="w-4 h-4" />
          {showHistory ? 'Hide History' : 'View Diagnosis History'}
        </button>
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload & Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            {/* Crop Selector */}
            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                Select Crop Type
              </label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-medium focus:outline-none focus:border-agri-500"
              >
                {crops.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Dropzone */}
            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                Upload or Snap Leaf Photo
              </label>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-agri-600 bg-agri-50'
                    : 'border-slate-300 hover:border-agri-500 bg-slate-50'
                }`}
              >
                <input {...getInputProps()} />
                {previewUrl ? (
                  <div className="space-y-3">
                    <img
                      src={previewUrl}
                      alt="Crop Leaf Preview"
                      className="max-h-56 mx-auto rounded-2xl object-cover shadow-md border border-slate-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?w=400&auto=compress&cs=tinysrgb';
                      }}
                    />
                    <p className="text-xs text-slate-500 font-semibold">Click or drag to change image</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-14 h-14 bg-agri-100 text-agri-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-800">
                        Drag & Drop crop leaf image here
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG (Max 5MB)</p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
                      <Camera className="w-4 h-4 text-agri-600" />
                      Take Photo on Mobile
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Demo Sample Leaf Selectors */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-500 uppercase">
                Or Try Sample Leaf Photos:
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectSample(SAMPLE_IMAGES.healthyLeaf, 'Healthy')}
                  className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Healthy Leaf
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample(SAMPLE_IMAGES.diseasedLeaf, 'Diseased')}
                  className="flex-1 py-2 px-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4 text-red-600" /> Diseased Leaf
                </button>
              </div>
            </div>

            {/* Analyze Action */}
            <button
              onClick={handleAnalyze}
              disabled={analyzing || (!selectedFile && !previewUrl)}
              className="w-full btn-primary py-3.5 text-base justify-center shadow-lg shadow-agri-600/30"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Leaf Patterns...
                </>
              ) : (
                <>
                  <Stethoscope className="w-5 h-5" />
                  Analyze Crop Disease Now
                </>
              )}
            </button>

            {/* Progress Bar */}
            {analyzing && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>AI Computer Vision Pipeline</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-agri-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="badge-status bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
                    Diagnosis Complete
                  </span>
                  {/* Disease Name: text-xl font-bold */}
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {result.diseaseName || 'Paddy Blast (Pyricularia oryzae)'}
                  </h2>
                </div>

                {/* Confidence score: text-sm */}
                <div className="text-right">
                  <span className="text-2xl font-black text-agri-700">{result.confidenceScore || '94.5%'}</span>
                  <span className="block text-sm uppercase font-bold text-slate-400">AI Confidence</span>
                </div>
              </div>

              {/* Symptoms: text-base */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  Observed Symptoms
                </h4>
                <p className="text-base text-slate-600 bg-amber-50/60 p-4 rounded-xl border border-amber-200/50 leading-relaxed">
                  {result.symptoms || 'Spindle-shaped spots with gray centers on leaf blades. Lesions enlarge causing drying of leaves and neck rot.'}
                </p>
              </div>

              {/* Treatment Step-by-Step: text-base */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Recommended Treatment Plan
                </h4>
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/60 space-y-2 text-base text-slate-700">
                  <p className="font-semibold text-emerald-900">
                    {result.treatment || 'Spray Tricyclazole 75% WP @ 0.6 g/litre or Isoprothiolane 40% EC @ 1.5 ml/litre of water immediately.'}
                  </p>
                  <p className="text-slate-600 text-sm">
                    Apply during early morning or late evening for maximum absorption.
                  </p>
                </div>
              </div>

              {/* Preventive Action */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase text-slate-700 tracking-wider">
                  Preventive Measures for Next Season
                </h4>
                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1.5 bg-slate-50 p-4 rounded-xl">
                  <li>Use disease-resistant seeds like CO-51 or ADT-43.</li>
                  <li>Avoid excessive application of Nitrogen fertilizers.</li>
                  <li>Maintain 5cm standing water in paddy fields.</li>
                </ul>
              </div>

              {/* Actions: Export PDF & WhatsApp Share */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={handleExportPDF} className="btn-outline text-sm justify-center py-2.5">
                  <FileText className="w-4 h-4 text-agri-600" /> Download PDF Report
                </button>
                <button onClick={handleWhatsAppShare} className="btn-primary text-sm justify-center py-2.5 bg-emerald-600 hover:bg-emerald-700">
                  <Share2 className="w-4 h-4" /> Share via WhatsApp
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-4 min-h-[350px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Sprout className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Awaiting Crop Leaf Image</h3>
              <p className="text-slate-500 text-base max-w-sm">
                Upload or capture a clear photo of your crop leaf on the left to receive instant diagnostic results.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── WhatsApp Disease Detection Guide & Live Simulator ───────── */}
      <WhatsAppDetectionGuide />

      {/* ── Tamil Voice Assistant ─────────────────────────────────────── */}
      <TamilVoiceAssistant context="disease" />
    </div>
  );
};

export default DiseaseDetection;
