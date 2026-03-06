import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Scissors, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Loader2, 
  Lock, 
  LayoutDashboard,
  LogOut,
  RefreshCw
} from 'lucide-react';

interface Booking {
  id: string;
  name: string;
  email?: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        headers: { 'x-admin-key': adminKey },
      });
      if (!response.ok) throw new Error('Acesso não autorizado');
      const data = await response.json();
      setBookings(data.sort((a: Booking, b: Booking) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      setError('Chave de acesso inválida ou erro de servidor.');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': adminKey 
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Falha ao atualizar');
      setBookings(bookings.map(b => b.id === id ? { ...b, status: status as any } : b));
    } catch (err) {
      alert('Erro ao atualizar status');
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este agendamento?')) return;
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey },
      });
      if (!response.ok) throw new Error('Falha ao eliminar');
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      alert('Erro ao eliminar agendamento');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-terracotta rounded-full flex items-center justify-center mx-auto text-white">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-display text-ink">Admin Login</h1>
            <p className="text-sm opacity-60">Introduza a chave de acesso para gerir os agendamentos.</p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchBookings()}
              placeholder="Chave de Acesso"
              className="w-full bg-ink/5 border-b-2 border-ink/10 py-3 px-4 focus:border-terracotta outline-none transition-colors rounded-xl"
            />
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            <button
              onClick={fetchBookings}
              disabled={loading}
              className="w-full bg-ink text-cream py-4 rounded-full font-bold text-lg hover:bg-terracotta transition-all shadow-xl flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-cream p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-terracotta">
              <LayoutDashboard size={24} />
              <span className="font-mono text-xs uppercase tracking-[0.5em]">Dashboard Admin</span>
            </div>
            <h1 className="text-5xl font-display">Agendamentos</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchBookings}
              className="p-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
              title="Atualizar"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-full hover:bg-red-500/20 transition-colors text-sm font-bold"
            >
              Sair <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total', value: bookings.length, color: 'bg-white/5' },
            { label: 'Pendentes', value: bookings.filter(b => b.status === 'pending').length, color: 'bg-amber-500/10 text-amber-500' },
            { label: 'Confirmados', value: bookings.filter(b => b.status === 'confirmed').length, color: 'bg-emerald-500/10 text-emerald-500' },
          ].map((stat, i) => (
            <div key={i} className={`p-8 rounded-3xl ${stat.color} border border-white/5`}>
              <p className="text-xs uppercase tracking-widest opacity-60 mb-2">{stat.label}</p>
              <p className="text-4xl font-display">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {bookings.length === 0 ? (
              <div className="text-center py-20 opacity-40">Nenhum agendamento encontrado.</div>
            ) : (
              bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 group hover:bg-white/[0.08] transition-colors"
                >
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest ${
                        booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-500' :
                        booking.status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                        'bg-amber-500/20 text-amber-500'
                      }`}>
                        {booking.status}
                      </div>
                      <span className="text-xs opacity-40 font-mono">ID: {booking.id}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-display">{booking.name}</h3>
                        <div className="flex items-center gap-4 text-sm opacity-60">
                          <span className="flex items-center gap-1"><Phone size={14} /> {booking.phone}</span>
                          {booking.email && <span className="flex items-center gap-1"><Mail size={14} /> {booking.email}</span>}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-terracotta">
                          <Scissors size={16} />
                          <span className="text-lg font-medium">{booking.service}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm opacity-60">
                          <span className="flex items-center gap-1"><Calendar size={14} /> {booking.date}</span>
                          <span className="flex items-center gap-1"><Clock size={14} /> {booking.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full lg:w-auto">
                    {booking.status === 'pending' && (
                      <button 
                        onClick={() => updateStatus(booking.id, 'confirmed')}
                        className="flex-1 lg:flex-none bg-emerald-500 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"
                      >
                        Confirmar <CheckCircle2 size={18} />
                      </button>
                    )}
                    {booking.status !== 'cancelled' && (
                      <button 
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        className="flex-1 lg:flex-none bg-white/10 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
                      >
                        Cancelar <XCircle size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteBooking(booking.id)}
                      className="p-3 rounded-full text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      title="Eliminar"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
