import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  UserCheck,
  Tractor,
  Loader2
} from 'lucide-react';

const Register = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const districts = ['Coimbatore', 'Salem', 'Karur', 'Madurai', 'Thanjavur', 'Trichy', 'Erode', 'Tiruppur'];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      role: 'farmer',
      location: 'Coimbatore'
    }
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await registerAuth({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
        location: data.location
      });
      navigate('/marketplace');
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-agri-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Join AgriConnect</h2>
          <p className="text-slate-500 text-sm">Create an account for smart farming & rentals</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Select Account Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="farmer"
                  {...register('role')}
                  className="peer sr-only"
                />
                <div className="p-3.5 border-2 border-slate-200 rounded-2xl peer-checked:border-agri-600 peer-checked:bg-agri-50 text-center transition-all">
                  <UserCheck className="w-5 h-5 text-agri-600 mx-auto mb-1" />
                  <span className="block text-xs font-bold text-slate-800">Farmer</span>
                  <span className="text-[10px] text-slate-500">Rent & Diagnose</span>
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="equipment_owner"
                  {...register('role')}
                  className="peer sr-only"
                />
                <div className="p-3.5 border-2 border-slate-200 rounded-2xl peer-checked:border-harvest-600 peer-checked:bg-harvest-50 text-center transition-all">
                  <Tractor className="w-5 h-5 text-harvest-600 mx-auto mb-1" />
                  <span className="block text-xs font-bold text-slate-800">Equipment Owner</span>
                  <span className="text-[10px] text-slate-500">List Machinery</span>
                </div>
              </label>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                {...register('name', { required: 'Full name is required' })}
                placeholder="Karthikeyan R"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-agri-500"
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 font-medium mt-1">{errors.name.message}</p>}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                  })}
                  placeholder="karthi@example.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-agri-500"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 font-medium mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: { value: /^[0-9+ ]{10,13}$/, message: 'Valid phone number required' }
                  })}
                  placeholder="9876543210"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-agri-500"
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 font-medium mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          {/* District / Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              District / Location (Tamil Nadu)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <select
                {...register('location')}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-agri-500"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters' }
                  })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-agri-500"
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 font-medium mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Confirm password',
                    validate: (val) => val === password || 'Passwords do not match'
                  })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-agri-500"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 font-medium mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-3 text-base justify-center mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Free Account'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-agri-700 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
