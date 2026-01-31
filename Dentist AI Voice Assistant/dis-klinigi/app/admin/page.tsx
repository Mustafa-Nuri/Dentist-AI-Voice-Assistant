'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Check, 
  X, 
  Trash2, 
  RefreshCw,
  ArrowLeft,
  Lock,
  LogOut
} from 'lucide-react';
import Link from 'next/link';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  doctor: string;
  service: string;
  date: string;
  time: string;
  notes: string | null;
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  // Check if already authenticated (from sessionStorage)
  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('adminAuth', 'true');
      } else {
        setLoginError(data.error || 'Giriş başarısız');
      }
    } catch (error) {
      setLoginError('Bağlantı hatası');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    setUsername('');
    setPassword('');
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' 
        ? '/api/appointments' 
        : `/api/appointments?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [filter, isAuthenticated]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm('Bu randevuyu silmek istediğinize emin misiniz?')) return;
    
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Onaylandı';
      case 'cancelled': return 'İptal Edildi';
      default: return 'Beklemede';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
            <p className="text-gray-600 mt-2">Devam etmek için giriş yapın</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="admin"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Randevu Yönetimi</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchAppointments}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Yenile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex space-x-2 mb-6">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f === 'all' ? 'Tümü' : getStatusText(f)}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-600 text-sm">Toplam Randevu</p>
            <p className="text-3xl font-bold text-gray-900">{appointments.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-600 text-sm">Beklemede</p>
            <p className="text-3xl font-bold text-yellow-600">
              {appointments.filter(a => a.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-600 text-sm">Onaylandı</p>
            <p className="text-3xl font-bold text-green-600">
              {appointments.filter(a => a.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-600 text-sm">İptal Edildi</p>
            <p className="text-3xl font-bold text-red-600">
              {appointments.filter(a => a.status === 'cancelled').length}
            </p>
          </div>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
            <p className="text-gray-600 mt-2">Yükleniyor...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Henüz randevu bulunmuyor.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{appointment.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                        {formatDate(appointment.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-600" />
                        {appointment.time}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-blue-600" />
                        {appointment.doctor}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-blue-600" />
                        {appointment.phone}
                      </div>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Tedavi:</span> {appointment.service}
                    </p>
                    
                    {appointment.notes && (
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="font-medium">Not:</span> {appointment.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    {appointment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(appointment.id, 'confirmed')}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          title="Onayla"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => updateStatus(appointment.id, 'cancelled')}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="İptal Et"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteAppointment(appointment.id)}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
