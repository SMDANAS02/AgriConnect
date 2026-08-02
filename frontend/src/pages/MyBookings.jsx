import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import {
  CalendarCheck,
  MapPin,
  Phone,
  XCircle,
  CheckCircle2,
  Clock,
  Loader2,
  FileText,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';

const MyBookings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch farmer bookings
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['myBookings', user?.id],
    queryFn: () => bookingService.getFarmerBookings(user?.id),
    enabled: !!user?.id
  });

  const bookings = data?.data?.bookings || data?.data || [];

  // Filter bookings based on activeTab
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') return b.bookingStatus === 'pending' || b.bookingStatus === 'confirmed';
    if (activeTab === 'completed') return b.bookingStatus === 'completed';
    if (activeTab === 'cancelled') return b.bookingStatus === 'cancelled';
    return true;
  });

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: (id) => bookingService.cancelBooking(id),
    onSuccess: () => {
      toast.success('Reservation cancelled successfully');
      queryClient.invalidateQueries(['myBookings']);
      setSelectedBooking(null);
    },
    onError: (err) => toast.error(err.message || 'Failed to cancel booking')
  });

  const handleDownloadInvoice = (b) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('AgriConnect Rental Reservation Invoice', 14, 20);
    doc.setFontSize(12);
    doc.text(`Booking Reference ID: #AC-BK-${b.id}`, 14, 32);
    doc.text(`Farmer Name: ${user?.name || 'Karthikeyan R'}`, 14, 40);
    doc.text(`Machinery: ${b.equipment?.name || 'Mahindra 575 DI Tractor'}`, 14, 48);
    doc.text(`Dates: ${dayjs(b.startDate).format('MMM D, YYYY')} to ${dayjs(b.endDate).format('MMM D, YYYY')}`, 14, 56);
    doc.text(`Status: ${b.bookingStatus.toUpperCase()}`, 14, 64);
    doc.text(`Total Amount Paid: INR ${Number(b.totalPrice).toLocaleString()}`, 14, 76);
    doc.save(`AgriConnect_Invoice_BK_${b.id}.pdf`);
    toast.success('Reservation Invoice Downloaded!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-agri-900 to-agri-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-agri-300 font-bold hover:underline mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            My Equipment Reservations
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            View your upcoming rentals, download digital tax invoices, and contact equipment owners.
          </p>
        </div>

        <Link to="/marketplace" className="btn-primary bg-harvest-600 hover:bg-harvest-700 py-3 px-5 text-sm shrink-0">
          + Book New Machinery
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200">
        {[
          { id: 'all', label: 'All Reservations' },
          { id: 'upcoming', label: 'Upcoming / Confirmed' },
          { id: 'completed', label: 'Completed' },
          { id: 'cancelled', label: 'Cancelled' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-5 text-sm font-bold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-agri-600 text-agri-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reservations List */}
      {isLoading ? (
        <div className="py-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-agri-600 mx-auto" />
          <p className="text-slate-500 text-sm mt-2 font-medium">Fetching your bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold text-slate-800">No Reservations Found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            You don't have any bookings matching this category.
          </p>
          <Link to="/marketplace" className="btn-primary inline-flex py-2 px-4 text-xs">
            Browse Equipment Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map((b) => (
            <div key={b.id} className="card-solid p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Booking #{b.id}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                      {b.equipment?.name || 'Mahindra Tractor'}
                    </h3>
                  </div>

                  <span className={`badge-status uppercase font-bold text-[10px] ${
                    b.bookingStatus === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : b.bookingStatus === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : b.bookingStatus === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {b.bookingStatus}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Dates:</span>
                    <span className="font-bold text-slate-800">
                      {dayjs(b.startDate).format('MMM D')} - {dayjs(b.endDate).format('MMM D, YYYY')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Amount Paid:</span>
                    <span className="font-black text-agri-700">₹{Number(b.totalPrice).toLocaleString()}</span>
                  </div>
                </div>

                {b.equipment?.owner && (
                  <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
                    <span>Owner: <strong>{b.equipment.owner.name}</strong></span>
                    <a
                      href={`tel:${b.equipment.owner.phone || '9876543210'}`}
                      className="text-agri-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleDownloadInvoice(b)}
                  className="btn-outline py-1.5 px-3 text-xs flex-1 justify-center"
                >
                  <FileText className="w-3.5 h-3.5 text-agri-600" /> Invoice
                </button>

                {(b.bookingStatus === 'pending' || b.bookingStatus === 'confirmed') && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this equipment reservation?')) {
                        cancelMutation.mutate(b.id);
                      }
                    }}
                    disabled={cancelMutation.isPending}
                    className="btn-outline py-1.5 px-3 text-xs text-red-600 hover:bg-red-50 flex-1 justify-center"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
