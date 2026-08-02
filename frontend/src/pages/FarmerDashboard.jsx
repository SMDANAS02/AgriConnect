import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import {
  Tractor,
  CalendarCheck,
  Stethoscope,
  CloudSun,
  Plus,
  ArrowRight,
  Loader2,
  Clock
} from 'lucide-react';
import dayjs from 'dayjs';

const FarmerDashboard = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['farmerBookings', user?.id],
    queryFn: () => bookingService.getFarmerBookings(user?.id),
    enabled: !!user?.id
  });

  const bookings = data?.data?.bookings || data?.data || [];
  const activeBookingsCount = bookings.filter((b) => b.bookingStatus === 'confirmed' || b.bookingStatus === 'pending').length;
  const totalSpent = bookings.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-agri-900 to-agri-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-agri-700/80 rounded-full inline-block text-agri-200">
            Farmer Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Welcome back, {user?.name || 'Farmer'}! 🌾
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Track your machinery rentals, AI crop disease diagnoses, and hyperlocal weather advisories.
          </p>
        </div>

        <Link to="/marketplace" className="btn-primary bg-harvest-600 hover:bg-harvest-700 py-3 px-5 text-sm shrink-0">
          <Tractor className="w-4 h-4" /> Rent Equipment Now
        </Link>
      </div>

      {/* Stats Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-agri-100 text-agri-700 flex items-center justify-center font-bold">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{activeBookingsCount}</div>
            <div className="text-xs text-slate-500 font-medium">Active Bookings</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-harvest-100 text-harvest-700 flex items-center justify-center font-bold">
            <Tractor className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">₹{totalSpent.toLocaleString()}</div>
            <div className="text-xs text-slate-500 font-medium">Total Rental Spend</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">12</div>
            <div className="text-xs text-slate-500 font-medium">AI Diseases Analyzed</div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/marketplace" className="card-solid p-5 flex items-center justify-between hover:-translate-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-agri-600 text-white flex items-center justify-center">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Browse Marketplace</h4>
              <p className="text-xs text-slate-500">Rent tractors & pumps</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link to="/disease-detection" className="card-solid p-5 flex items-center justify-between hover:-translate-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">AI Plant Diagnosis</h4>
              <p className="text-xs text-slate-500">Snap leaf photo</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link to="/advisory" className="card-solid p-5 flex items-center justify-between hover:-translate-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Weather Advisory</h4>
              <p className="text-xs text-slate-500">5-day Tamil Nadu forecast</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>
      </div>

      {/* Recent Bookings List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">My Recent Equipment Reservations</h3>
          <Link to="/my-bookings" className="text-xs font-bold text-agri-700 hover:underline">
            View All ({bookings.length})
          </Link>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-agri-600" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100">
            <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No active bookings yet</p>
            <p className="text-xs text-slate-500 mb-3">Browse nearby machinery in the marketplace to reserve.</p>
            <Link to="/marketplace" className="btn-primary py-2 px-4 text-xs inline-flex">
              Explore Equipment
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {bookings.slice(0, 3).map((b) => (
              <div key={b.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                    <img
                      src={b.equipment?.images?.[0] || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?auto=format&fit=crop&q=80&w=800'}
                      alt="Equipment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{b.equipment?.name || 'Mahindra Tractor'}</h4>
                    <p className="text-xs text-slate-500">
                      {dayjs(b.startDate).format('MMM D')} - {dayjs(b.endDate).format('MMM D, YYYY')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-sm font-black text-agri-700">₹{Number(b.totalPrice).toLocaleString()}</span>
                  <span className={`badge-status uppercase font-bold text-[10px] ${
                    b.bookingStatus === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : b.bookingStatus === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {b.bookingStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
