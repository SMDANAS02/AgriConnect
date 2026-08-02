import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { equipmentService } from '../services/equipmentService';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { DEFAULT_EQUIPMENT_IMAGES } from '../utils/sampleImages';
import {
  Tractor,
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  Clock,
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Share2
} from 'lucide-react';
import dayjs from 'dayjs';

const EquipmentDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeImage, setActiveImage] = useState(0);
  const [startDate, setStartDate] = useState(dayjs().add(1, 'day').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().add(3, 'day').format('YYYY-MM-DD'));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Equipment Detail
  const { data, isLoading, isError } = useQuery({
    queryKey: ['equipmentDetail', id],
    queryFn: () => equipmentService.getEquipmentById(id)
  });

  const equipment = data?.data?.equipment || data?.data;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-agri-600 animate-spin" />
        <p className="text-slate-600 font-semibold text-base">Loading machinery details...</p>
      </div>
    );
  }

  if (isError || !equipment) {
    return (
      <div className="max-w-md mx-auto my-12 text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800">Machinery Not Found</h2>
        <p className="text-slate-500 text-sm">The equipment listing you are looking for is unavailable.</p>
        <Link to="/marketplace" className="btn-primary inline-flex text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
      </div>
    );
  }

  const categoryFallback = DEFAULT_EQUIPMENT_IMAGES[equipment.category] || DEFAULT_EQUIPMENT_IMAGES.default;
  const images = equipment.images && equipment.images.length > 0 ? equipment.images : [categoryFallback];

  // Calculate rental cost
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const rentalDays = Math.max(1, end.diff(start, 'day'));
  const baseCost = rentalDays * Number(equipment.pricePerDay || 0);
  const serviceFee = Math.round(baseCost * 0.05); // 5% platform service fee
  const totalAmount = baseCost + serviceFee;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to reserve equipment');
      navigate('/login', { state: { from: { pathname: `/marketplace/${id}` } } });
      return;
    }

    if (end.isBefore(start) || end.isSame(start)) {
      toast.error('End date must be after start date');
      return;
    }

    setIsSubmitting(true);
    try {
      await bookingService.createBooking({
        equipmentId: Number(id),
        startDate: start.toISOString(),
        endDate: end.toISOString()
      });

      toast.success('Equipment Booking Reserved Successfully! 🎉');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.message || 'Failed to complete reservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-agri-700">
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery & Specs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Image */}
          <div className="card-solid overflow-hidden rounded-3xl relative h-80 sm:h-96 bg-slate-100">
            <img
              src={images[activeImage] || categoryFallback}
              alt={equipment.name || 'Agricultural Equipment'}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = categoryFallback;
              }}
            />
            <span className="absolute top-4 left-4 bg-slate-900/90 text-white font-bold text-sm uppercase px-3.5 py-1.5 rounded-xl">
              {equipment.category}
            </span>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === idx ? 'border-agri-600 ring-2 ring-agri-100' : 'border-slate-200 opacity-60'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${equipment.name || 'Equipment'} thumbnail ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = categoryFallback;
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Details */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-6 shadow-sm">
            <div>
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{equipment.name}</h1>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied to clipboard!');
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 text-sm font-semibold text-slate-500 mt-2">
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {equipment.rating ? Number(equipment.rating).toFixed(1) : '4.8'} (14 Reviews)
                </span>
                {equipment.owner?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-agri-600" />
                    {equipment.owner.location}
                  </span>
                )}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900 uppercase tracking-wider">Description & Features</h3>
              <p className="text-slate-600 text-base leading-relaxed">
                {equipment.description || 'Heavy-duty agricultural machinery suitable for soil preparation, sowing, and harvest seasons in Tamil Nadu fields.'}
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="bg-slate-50 rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-slate-500 block font-medium">Category</span>
                <span className="font-bold text-slate-800">{equipment.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Availability</span>
                <span className="font-bold text-emerald-600">Available Now</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Daily Rate</span>
                <span className="font-bold text-slate-800">₹{Number(equipment.pricePerDay).toLocaleString()} / day</span>
              </div>
            </div>

            {/* Owner Details */}
            {equipment.owner && (
              <div className="bg-agri-50/80 rounded-2xl p-5 border border-agri-200/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-agri-600 text-white rounded-xl font-bold flex items-center justify-center text-lg shadow-sm">
                    {equipment.owner.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{equipment.owner.name}</h4>
                    <p className="text-sm text-slate-500">Verified Equipment Owner • {equipment.owner.location || 'Salem'}</p>
                  </div>
                </div>

                <a
                  href={`tel:${equipment.owner.phone || '9876543210'}`}
                  className="btn-outline py-2.5 px-4 text-sm bg-white hover:bg-agri-100"
                >
                  <Phone className="w-4 h-4 text-agri-600" /> Call Owner
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Booking Calculator Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 sticky top-24">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-agri-700">₹{Number(equipment.pricePerDay).toLocaleString()}</span>
                <span className="text-sm text-slate-500 font-medium"> / day</span>
              </div>
              <span className="badge-status bg-emerald-100 text-emerald-800 text-sm font-bold">
                Instant Confirmation
              </span>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Start & End Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    min={dayjs().format('YYYY-MM-DD')}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-agri-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-agri-500"
                  />
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-sm border border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>₹{Number(equipment.pricePerDay).toLocaleString()} × {rentalDays} {rentalDays === 1 ? 'day' : 'days'}</span>
                  <span className="font-semibold text-slate-800">₹{baseCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform Fee (5%)</span>
                  <span className="font-semibold text-slate-800">₹{serviceFee.toLocaleString()}</span>
                </div>
                <hr className="border-slate-200" />
                <div className="flex justify-between text-base font-extrabold text-slate-900">
                  <span>Total Payable</span>
                  <span className="text-agri-700 text-2xl font-bold">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3.5 text-base justify-center shadow-lg shadow-agri-600/30"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Reserving...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5" /> Reserve Machinery Now
                  </>
                )}
              </button>
            </form>

            {/* Guarantee */}
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium justify-center pt-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Direct Owner Pay • 100% Refundable Cancellation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;
