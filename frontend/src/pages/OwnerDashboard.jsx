import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { equipmentService } from '../services/equipmentService';
import { toast } from 'react-hot-toast';
import {
  Tractor,
  DollarSign,
  Star,
  Check,
  X,
  PlusCircle,
  Clock,
  Loader2,
  Phone,
  Calendar
} from 'lucide-react';
import dayjs from 'dayjs';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch owner bookings
  const { data: bookingsData, isLoading: loadingBookings } = useQuery({
    queryKey: ['ownerBookings', user?.id],
    queryFn: () => bookingService.getOwnerBookings(user?.id),
    enabled: !!user?.id
  });

  // Fetch owner equipment fleet
  const { data: fleetData, isLoading: loadingFleet } = useQuery({
    queryKey: ['ownerFleet', user?.id],
    queryFn: () => equipmentService.getAllEquipment({ ownerId: user?.id })
  });

  const bookings = bookingsData?.data?.bookings || bookingsData?.data || [];
  const fleet = fleetData?.data?.equipment || fleetData?.data || [];

  const pendingRequests = bookings.filter((b) => b.bookingStatus === 'pending');
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'confirmed');
  const totalEarnings = bookings
    .filter((b) => b.bookingStatus === 'confirmed' || b.bookingStatus === 'completed')
    .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);

  // Confirm booking mutation
  const confirmMutation = useMutation({
    mutationFn: (id) => bookingService.confirmBooking(id),
    onSuccess: () => {
      toast.success('Rental Request Confirmed! 🚜');
      queryClient.invalidateQueries(['ownerBookings']);
    },
    onError: (err) => toast.error(err.message || 'Failed to confirm booking')
  });

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: (id) => bookingService.cancelBooking(id),
    onSuccess: () => {
      toast.success('Booking Request Rejected');
      queryClient.invalidateQueries(['ownerBookings']);
    },
    onError: (err) => toast.error(err.message || 'Failed to reject booking')
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-harvest-700 via-agri-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-harvest-600/80 rounded-full inline-block text-harvest-100">
            Equipment Owner Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Owner Dashboard ({user?.name})
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Manage your machinery listings, respond to farmer rental requests, and view monthly earnings.
          </p>
        </div>

        <Link to="/add-equipment" className="btn-primary bg-harvest-600 hover:bg-harvest-700 py-3 px-5 text-sm shrink-0">
          <PlusCircle className="w-4 h-4" /> List New Equipment
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-harvest-100 text-harvest-700 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">₹{totalEarnings.toLocaleString()}</div>
            <div className="text-xs text-slate-500 font-medium">Total Rental Income</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-agri-100 text-agri-700 flex items-center justify-center font-bold">
            <Tractor className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{fleet.length || 2}</div>
            <div className="text-xs text-slate-500 font-medium">Active Machinery Listings</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">4.9 / 5</div>
            <div className="text-xs text-slate-500 font-medium">Average Farmer Rating</div>
          </div>
        </div>
      </div>

      {/* Pending Rental Requests */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Pending Farmer Booking Requests ({pendingRequests.length})
          </h3>
        </div>

        {loadingBookings ? (
          <div className="py-8 text-center text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-agri-600" />
          </div>
        ) : pendingRequests.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm font-bold text-slate-700">No pending rental requests</p>
            <p className="text-xs text-slate-500">New requests from nearby farmers will appear here for confirmation.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((req) => (
              <div key={req.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900">{req.equipment?.name || 'Tractor'}</h4>
                    <span className="text-xs font-bold px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                      Pending Approval
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Farmer: <strong className="text-slate-800">{req.farmer?.name || 'Karthikeyan R'}</strong> ({req.farmer?.phone || '9876543210'})
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-agri-600" />
                      {dayjs(req.startDate).format('MMM D')} - {dayjs(req.endDate).format('MMM D, YYYY')}
                    </span>
                    <span>•</span>
                    <span className="font-extrabold text-agri-700">Total: ₹{Number(req.totalPrice).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => confirmMutation.mutate(req.id)}
                    disabled={confirmMutation.isPending}
                    className="btn-primary text-xs py-2 px-4 flex-1 sm:flex-none justify-center"
                  >
                    <Check className="w-4 h-4" /> Confirm
                  </button>
                  <button
                    onClick={() => cancelMutation.mutate(req.id)}
                    disabled={cancelMutation.isPending}
                    className="btn-outline text-xs text-red-600 hover:bg-red-50 py-2 px-4 flex-1 sm:flex-none justify-center"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Equipment Fleet List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">My Listed Machinery Fleet</h3>
          <Link to="/add-equipment" className="text-xs font-bold text-harvest-600 hover:underline">
            + Add New Listing
          </Link>
        </div>

        {loadingFleet ? (
          <div className="py-8 text-center text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-agri-600" />
          </div>
        ) : fleet.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl">
            <Tractor className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No machinery listed yet</p>
            <Link to="/add-equipment" className="btn-primary py-2 px-4 text-xs inline-flex mt-3">
              List Your Machinery Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fleet.map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50">
                <div className="h-32 rounded-xl overflow-hidden bg-slate-200">
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?auto=format&fit=crop&q=80&w=800'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="font-extrabold text-agri-700">₹{Number(item.pricePerDay).toLocaleString()} / day</span>
                    <span className="badge-status bg-emerald-100 text-emerald-800">Available</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
