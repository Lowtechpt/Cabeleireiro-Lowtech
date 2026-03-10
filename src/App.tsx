/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X, Scissors, Sparkles, Heart, MessageCircle, ArrowUpRight, Instagram, MapPin, Calendar } from 'lucide-react';
import BookingForm from './components/BookingForm';
import AdminDashboard from './components/AdminDashboard';

type SectionId = 'hero' | 'services' | 'portfolio' | 'philosophy' | 'contact' | null;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

function Home() {
  const [expanded, setExpanded] = useState<SectionId>(null);

  const sections = [
    {
      id: 'hero' as const,
      title: 'Corte & Alma',
      tagline: 'O seu refúgio de bem-estar.',
      content: 'Mais do que um salão, um espaço de reconexão. Especialistas em visagismo e rituais de cuidado que respeitam a sua essência e a saúde do seu cabelo.',
      color: 'bg-terracotta',
      textColor: 'text-cream',
      gridArea: 'col-span-12 row-span-6 lg:col-span-6 lg:row-span-8',
      icon: <Scissors className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 'portfolio' as const,
      title: 'Trabalhos',
      tagline: 'A nossa arte.',
      content: 'Veja os resultados reais dos nossos clientes. Transformações que elevam a auto-estima e celebram a individualidade.',
      color: 'bg-ink',
      textColor: 'text-cream',
      gridArea: 'col-span-12 row-span-4 lg:col-span-6 lg:row-span-8',
      icon: <Scissors className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 'services' as const,
      title: 'Serviços',
      tagline: 'O Cuidado.',
      content: 'Corte de Autor, Coloração Orgânica, Balayage, Rituais de Hidratação e Estética Avançada.',
      color: 'bg-cream',
      textColor: 'text-ink',
      gridArea: 'col-span-6 row-span-4 lg:col-span-4 lg:row-span-4',
      icon: <Sparkles className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 'philosophy' as const,
      title: 'Filosofia',
      tagline: 'Consciência.',
      content: 'Beleza que respeita a natureza. Produtos cruelty-free e técnicas sustentáveis.',
      color: 'bg-ink',
      textColor: 'text-cream',
      gridArea: 'col-span-6 row-span-4 lg:col-span-4 lg:row-span-4',
      icon: <Heart className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 'contact' as const,
      title: 'Agendar',
      tagline: 'O seu momento.',
      content: 'Reserve o seu horário e permita-se um momento de pausa.',
      color: 'bg-white',
      textColor: 'text-ink',
      gridArea: 'col-span-12 row-span-4 lg:col-span-4 lg:row-span-4',
      icon: <Calendar className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=1000'
    }
  ];

  return (
    <div className="h-screen w-screen relative bg-ink overflow-hidden">
      <div className="noise" />

      {/* Main Grid */}
      <div className="bento-grid">
        {sections.map((section) => (
          <motion.div
            key={section.id}
            layoutId={section.id}
            onClick={() => setExpanded(section.id)}
            className={`bento-item cursor-pointer group ${section.gridArea} ${section.color} border-ink/10 border`}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src={section.image} 
                alt={section.title} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className={`absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500 z-10`} />
            </div>

            <div className="relative z-20 flex flex-col h-full justify-between text-white">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/90">0{sections.indexOf(section) + 1}</span>
                  <div className="text-white/80 group-hover:text-white transition-colors duration-500">
                    {section.icon}
                  </div>
                </div>
                <ArrowUpRight className="text-white/50 group-hover:text-white transition-opacity duration-500" />
              </div>
              
              <div className="mt-auto">
                <h2 className={`text-4xl md:text-5xl lg:text-6xl font-display leading-[1.1] tracking-tight mb-4 drop-shadow-lg`}>
                  {section.title}
                </h2>
                <p className="text-xs md:text-sm uppercase tracking-widest font-bold text-white drop-shadow-md">
                  {section.tagline}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded View */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            layoutId={expanded}
            className={`fixed inset-0 z-[200] flex flex-col lg:flex-row overflow-hidden ${sections.find(s => s.id === expanded)?.color} ${sections.find(s => s.id === expanded)?.textColor}`}
          >
            {/* Left Side: Content */}
            <div className="w-full lg:w-1/2 p-8 md:p-20 flex flex-col justify-between overflow-y-auto relative z-10">
              <button 
                onClick={(e) => { e.stopPropagation(); setExpanded(null); }}
                className="absolute top-8 right-8 md:top-12 md:left-12 p-4 rounded-full border border-current hover:bg-current hover:text-inherit transition-all duration-500 z-[210] lg:static lg:w-fit lg:mb-12"
              >
                <X size={32} />
              </button>

              <div className="max-w-xl">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-xs uppercase tracking-[0.5em] mb-8 block opacity-60"
                >
                  {expanded.toUpperCase()} / SALÃO & BEM-ESTAR
                </motion.span>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[10vw] lg:text-[6vw] font-display leading-[1.1] tracking-tight mb-8"
                >
                  {sections.find(s => s.id === expanded)?.tagline}
                </motion.h1 >

                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-8"
                >
                  <p className="text-xl md:text-2xl font-light leading-snug opacity-90">
                    {sections.find(s => s.id === expanded)?.content}
                  </p>

                  {expanded === 'services' && (
                    <div className="space-y-12 mt-12">
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { name: 'Corte de Autor', price: 'desde 45€' },
                          { name: 'Coloração Orgânica', price: 'desde 60€' },
                          { name: 'Terapia Capilar', price: 'desde 35€' },
                          { name: 'Estética Facial', price: 'desde 50€' }
                        ].map((s, i) => (
                          <div key={i} className="flex justify-between items-center border-b border-current/20 pb-4">
                            <span className="text-lg font-medium">{s.name}</span>
                            <span className="font-mono text-sm opacity-60">{s.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {expanded === 'portfolio' && (
                    <div className="space-y-8 mt-12">
                      <p className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-60">Galeria de Transformações</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <img src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600" alt="Corte 1" className="rounded-3xl w-full aspect-[3/4] object-cover shadow-2xl" referrerPolicy="no-referrer" />
                          <img src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=600" alt="Corte 2" className="rounded-3xl w-full aspect-square object-cover shadow-2xl" referrerPolicy="no-referrer" />
                        </div>
                        <div className="space-y-4 pt-12">
                          <img src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=600" alt="Corte 3" className="rounded-3xl w-full aspect-square object-cover shadow-2xl" referrerPolicy="no-referrer" />
                          <img src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=600" alt="Corte 4" className="rounded-3xl w-full aspect-[3/4] object-cover shadow-2xl" referrerPolicy="no-referrer" />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-16"
              >
                {expanded === 'contact' ? (
                  <div className="flex flex-col gap-12">
                    <div className="bg-ink/5 p-8 rounded-[2rem] border border-current/10">
                      <BookingForm />
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-8 justify-between items-center opacity-60">
                      <div className="text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                        <MapPin size={16} /> Rua das Flores, 123 • Lisboa
                      </div>
                      <a href="https://wa.me/351900000000" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-terracotta transition-colors font-bold uppercase tracking-widest text-sm">
                        <MessageCircle size={16} /> WhatsApp
                      </a>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setExpanded('contact')}
                    className="group flex items-center gap-4 text-2xl md:text-4xl font-display italic hover:text-terracotta transition-colors"
                  >
                    Agendar Visita <ArrowRight size={32} className="group-hover:translate-x-4 transition-transform" />
                  </button>
                )}
              </motion.div>
            </div>

            {/* Right Side: Image/Gallery */}
            <div className="hidden lg:block w-1/2 h-full relative overflow-hidden">
              <motion.img 
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                src={sections.find(s => s.id === expanded)?.image} 
                alt="Salon Experience" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-ink/10 mix-blend-multiply" />
              
              {/* Floating Examples Label */}
              <div className="absolute bottom-12 right-12 text-white text-right">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-2 opacity-60">Exemplos de Trabalho</p>
                <h3 className="text-3xl font-display italic">A nossa arte em detalhe.</h3>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand Label - High Contrast Pill */}
      <div className="fixed top-8 left-8 z-[150] pointer-events-none">
        <div className="flex items-center gap-3 bg-ink text-cream px-6 py-3 rounded-full shadow-2xl border border-white/10">
          <div className="w-6 h-6 bg-terracotta rounded-full flex items-center justify-center">
            <Scissors size={12} />
          </div>
          <h1 className="font-display text-lg font-bold tracking-tight">Corte & Alma</h1>
        </div>
      </div>

      {/* Admin & Branding Links - Subtle */}
      <div className="fixed bottom-4 left-4 right-4 z-[150] flex justify-between items-center pointer-events-none">
        <a 
          href="https://lowtech.pt" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity text-white font-mono pointer-events-auto"
        >
          Desenvolvido por lowtech.pt
        </a>
        <Link 
          to="/admin" 
          className="text-[10px] uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity text-white font-mono pointer-events-auto"
        >
          Admin
        </Link>
      </div>
    </div>
  );
}
