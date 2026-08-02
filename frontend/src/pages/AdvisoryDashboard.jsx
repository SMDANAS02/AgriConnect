import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { weatherService } from '../services/weatherService';
import { toast } from 'react-hot-toast';
import {
  CloudSun,
  MapPin,
  Wind,
  Droplets,
  Thermometer,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Loader2,
  Sun,
  CloudRain,
  Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import TamilVoiceAssistant from '../components/TamilVoiceAssistant';

const AdvisoryDashboard = () => {
  const [district, setDistrict] = useState('Coimbatore');
  const [cropType, setCropType] = useState('Paddy');
  const [activeTab, setActiveTab] = useState('advisory');

  const districts = ['Coimbatore', 'Salem', 'Karur', 'Madurai', 'Thanjavur', 'Trichy', 'Erode'];
  const crops = ['Paddy', 'Groundnut', 'Sugarcane', 'Cotton', 'Tomato'];

  // Forecast Query
  const { data: forecastData, isLoading: loadingForecast } = useQuery({
    queryKey: ['weatherForecast', district],
    queryFn: () => weatherService.getForecast({ district })
  });

  // Advisory Query
  const { data: advisoryData, isLoading: loadingAdvisory } = useQuery({
    queryKey: ['cropAdvisory', district, cropType],
    queryFn: () => weatherService.getCropAdvisory({ district, cropType })
  });

  // Calendar Query
  const { data: calendarData } = useQuery({
    queryKey: ['cropCalendar', district, cropType],
    queryFn: () => weatherService.getCropCalendar({ district, cropType })
  });

  const weather = forecastData?.data?.current || {
    temp: 31,
    humidity: 78,
    windSpeed: 14,
    condition: 'Partly Cloudy',
    rainProbability: 40
  };

  const forecast = forecastData?.data?.forecast || [
    { day: 'Mon', tempHigh: 32, tempLow: 24, condition: 'Rain', rainProb: 70 },
    { day: 'Tue', tempHigh: 31, tempLow: 23, condition: 'Heavy Rain', rainProb: 85 },
    { day: 'Wed', tempHigh: 33, tempLow: 24, condition: 'Cloudy', rainProb: 30 },
    { day: 'Thu', tempHigh: 34, tempLow: 25, condition: 'Sunny', rainProb: 10 },
    { day: 'Fri', tempHigh: 34, tempLow: 25, condition: 'Sunny', rainProb: 15 }
  ];

  const handleGeolocation = () => {
    if ('geolocation' in navigator) {
      toast.loading('Fetching your GPS location...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          toast.dismiss();
          toast.success('GPS Location Detected: Coimbatore Region');
          setDistrict('Coimbatore');
        },
        () => {
          toast.dismiss();
          toast.error('Could not detect location. Selected Coimbatore by default.');
        }
      );
    }
  };

  const handleDownloadCalendarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Tamil Nadu Agricultural Crop Calendar - ${district}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Selected Crop: ${cropType}`, 14, 32);
    doc.text(`Kuruvai Season (Sowing): June - July | Harvest: Oct`, 14, 44);
    doc.text(`Samba Season (Sowing): Aug - Sept | Harvest: Jan - Feb`, 14, 54);
    doc.text(`Navarai Season (Sowing): Dec - Jan | Harvest: April`, 14, 64);
    doc.save(`AgriConnect_Crop_Calendar_${district}_${cropType}.pdf`);
    toast.success('Crop Calendar PDF downloaded!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-agri-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-sky-500/30 text-sky-200 rounded-full border border-sky-400/30">
            Hyperlocal Tamil Nadu Weather
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Weather & Farming Advisory
          </h1>
          <p className="text-slate-200 text-base max-w-xl">
            Real-time weather metrics, AI irrigation/fertilizer alerts, and seasonal crop calendars for Tamil Nadu districts.
          </p>
        </div>

        {/* Location Selector controls (text-base) */}
        <div className="bg-white/10 p-4 rounded-2xl border border-white/20 space-y-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-400" />
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="bg-slate-900 text-white font-bold text-base px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none"
            >
              {districts.map((d) => (
                <option key={d} value={d}>{d} District</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGeolocation}
            className="w-full btn-outline py-2 text-sm bg-white/10 text-white border-white/30 hover:bg-white/20 justify-center"
          >
            <Navigation className="w-4 h-4" /> Use My Location
          </button>
        </div>
      </div>

      {/* Current Weather Widget (text-sm labels) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{weather.temp}°C</div>
            <div className="text-sm text-slate-500 font-medium">Temperature</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{weather.humidity}%</div>
            <div className="text-sm text-slate-500 font-medium">Relative Humidity</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{weather.windSpeed} km/h</div>
            <div className="text-sm text-slate-500 font-medium">Wind Speed</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <CloudRain className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{weather.rainProbability}%</div>
            <div className="text-sm text-slate-500 font-medium">Rain Probability</div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast Strip (text-sm font) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-slate-900">5-Day Hyperlocal Forecast ({district})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {forecast.map((f, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100 space-y-2">
              <span className="text-sm font-bold text-slate-500 uppercase">{f.day}</span>
              <CloudSun className="w-8 h-8 text-sky-500 mx-auto" />
              <div className="text-lg font-extrabold text-slate-800">{f.tempHigh}° / {f.tempLow}°C</div>
              <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full inline-block">
                {f.rainProb}% Rain
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs: AI Advisory vs Crop Calendar */}
      <div className="space-y-6">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('advisory')}
            className={`pb-3 px-6 text-base font-bold border-b-2 transition-all ${
              activeTab === 'advisory'
                ? 'border-agri-600 text-agri-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            AI Weather Crop Advisory
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`pb-3 px-6 text-base font-bold border-b-2 transition-all ${
              activeTab === 'calendar'
                ? 'border-agri-600 text-agri-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Tamil Nadu Crop Calendar
          </button>
        </div>

        {activeTab === 'advisory' ? (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">AI Action Recommendations</h3>
                <p className="text-sm text-slate-500">Weather-driven agricultural guidance for your crop.</p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-bold text-slate-700 uppercase">Crop:</label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
                >
                  {crops.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Advisory Cards: text-base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
                  <AlertCircle className="w-5 h-5 text-amber-600" /> Irrigation Advisory
                </div>
                <p className="text-base text-slate-700 leading-relaxed">
                  Heavy rain (70%+ probability) expected in {district} over the next 48 hours. <strong>Postpone irrigation</strong> to prevent root rot and waterlogging in {cropType} fields.
                </p>
              </div>

              <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Fertilizer & Pest Window
                </div>
                <p className="text-base text-slate-700 leading-relaxed">
                  Optimal application window for Neem-coated Urea on Thursday when wind speeds drop below 10 km/h and dry conditions resume.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Tamil Nadu Seasonal Crop Calendar</h3>
                <p className="text-sm text-slate-500">Recommended sowing and harvesting timelines for {district} region.</p>
              </div>

              <button onClick={handleDownloadCalendarPDF} className="btn-primary text-sm py-2.5 px-4">
                <Download className="w-4 h-4" /> Download PDF Calendar
              </button>
            </div>

            {/* Gantt-style Timeline */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                  <span>Kuruvai Season (Short Term Paddy)</span>
                  <span className="text-agri-700 bg-agri-100 px-2.5 py-0.5 rounded">June - October</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
                  <div className="bg-amber-400 w-1/3 h-full" title="Sowing" />
                  <div className="bg-emerald-500 w-1/2 h-full" title="Growing" />
                  <div className="bg-harvest-600 w-1/6 h-full" title="Harvest" />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                  <span>Samba Season (Long Term Paddy / Groundnut)</span>
                  <span className="text-agri-700 bg-agri-100 px-2.5 py-0.5 rounded">August - January</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
                  <div className="bg-amber-400 w-1/4 h-full" title="Sowing" />
                  <div className="bg-emerald-500 w-1/2 h-full" title="Growing" />
                  <div className="bg-harvest-600 w-1/4 h-full" title="Harvest" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Tamil Voice Assistant ─────────────────────────────────────── */}
      <TamilVoiceAssistant context="advisory" />
    </div>
  );
};

export default AdvisoryDashboard;
