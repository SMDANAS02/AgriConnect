import React from 'react';
import { Link } from 'react-router-dom';
import { SAMPLE_IMAGES } from '../utils/sampleImages';
import {
  Sprout,
  Tractor,
  Stethoscope,
  CloudSun,
  Search,
  CheckCircle2,
  Users,
  ShieldCheck,
  Star,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

const Home = () => {
  const heroBg = SAMPLE_IMAGES.heroBg;

  const features = [
    {
      icon: Stethoscope,
      title: 'AI Plant Disease Detection',
      description: 'Upload a leaf photo to get instant 98%+ accurate disease diagnosis and organic/chemical treatment recommendations.',
      link: '/disease-detection',
      color: 'bg-emerald-500 text-white',
      badge: 'Instant Diagnosis'
    },
    {
      icon: Tractor,
      title: 'Equipment Rental Marketplace',
      description: 'Rent tractors, harvesters, solar water pumps, and transplanters directly from verified owners in your district.',
      link: '/marketplace',
      color: 'bg-harvest-600 text-white',
      badge: 'Verified Owners'
    },
    {
      icon: CloudSun,
      title: 'Hyperlocal Weather Advisory',
      description: 'Get 5-day weather forecasts and AI-powered crop action alerts tailored for Coimbatore, Salem, Karur & Madurai.',
      link: '/advisory',
      color: 'bg-sky-500 text-white',
      badge: 'Localized'
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Create Your Profile',
      desc: 'Register as a Farmer or Equipment Owner in 30 seconds.'
    },
    {
      num: '02',
      title: 'Search & Upload',
      desc: 'Browse nearby tractors or snap a leaf photo for AI analysis.'
    },
    {
      num: '03',
      title: 'Book or Get Advisory',
      desc: 'Reserve equipment with transparent daily rates & instant confirmation.'
    },
    {
      num: '04',
      title: 'Harvest & Review',
      desc: 'Complete farming tasks efficiently and share ratings with the community.'
    }
  ];

  const stats = [
    { label: 'Active Farmers', value: '12,500+', icon: Users },
    { label: 'Equipment Listed', value: '2,800+', icon: Tractor },
    { label: 'Leaf Diseases Diagnosed', value: '45,000+', icon: Stethoscope },
    { label: 'Districts Covered', value: '38 (Tamil Nadu)', icon: ShieldCheck }
  ];

  const testimonials = [
    {
      name: 'Muthusamy K',
      role: 'Paddy Farmer, Salem',
      comment: 'Renting the Mahindra tractor via AgriConnect saved me ₹15,000 in labor costs during the Samba harvest season!',
      rating: 5,
      avatar: 'M'
    },
    {
      name: 'Ramasamy M',
      role: 'Groundnut Cultivator, Madurai',
      comment: 'The AI disease diagnosis caught Tikka leaf spot early on my groundnut crop. The suggested treatment saved my entire yield!',
      rating: 5,
      avatar: 'R'
    },
    {
      name: 'Selvakumar V',
      role: 'Equipment Owner, Karur',
      comment: 'I listed my Kubota paddy transplanter on AgriConnect. It now runs 25 days a month, providing a steady monthly income!',
      rating: 5,
      avatar: 'S'
    }
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section with Unsplash Background */}
      <section className="relative rounded-3xl overflow-hidden shadow-2xl mx-4 sm:mx-6 lg:mx-8 mt-6">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-agri-950/90 to-slate-900/80" />

        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-500/20 text-agri-300 text-sm font-bold uppercase tracking-wider border border-agri-400/30">
              <Award className="w-4 h-4 text-harvest-500" />
              Smart Farming for Modern India
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Empowering Farmers with <span className="text-agri-400">AI & Machinery</span>
            </h1>

            <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Detect crop diseases instantly with AI leaf photos, rent nearby tractors at affordable daily rates, and get weather-driven farming advisories for Tamil Nadu districts.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/marketplace"
                className="w-full sm:w-auto btn-primary py-3.5 px-6 text-base bg-harvest-600 hover:bg-harvest-700 shadow-lg shadow-harvest-600/30"
              >
                <Tractor className="w-5 h-5" />
                Explore Equipment Marketplace
              </Link>

              <Link
                to="/disease-detection"
                className="w-full sm:w-auto btn-outline py-3.5 px-6 text-base bg-white/10 hover:bg-white/20 text-white border-white/30"
              >
                <Stethoscope className="w-5 h-5" />
                Try AI Disease Detection
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-700/60 grid grid-cols-3 gap-4 text-sm font-medium text-slate-200">
              <div className="flex items-center justify-center lg:justify-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-agri-400" />
                <span>Zero Commission</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-agri-400" />
                <span>Instant Diagnosis</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-agri-400" />
                <span>Verified Owners</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-3xl p-6 text-slate-900 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-agri-700 bg-agri-100 px-2.5 py-1 rounded-lg">
                  AI Diagnosis Demo
                </span>
                <span className="text-xs text-slate-400 font-semibold">Live Preview</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden h-48 bg-slate-100">
                <img
                  src={SAMPLE_IMAGES.healthyLeaf}
                  alt="Paddy Leaf Demo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?w=400&auto=compress&cs=tinysrgb';
                  }}
                />
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 text-white p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-emerald-400">Paddy Blast Detected</p>
                    <p className="text-[11px] text-slate-300">Confidence: 94.5%</p>
                  </div>
                  <Link
                    to="/disease-detection"
                    className="bg-agri-600 hover:bg-agri-700 text-white px-3 py-1.5 rounded-lg font-bold"
                  >
                    Diagnose Mine
                  </Link>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-medium text-slate-600">Treatment</span>
                  <span className="font-bold text-slate-900">Tricyclazole 75% WP</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-medium text-slate-600">Location</span>
                  <span className="font-bold text-slate-900">Thanjavur Delta</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Feature descriptions: text-base) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Comprehensive Smart Farming Services
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base">
            Everything an Indian smallholder farmer needs to maximize crop yield, reduce equipment cost, and stay ahead of weather risks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="card-solid p-6 flex flex-col justify-between space-y-6 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 text-base leading-relaxed">{feature.description}</p>
                </div>

                <Link
                  to={feature.link}
                  className="btn-outline justify-between text-slate-800 hover:text-agri-700 hover:border-agri-300 text-base"
                >
                  <span>Explore Feature</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-100/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">How AgriConnect Works</h2>
            <p className="text-slate-600 text-base max-w-xl mx-auto">
              Simple 4-step workflow designed for easy access on any smartphone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
                <div className="text-4xl font-black text-agri-600/30 mb-2">{step.num}</div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter (Numbers: text-3xl font-bold) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-agri-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center space-y-2">
                <div className="w-10 h-10 bg-agri-800 rounded-xl flex items-center justify-center mx-auto text-agri-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-300 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials (Comments: text-base italic) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Farmer Success Stories</h2>
          <p className="text-slate-600 text-base">Hear from real farmers across Tamil Nadu districts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="card-solid p-6 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: t.rating }).map((_, r) => (
                  <Star key={r} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-base italic leading-relaxed">"{t.comment}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-agri-600 text-white font-bold flex items-center justify-center text-base">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{t.name}</h4>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
