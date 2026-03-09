import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
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
  RefreshCw,
  List,
  Plus,
  X,
  ChevronLeft,
  ChevronRight
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
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  // Calendar Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getBookingsForDate = (dateStr: string) => bookings.filter(b => b.date === dateStr);

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
              className="w-full bg-ink/5 border-b-2 border-ink/10 py-3 px-4 focus:border-terracotta outline-none transition-colors rounded-xl text-ink"
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

  const renderBookingCard = (booking: Booking) => (
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
              <span className="flex items-center gap-1"><CalendarIcon size={14} /> {booking.date}</span>
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
  );

  return (
    <div className="min-h-screen bg-ink text-cream p-6 md:p-12 relative">
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
          
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => setIsNewBookingModalOpen(true)}
              className="flex items-center gap-2 bg-terracotta text-white px-6 py-3 rounded-full hover:bg-terracotta/80 transition-colors text-sm font-bold"
            >
              <Plus size={18} /> Nova Marcação
            </button>
            <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
                title="Vista de Lista"
              >
                <List size={20} />
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-full transition-colors ${viewMode === 'calendar' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
                title="Vista de Calendário"
              >
                <CalendarIcon size={20} />
              </button>
            </div>
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

        {/* Main Content Area */}
        {viewMode === 'list' ? (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {bookings.length === 0 ? (
                <div className="text-center py-20 opacity-40">Nenhum agendamento encontrado.</div>
              ) : (
                bookings.map(renderBookingCard)
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
              <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <ChevronLeft size={24} />
              </button>
              <h2 className="text-2xl font-display">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 md:gap-4">
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs uppercase tracking-widest opacity-60 py-2">
                  {day}
                </div>
              ))}
              
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[100px] md:min-h-[120px] rounded-2xl bg-white/[0.02] border border-white/5 opacity-50" />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayBookings = getBookingsForDate(dateStr);
                const isSelected = selectedDate === dateStr;
                const isToday = new Date().toISOString().split('T')[0] === dateStr;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                    className={`min-h-[100px] md:min-h-[120px] rounded-2xl border flex flex-col items-start justify-start p-2 md:p-3 relative transition-all overflow-hidden ${
                      isSelected 
                        ? 'bg-white/10 border-terracotta ring-1 ring-terracotta' 
                        : isToday
                          ? 'bg-white/10 border-white/20 hover:bg-white/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className={`text-sm md:text-lg font-display mb-2 ${isSelected ? 'text-terracotta' : ''}`}>{day}</span>
                    
                    <div className="flex flex-col gap-1 w-full overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                      {dayBookings.map((b, idx) => (
                        <div 
                          key={idx} 
                          className={`text-[10px] md:text-xs px-1.5 py-1 rounded w-full text-left truncate ${
                            b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                            b.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-amber-500/20 text-amber-400'
                          }`}
                          title={`${b.time} - ${b.name}`}
                        >
                          <span className="font-mono opacity-70 mr-1">{b.time}</span>
                          {b.name.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Date Bookings */}
            <AnimatePresence>
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-8 space-y-6 border-t border-white/10">
                    <h3 className="text-2xl font-display flex items-center gap-3">
                      <CalendarIcon className="text-terracotta" /> 
                      Agendamentos para {selectedDate}
                    </h3>
                    {getBookingsForDate(selectedDate).length === 0 ? (
                      <p className="opacity-60">Sem agendamentos para este dia.</p>
                    ) : (
                      <div className="space-y-4">
                        {getBookingsForDate(selectedDate).map(renderBookingCard)}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* New Booking Modal */}
      <AnimatePresence>
        {isNewBookingModalOpen && (
          <NewBookingModal 
            onClose={() => setIsNewBookingModalOpen(false)} 
            onSuccess={() => {
              setIsNewBookingModalOpen(false);
              fetchBookings();
            }}
            adminKey={adminKey}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NewBookingModal({ onClose, onSuccess, adminKey }: { onClose: () => void, onSuccess: () => void, adminKey: string }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Corte de Autor',
    date: '',
    time: '',
    status: 'confirmed' // Admin bookings are confirmed by default
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const services = [
    'Corte de Autor',
    'Coloração Orgânica',
    'Terapia Capilar',
    'Estética Facial',
    'Balayage',
    'Barba & Ritual',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Falha ao agendar');
      
      // If we want to auto-confirm admin bookings, we might need a separate endpoint or just update it immediately if the backend doesn't support setting status on creation.
      // Wait, the backend `POST /api/bookings` hardcodes `status: "pending"`.
      // Let's create it, then immediately patch it to confirmed.
      const newBooking = await response.json();
      
      if (formData.status === 'confirmed') {
         await fetch(`/api/bookings/${newBooking.id}`, {
            method: 'PATCH',
            headers: { 
              'Content-Type': 'application/json',
              'x-admin-key': adminKey 
            },
            body: JSON.stringify({ status: 'confirmed' }),
          });
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-ink border border-white/10 p-8 rounded-3xl max-w-lg w-full relative max-h-[90vh] overflow-y-auto"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-3xl font-display mb-8">Nova Marcação</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
                <User size={14} /> Nome Cliente
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-terracotta outline-none transition-colors text-white"
                placeholder="Nome"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
                <Phone size={14} /> Telemóvel
              </label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-terracotta outline-none transition-colors text-white"
                placeholder="9xx xxx xxx"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
              <Mail size={14} /> Email (Opcional)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-terracotta outline-none transition-colors text-white"
              placeholder="cliente@email.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
              <Scissors size={14} /> Serviço
            </label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-terracotta outline-none transition-colors text-white appearance-none"
            >
              {services.map((s) => (
                <option key={s} value={s} className="bg-ink text-cream">{s}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
                <CalendarIcon size={14} /> Data
              </label>
              <input
                required
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-terracotta outline-none transition-colors text-white [color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
                <Clock size={14} /> Horário
              </label>
              <input
                required
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-terracotta outline-none transition-colors text-white [color-scheme:dark]"
              />
            </div>
          </div>
          
          <div className="space-y-2">
             <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
                Status Inicial
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="status" 
                    value="confirmed" 
                    checked={formData.status === 'confirmed'} 
                    onChange={() => setFormData({...formData, status: 'confirmed'})}
                    className="accent-terracotta"
                  />
                  Confirmado
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="status" 
                    value="pending" 
                    checked={formData.status === 'pending'} 
                    onChange={() => setFormData({...formData, status: 'pending'})}
                    className="accent-terracotta"
                  />
                  Pendente
                </label>
              </div>
          </div>

          <button
            disabled={status === 'loading'}
            type="submit"
            className="w-full bg-terracotta text-white py-4 rounded-xl font-bold text-lg hover:bg-terracotta/80 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
          >
            {status === 'loading' ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>Guardar Marcação <CheckCircle2 size={20} /></>
            )}
          </button>

          {status === 'error' && (
            <p className="text-red-500 text-center text-sm">Ocorreu um erro. Tente novamente.</p>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
}

