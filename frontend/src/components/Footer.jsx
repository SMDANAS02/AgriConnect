import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Phone, Mail, MapPin, Send, ShieldCheck, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Thank you for subscribing to AgriConnect Farmers Newsletter! 🌾');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-agri-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Agri<span className="text-agri-500">Connect</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering smallholder farmers across Tamil Nadu with AI-powered crop diagnosis, peer-to-peer equipment rentals, and real-time weather advisory services.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-agri-400 bg-agri-950/60 p-2.5 rounded-lg border border-agri-800/40">
              <ShieldCheck className="w-4 h-4" />
              Built for Tamil Nadu Agriculture & Farmers
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white uppercase tracking-wider text-xs">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/marketplace" className="hover:text-agri-400 transition-colors">
                  Equipment Rental Marketplace
                </Link>
              </li>
              <li>
                <Link to="/disease-detection" className="hover:text-agri-400 transition-colors">
                  AI Plant Disease Diagnosis
                </Link>
              </li>
              <li>
                <Link to="/advisory" className="hover:text-agri-400 transition-colors">
                  Weather Advisory Dashboard
                </Link>
              </li>
              <li>
                <Link to="/advisory?tab=calendar" className="hover:text-agri-400 transition-colors">
                  Tamil Nadu Crop Calendar
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-agri-400 transition-colors">
                  Manage My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white uppercase tracking-wider text-xs">
              Farmer Helpline & Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-agri-500 shrink-0 mt-0.5" />
                <span>Agricultural Hub, Coimbatore & Salem, Tamil Nadu - 641003</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-agri-500 shrink-0" />
                <span className="font-semibold text-white">+91 1800-425-AGRI (Free Helpline)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-agri-500 shrink-0" />
                <span>support@agriconnect.tn</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white uppercase tracking-wider text-xs">
              Weekly Farming Tips
            </h4>
            <p className="text-xs text-slate-400">
              Subscribe for regional crop advisories, pest outbreak alerts, and rental discounts.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-agri-500"
                />
              </div>
              <button
                type="submit"
                className="w-full btn-primary text-xs justify-center py-2.5"
              >
                <Send className="w-3.5 h-3.5" />
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AgriConnect Platform. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>for Indian Farmers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
