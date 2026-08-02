import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { DEFAULT_EQUIPMENT_IMAGES } from '../utils/sampleImages';

const EquipmentCard = ({ equipment }) => {
  const {
    id,
    name,
    category,
    pricePerDay,
    pricePerHour,
    rating = 4.8,
    reviewsCount = 12,
    images = [],
    availabilityStatus = 'available',
    owner
  } = equipment || {};

  const fallbackImage = DEFAULT_EQUIPMENT_IMAGES[category] || DEFAULT_EQUIPMENT_IMAGES.default;
  const displayImage = images && images.length > 0 && images[0] ? images[0] : fallbackImage;

  const formattedDayPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(pricePerDay || 0);

  const formattedHourPrice = pricePerHour
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(pricePerHour)
    : null;

  return (
    <div className="card-solid group flex flex-col overflow-hidden h-full hover:-translate-y-1">
      {/* Thumbnail Header */}
      <div className="relative h-48 sm:h-52 w-full bg-slate-100 overflow-hidden">
        <img
          src={displayImage}
          alt={name || 'Agricultural Equipment'}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />

        {/* Category Tag */}
        <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-sm font-bold px-3 py-1 rounded-lg uppercase tracking-wider shadow-md">
          {category || 'Equipment'}
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {availabilityStatus === 'available' ? (
            <span className="badge-status bg-emerald-500 text-white text-sm shadow-md">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Available
            </span>
          ) : (
            <span className="badge-status bg-amber-500 text-white text-sm shadow-md">
              Booked
            </span>
          )}
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          {/* Rating & Location */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{rating ? Number(rating).toFixed(1) : '4.8'}</span>
              <span className="text-slate-400 font-medium">({reviewsCount || 12})</span>
            </div>

            {owner?.location && (
              <div className="flex items-center gap-1 text-slate-500 font-medium text-sm">
                <MapPin className="w-4 h-4 text-agri-600" />
                <span className="truncate max-w-[130px]">{owner.location}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-slate-900 line-clamp-1 group-hover:text-agri-700 transition-colors">
            {name}
          </h3>

          {/* Owner Info */}
          {owner && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <ShieldCheck className="w-4 h-4 text-agri-600" />
              <span>Owner: <strong className="text-slate-800">{owner.name}</strong></span>
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-agri-700">
              {formattedDayPrice}
              <span className="text-xs font-normal text-slate-500"> / day</span>
            </div>
            {formattedHourPrice && (
              <p className="text-xs font-medium text-slate-400">
                {formattedHourPrice} / hr
              </p>
            )}
          </div>

          <Link
            to={`/marketplace/${id}`}
            className="btn-primary text-sm py-2 px-4 group-hover:bg-agri-700"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;
