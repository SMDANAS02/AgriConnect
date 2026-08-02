import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EquipmentMarketplace from './pages/EquipmentMarketplace';
import EquipmentDetail from './pages/EquipmentDetail';
import DiseaseDetection from './pages/DiseaseDetection';
import AdvisoryDashboard from './pages/AdvisoryDashboard';
import FarmerDashboard from './pages/FarmerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import MyBookings from './pages/MyBookings';
import AddEquipment from './pages/AddEquipment';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5 // 5 minutes cache
    }
  }
});

// Dynamic Dashboard redirect based on role
const DashboardRouter = () => {
  const { isOwner } = useAuth();
  return isOwner ? <OwnerDashboard /> : <FarmerDashboard />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ErrorBoundary>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
              <Navbar />

              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/marketplace" element={<EquipmentMarketplace />} />
                  <Route path="/marketplace/:id" element={<EquipmentDetail />} />
                  <Route path="/advisory" element={<AdvisoryDashboard />} />

                  {/* Protected Routes */}
                  <Route
                    path="/disease-detection"
                    element={
                      <ProtectedRoute>
                        <DiseaseDetection />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardRouter />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/my-bookings"
                    element={
                      <ProtectedRoute>
                        <MyBookings />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/add-equipment"
                    element={
                      <ProtectedRoute allowedRoles={['equipment_owner']}>
                        <AddEquipment />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <Footer />

              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3500,
                  style: {
                    background: '#0f172a',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 600
                  }
                }}
              />
            </div>
          </ErrorBoundary>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
