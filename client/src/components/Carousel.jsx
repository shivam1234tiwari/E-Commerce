import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatINR } from '../utils/currency';

const SLIDES = [
  {
    id: 1,
    category: 'beauty',
    title: 'Festive Beauty Deals',
    subtitle: `Get premium cosmetics starting at ${formatINR(12)}.`,
    bg: 'from-indigo-700 via-indigo-900 to-slate-900',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    badge: 'Limited Offer',
  },
  {
    id: 2,
    category: 'fragrances',
    title: 'Luxury Fragrances',
    subtitle: `International scents & perfume collections starting from ${formatINR(25)}.`,
    bg: 'from-purple-800 via-slate-900 to-indigo-950',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
    badge: 'Trending Collection',
  },
  {
    id: 3,
    category: 'furniture',
    title: 'Modern Furniture & Decor',
    subtitle: 'Upgrade your living space. Extra 10% off with UPI payment.',
    bg: 'from-pink-800 via-purple-900 to-slate-900',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    badge: 'New Arrivals',
  },
];

export default function Carousel({ onSelectDealCategory }) {
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

  const handleDealClick = (category) => {
    if (onSelectDealCategory) {
      onSelectDealCategory(category);
    }
    const section = document.getElementById('products-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full h-[320px] sm:h-[420px] overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl my-2 sm:my-4 select-none">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out flex items-center bg-gradient-to-r ${slide.bg} ${
            index === current ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'
          }`}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-12 grid grid-cols-1 md:grid-cols-2 items-center gap-6 w-full">
            <div className="text-white space-y-2 sm:space-y-4">
              <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] sm:text-xs font-black uppercase tracking-widest border border-white/20">
                {slide.badge}
              </span>
              <h2 className="text-xl sm:text-4xl font-black leading-tight tracking-tight">
                {slide.title}
              </h2>
              <p className="text-slate-200 text-xs sm:text-sm max-w-md leading-relaxed line-clamp-2 sm:line-clamp-none">
                {slide.subtitle}
              </p>
              <button
                onClick={() => handleDealClick(slide.category)}
                className="bg-white text-indigo-950 font-extrabold px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-lg hover:bg-slate-100 active:scale-95 transition text-xs sm:text-sm cursor-pointer mt-1"
              >
                Shop Deals Now
              </button>
            </div>

            <div className="hidden md:block h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => setCurrent(current === 0 ? SLIDES.length - 1 : current - 1)}
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 bg-slate-900/60 text-white p-1.5 sm:p-2.5 rounded-full backdrop-blur-md active:scale-90 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        onClick={() => setCurrent(current === SLIDES.length - 1 ? 0 : current + 1)}
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 bg-slate-900/60 text-white p-1.5 sm:p-2.5 rounded-full backdrop-blur-md active:scale-90 cursor-pointer"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}