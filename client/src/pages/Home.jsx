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
    <main className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 py-4">
      <Carousel />

      <div className="mt-8 mb-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Explore Products</h2>
        <p className="text-slate-500 text-sm mt-0.5">
          Showing {filteredProducts.length} items from live catalog
        </p>
      </div>

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={handleCategoryChange}
      />

      {currentProducts.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No products found matching search.</div>
      ) : (
        <>
          {/* Responsive 2 to 4 column Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 my-10">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-semibold text-slate-700 px-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}