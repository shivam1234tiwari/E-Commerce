import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatINR } from '../utils/currency';

const SLIDES = [
  {
    id: 1,
    title: 'Festive Electronics Sale',
    subtitle: `Get premium noise-canceling headphones starting at ${formatINR(49)}.`,
    bg: 'from-indigo-700 via-indigo-900 to-slate-900',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    badge: 'Limited Offer',
  },
  {
    id: 2,
    title: 'Upgrade Your Workstation',
    subtitle: `Mechanical keyboards & ergonomic chairs under ${formatINR(199)}.`,
    bg: 'from-purple-800 via-slate-900 to-indigo-950',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
    badge: 'Trending Collection',
  },
  {
    id: 3,
    title: 'Smart Gadgets & Audio',
    subtitle: 'Immerse yourself in high-fidelity sound. Extra 10% off with UPI.',
    bg: 'from-pink-800 via-purple-900 to-slate-900',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
    badge: 'New Arrivals',
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 4000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
    startTimer(); // Reset timer after manual click
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    startTimer(); // Reset timer after manual click
  };

  const handleDotClick = (index) => {
    setCurrent(index);
    startTimer();
  };

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] overflow-hidden rounded-3xl shadow-xl my-4 select-none">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out flex items-center bg-gradient-to-r ${slide.bg} ${
            index === current ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 items-center gap-6 w-full">
            <div className="text-white space-y-3 sm:space-y-4">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-black uppercase tracking-widest border border-white/20">
                {slide.badge}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight">
                {slide.title}
              </h2>
              <p className="text-slate-200 text-xs sm:text-sm max-w-md leading-relaxed">
                {slide.subtitle}
              </p>
              <button className="bg-white text-indigo-950 font-extrabold px-6 py-2.5 rounded-xl shadow-lg hover:bg-slate-100 active:scale-95 transition-all duration-200 text-sm cursor-pointer">
                Shop Deals Now
              </button>
            </div>

            <div className="hidden md:block h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-slate-900/60 hover:bg-slate-900/90 text-white p-2.5 rounded-full backdrop-blur-md transition-all active:scale-90 cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-slate-900/60 hover:bg-slate-900/90 text-white p-2.5 rounded-full backdrop-blur-md transition-all active:scale-90 cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              current === idx ? 'w-8 bg-white' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}