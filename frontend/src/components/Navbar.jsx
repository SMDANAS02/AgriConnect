import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  Tractor,
  Stethoscope,
  CloudSun,
  LayoutDashboard,
  CalendarCheck,
  PlusCircle,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isOwner, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Sprout },
    { name: 'Marketplace', path: '/marketplace', icon: Tractor },
    { name: 'Disease AI', path: '/disease-detection', icon: Stethoscope },
    { name: 'Weather Advisory', path: '/advisory', icon: CloudSun }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-agri-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:bg-agri-700 transition-colors">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Agri<span className="text-agri-600">Connect</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-harvest-600 -mt-1">
                Smart Farming
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (text-base font-semibold) */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-base font-semibold transition-all ${
                      isActive
                        ? 'bg-agri-50 text-agri-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Auth Actions / User Menu (text-base font-medium) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-agri-600 text-white font-bold flex items-center justify-center text-base shadow-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-base font-medium text-slate-800 leading-tight">
                      {user?.name}
                    </p>
                    <span className="text-xs font-semibold uppercase px-1.5 py-0.2 bg-agri-100 text-agri-800 rounded">
                      {user?.role === 'equipment_owner' ? 'Owner' : 'Farmer'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-base font-medium text-slate-700 hover:bg-agri-50 hover:text-agri-700"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    <Link
                      to="/my-bookings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-base font-medium text-slate-700 hover:bg-agri-50 hover:text-agri-700"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      My Bookings
                    </Link>

                    {isOwner && (
                      <Link
                        to="/add-equipment"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-base font-medium text-harvest-600 hover:bg-harvest-50"
                      >
                        <PlusCircle className="w-4 h-4" />
                        List New Equipment
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-outline py-2 text-base px-4">
                  Log In
                </Link>
                <Link to="/register" className="btn-primary py-2 text-base px-4">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 animate-fade-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-semibold ${
                    isActive
                      ? 'bg-agri-50 text-agri-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </NavLink>
            );
          })}

          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-4 py-2 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium">Logged in as</p>
                  <p className="text-base font-bold text-slate-800">{user?.name}</p>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-base"
                >
                  <LayoutDashboard className="w-5 h-5 text-agri-600" />
                  Dashboard
                </Link>

                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-base"
                >
                  <CalendarCheck className="w-5 h-5 text-agri-600" />
                  My Bookings
                </Link>

                {isOwner && (
                  <Link
                    to="/add-equipment"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-harvest-600 bg-harvest-50 font-semibold text-base"
                  >
                    <PlusCircle className="w-5 h-5" />
                    List Equipment
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-semibold text-left text-base"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-outline justify-center text-base"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary justify-center text-base"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
