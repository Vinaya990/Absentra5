import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToasterProvider } from './components/ui/Toaster';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/Toaster';
import { queryClient } from './lib/queryClient';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToasterProvider>
        <AuthProvider>
          <NotificationProvider>
            <DataProvider>
              <Router>
                <div className="min-h-screen bg-gray-50">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/dashboard/*"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                  <Toaster />
                </div>
              </Router>
            </DataProvider>
          </NotificationProvider>
        </AuthProvider>
      </ToasterProvider>
    </QueryClientProvider>
  );
}

export default App;