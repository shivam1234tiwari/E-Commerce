// client/src/components/Carousel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { formatINR } from '../utils/currency';

const SLIDES = [
  {
    id: 1,
    category: 'Electronics',
    title: 'Next-Gen Flagship Gadgets',
    subtitle: `M3 MacBooks, Sony ANC Headphones & 4K Displays starting at ${formatINR(3499)}.`,
    bg: 'from-indigo-950 via-slate-900 to-indigo-900',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    badge: 'Mega Tech Deals',
  },
  {
    id: 2,
    category: 'Fashion',
    title: 'Nike Jordans & Streetwear',
    subtitle: `Premium sneakers, leather jackets and urban fits starting at ${formatINR(1199)}.`,
    bg: 'from-rose-950 via-slate-900 to-slate-900',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    badge: 'Trending Drop',
  },
  {
    id: 3,
    category: 'Fragrances',
    title: 'Signature Luxury Scents',
    subtitle: `Dior Sauvage, Chanel No. 5 & Tom Ford collections starting from ${formatINR(4999)}.`,
    bg: 'from-amber-950 via-slate-900 to-stone-900',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80',
    badge: 'Up to 30% OFF',
  },
  {
    id: 4,
    category: 'Home & Kitchen',
    title: 'Ergonomic Furniture & Decor',
    subtitle: `Upgrade your living space & work setup starting at ${formatINR(7499)}.`,
    bg: 'from-emerald-950 via-slate-900 to-teal-950',
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&auto=format&fit=crop&q=80',
    badge: 'Bestsellers',
  },
];

export default function Carousel({ onSelectDealCategory }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 4500);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
    startTimer(); // Reset timer on interaction
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    startTimer(); // Reset timer on interaction
  };

  const handleDealClick = (category) => {
    if (onSelectDealCategory) {
      onSelectDealCategory(category);
    }
    const section = document.getElementById('products-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full h-[340px] sm:h-[420px] overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl my-2 sm:my-4 select-none group border border-slate-200 dark:border-slate-800">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out flex items-center bg-gradient-to-r ${slide.bg} ${
            index === current ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 items-center gap-6 w-full">
            {/* Left Content */}
            <div className="text-white space-y-3 sm:space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-white text-[10px] sm:text-xs font-black uppercase tracking-widest border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {slide.badge}
              </span>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                {slide.title}
              </h2>

              <p className="text-slate-200 text-xs sm:text-sm max-w-md leading-relaxed line-clamp-2 sm:line-clamp-none">
                {slide.subtitle}
              </p>

              <div className="pt-1">
                <button
                  onClick={() => handleDealClick(slide.category)}
                  className="bg-white text-slate-950 font-black px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl shadow-lg hover:bg-slate-100 active:scale-95 transition text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                >
                  Shop {slide.category} <ArrowRight className="w-4 h-4 text-indigo-600" />
                </button>
              </div>
            </div>

            {/* Right Product Image */}
            <div className="hidden md:flex justify-end">
              <div className="h-64 w-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10 p-2 bg-white/5 backdrop-blur-sm">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-slate-900/60 hover:bg-slate-900/90 text-white p-2.5 rounded-full backdrop-blur-md transition opacity-0 group-hover:opacity-100 active:scale-90 cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-slate-900/60 hover:bg-slate-900/90 text-white p-2.5 rounded-full backdrop-blur-md transition opacity-0 group-hover:opacity-100 active:scale-90 cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-y-0 -translate-x-1/2 flex items-center gap-2 z-20">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrent(idx);
              startTimer();
            }}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              current === idx ? 'w-8 bg-white shadow-sm' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}