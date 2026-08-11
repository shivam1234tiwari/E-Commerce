import React, { useState } from 'react';
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home({ products, search }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' || p.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  return (
    <main id="products-section" className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-3 sm:px-4 py-4 text-slate-800 dark:text-slate-100">
      {/* Banner Carousel */}
      <Carousel onSelectDealCategory={handleCategoryChange} />

      <div className="mt-6 sm:mt-8 mb-2">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Explore Products</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
          Showing {filteredProducts.length} items
        </p>
      </div>

      {/* Category Pills Filter */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={handleCategoryChange}
      />

      {currentProducts.length === 0 ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400">No products found matching search.</div>
      ) : (
        <>
          {/* Responsive Device Grid: Mobile 2 Cols | Tablet 3 Cols | Desktop 4 Cols */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 my-8 sm:my-10">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 px-3 sm:px-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}