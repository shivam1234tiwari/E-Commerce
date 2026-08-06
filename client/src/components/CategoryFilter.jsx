import React from 'react';

export default function CategoryFilter({ categories, activeCategory, setActiveCategory }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 my-4 no-scrollbar">
      <button
        onClick={() => setActiveCategory('all')}
        className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition whitespace-nowrap cursor-pointer ${
          activeCategory === 'all'
            ? 'bg-indigo-600 text-white shadow-md'
            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
        }`}
      >
        All Products
      </button>

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition whitespace-nowrap cursor-pointer ${
            activeCategory === category
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}