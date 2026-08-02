import React from 'react';

export const EquipmentSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse"
        >
          <div className="w-full h-48 bg-slate-200 rounded-xl" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-6 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="h-9 bg-slate-200 rounded-xl w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-slate-200 rounded-xl w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 bg-slate-200 rounded-2xl" />
        <div className="h-32 bg-slate-200 rounded-2xl" />
        <div className="h-32 bg-slate-200 rounded-2xl" />
      </div>
      <div className="h-64 bg-slate-200 rounded-2xl" />
    </div>
  );
};

export default EquipmentSkeleton;
