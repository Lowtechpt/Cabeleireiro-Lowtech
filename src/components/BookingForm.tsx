import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Phone, Mail, Scissors, CheckCircle2, Loader2 } from 'lucide-react';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Corte de Autor',
    date: '',
    time: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Falha ao agendar');
      
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', service: 'Corte de Autor', date: '', time: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="w-20 h-20 text-emerald-500" />
        </div>
        <h3 className="text-3xl font-display">Agendamento Solicitado!</h3>
        <p className="text-lg opacity-80">Entraremos em contacto em breve para confirmar o seu horário.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="bg-ink text-cream px-8 py-3 rounded-full font-bold hover:bg-terracotta transition-colors"
        >
          Novo Agendamento
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
            <User size={14} /> Nome Completo
          </label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-transparent border-b border-current/20 py-2 focus:border-terracotta outline-none transition-colors"
            placeholder="Seu nome"
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
            className="w-full bg-transparent border-b border-current/20 py-2 focus:border-terracotta outline-none transition-colors"
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
          className="w-full bg-transparent border-b border-current/20 py-2 focus:border-terracotta outline-none transition-colors"
          placeholder="seu@email.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
          <Scissors size={14} /> Serviço
        </label>
        <select
          value={formData.service}
          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
          className="w-full bg-transparent border-b border-current/20 py-2 focus:border-terracotta outline-none transition-colors appearance-none"
        >
          {services.map((s) => (
            <option key={s} value={s} className="bg-ink text-cream">{s}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
            <Calendar size={14} /> Data
          </label>
          <input
            required
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-transparent border-b border-current/20 py-2 focus:border-terracotta outline-none transition-colors"
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
            className="w-full bg-transparent border-b border-current/20 py-2 focus:border-terracotta outline-none transition-colors"
          />
        </div>
      </div>

      <button
        disabled={status === 'loading'}
        type="submit"
        className="w-full bg-ink text-cream py-4 rounded-full font-bold text-lg hover:bg-terracotta transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {status === 'loading' ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>Confirmar Agendamento <CheckCircle2 size={20} /></>
        )}
      </button>

      {status === 'error' && (
        <p className="text-red-500 text-center text-sm">Ocorreu um erro. Tente novamente.</p>
      )}
    </form>
  );
}
