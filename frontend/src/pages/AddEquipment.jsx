import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { equipmentService } from '../services/equipmentService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import {
  Tractor,
  DollarSign,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  ArrowLeft,
  Loader2
} from 'lucide-react';

const AddEquipment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Tractor', 'Transplanter', 'Harvester', 'Irrigation', 'Cultivator', 'Sprayer'];
  const districts = ['Coimbatore', 'Salem', 'Karur', 'Madurai', 'Thanjavur', 'Trichy', 'Erode'];

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      category: 'Tractor',
      pricePerDay: 3000,
      pricePerHour: 500,
      availabilityStatus: 'available',
      imageUrl: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?auto=format&fit=crop&q=80&w=800'
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        category: data.category,
        description: data.description,
        pricePerDay: Number(data.pricePerDay),
        pricePerHour: Number(data.pricePerHour),
        availabilityStatus: 'available',
        images: [data.imageUrl]
      };

      await equipmentService.createEquipment(payload);
      toast.success('Equipment Listed Successfully on AgriConnect! 🚜');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to list equipment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-agri-700">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
        <div className="border-b border-slate-100 pb-6 space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-harvest-600 bg-harvest-50 px-3 py-1 rounded-full mb-1">
            <Tractor className="w-4 h-4" /> Equipment Owner Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            List Your Machinery for Rental
          </h1>
          <p className="text-slate-500 text-sm">
            Provide equipment details and pricing to start receiving rental requests from nearby farmers.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Basic Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-800 tracking-wider">
              1. Basic Machinery Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Equipment Title / Name
              </label>
              <input
                type="text"
                {...register('name', { required: 'Equipment name is required' })}
                placeholder="e.g. Mahindra 575 DI Tractor (45 HP, 4WD)"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-agri-500"
              />
              {errors.name && <p className="text-xs text-red-500 font-medium mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category
                </label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-agri-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Primary Location District
                </label>
                <select
                  {...register('location')}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-agri-500"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Description & Technical Specs
              </label>
              <textarea
                rows={3}
                {...register('description', { required: 'Description is required' })}
                placeholder="Describe horsepower, attachments included, ideal crop types, and condition..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-agri-500"
              />
              {errors.description && <p className="text-xs text-red-500 font-medium mt-1">{errors.description.message}</p>}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Pricing */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-800 tracking-wider">
              2. Rental Rates (INR ₹)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Price Per Day (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                    ₹
                  </div>
                  <input
                    type="number"
                    {...register('pricePerDay', { required: 'Daily rate is required', min: 100 })}
                    placeholder="3000"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-agri-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Price Per Hour (Optional) (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                    ₹
                  </div>
                  <input
                    type="number"
                    {...register('pricePerHour')}
                    placeholder="500"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-agri-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Image URL */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-800 tracking-wider">
              3. Machinery Photo
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Image URL (Unsplash or Cloudinary)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  {...register('imageUrl', { required: 'Image URL is required' })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-agri-500"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link to="/dashboard" className="btn-outline text-xs py-3 px-5">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary bg-harvest-600 hover:bg-harvest-700 text-sm py-3 px-6 shadow-lg shadow-harvest-600/30"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Publishing...
                </>
              ) : (
                'Publish Machinery Listing'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEquipment;
