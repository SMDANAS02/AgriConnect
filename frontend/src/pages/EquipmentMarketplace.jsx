import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { equipmentService } from '../services/equipmentService';
import EquipmentCard from '../components/EquipmentCard';
import { EquipmentSkeleton } from '../components/LoadingSkeleton';
import { Search, Filter, MapPin, SlidersHorizontal, RotateCcw, Tractor, ArrowLeft, ArrowRight } from 'lucide-react';

const EquipmentMarketplace = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [page, setPage] = useState(1);

  const categories = ['All', 'Tractor', 'Transplanter', 'Harvester', 'Irrigation', 'Cultivator'];
  const districts = ['All Locations', 'Coimbatore', 'Salem', 'Karur', 'Madurai', 'Thanjavur'];

  // React Query Fetching
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['equipment', { search, category, location, maxPrice, page }],
    queryFn: async () => {
      const params = {
        search: search || undefined,
        category: category === 'All' ? undefined : category || undefined,
        location: location === 'All Locations' ? undefined : location || undefined,
        maxPrice: maxPrice < 10000 ? maxPrice : undefined,
        page,
        limit: 6
      };
      return equipmentService.getAllEquipment(params);
    },
    placeholderData: (previousData) => previousData
  });

  const equipmentList = data?.data?.equipment || [];
  const pagination = data?.data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setLocation('');
    setMaxPrice(10000);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-agri-900 to-agri-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-harvest-600 rounded-full inline-block">
            Verified Machinery Rentals
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Farm Equipment Marketplace
          </h1>
          <p className="text-slate-300 text-base max-w-xl">
            Rent high-performance tractors, transplanters, and harvesters directly from verified equipment owners across Tamil Nadu.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/20 text-center sm:text-left">
          <Tractor className="w-10 h-10 text-agri-400 shrink-0" />
          <div>
            <div className="text-2xl font-black text-white">{pagination.totalItems || 5}+</div>
            <div className="text-sm text-slate-300">Machineries Available</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword Search (Filter labels: text-sm font-medium, Inputs: text-base) */}
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 uppercase mb-1">
              Search Machinery
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Tractor, Transplanter..."
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-medium focus:outline-none focus:border-agri-500"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-700 uppercase mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-medium focus:outline-none focus:border-agri-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* District Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 uppercase mb-1">
              District Location
            </label>
            <select
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-medium focus:outline-none focus:border-agri-500"
            >
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Price Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700 uppercase">
                Max Daily Rate
              </label>
              <span className="text-sm font-bold text-agri-700">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-agri-600 cursor-pointer mt-2"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Grid Results */}
      {isLoading ? (
        <EquipmentSkeleton count={6} />
      ) : isError ? (
        <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200 p-6">
          <p className="text-red-700 font-bold text-base">Failed to load marketplace listings.</p>
          <button onClick={() => refetch()} className="btn-primary mt-3 text-sm">
            Retry Connection
          </button>
        </div>
      ) : equipmentList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Tractor className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No Equipment Listings Found</h3>
          <p className="text-slate-500 text-base max-w-md mx-auto">
            We couldn't find any agricultural equipment matching your search filters. Try resetting filters or choosing another district.
          </p>
          <button onClick={handleResetFilters} className="btn-primary py-2.5 px-5 text-sm">
            Clear Search Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipmentList.map((eq) => (
              <EquipmentCard key={eq.id} equipment={eq} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <span className="text-sm font-semibold text-slate-600">
                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} total)
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="btn-outline text-sm py-2 px-3.5 disabled:opacity-40"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="btn-outline text-sm py-2 px-3.5 disabled:opacity-40"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EquipmentMarketplace;
