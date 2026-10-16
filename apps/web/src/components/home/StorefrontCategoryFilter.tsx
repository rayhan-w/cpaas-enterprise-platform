'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CategoryItem, ProductItem, SubCategoryItem } from '@/lib/types';
import ProductGrid from '@/components/product/ProductGrid';
import { Search, Sparkles, Filter, X, ChevronRight, Package, ArrowRight } from 'lucide-react';

interface StorefrontCategoryFilterProps {
  categories: CategoryItem[];
  products: ProductItem[];
}

export default function StorefrontCategoryFilter({
  categories: initialCategories,
  products: initialProducts,
}: StorefrontCategoryFilterProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [filterSearch, setFilterSearch] = useState('');

  // Update on prop changes
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Listen for admin changes in local storage or other tabs
  useEffect(() => {
    const handleStorage = async (e: StorageEvent) => {
      if (e.key === 'jawata_products_last_synced' || e.key === 'jawata_categories_tree') {
        try {
          const [catRes, prodRes] = await Promise.all([
            fetch('/api/categories').then((r) => r.json()),
            fetch('/api/products?limit=150').then((r) => r.json()),
          ]);
          if (catRes.categories) setCategories(catRes.categories);
          if (prodRes.products) setProducts(prodRes.products);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const activeCategory = useMemo(() => {
    if (selectedCatId === 'all') return null;
    return categories.find((c) => c.id === selectedCatId || c.slug === selectedCatId) || null;
  }, [categories, selectedCatId]);

  const activeSubcategory = useMemo(() => {
    if (!activeCategory || !selectedSubId) return null;
    return activeCategory.subCategories?.find((s) => s.id === selectedSubId || s.slug === selectedSubId) || null;
  }, [activeCategory, selectedSubId]);

  // Count products per category
  const productCountByCat = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of categories) {
      const catNameLower = cat.name.trim().toLowerCase();
      const subNamesLower = (cat.subCategories || []).map((s) => s.name.trim().toLowerCase());

      const matching = products.filter((p) => {
        if (p.categoryId === cat.id || p.categorySlug === cat.slug) return true;
        if (p.categoryName && p.categoryName.trim().toLowerCase() === catNameLower) return true;
        if (Array.isArray(p.categories)) {
          if (p.categories.some((c) => c.trim().toLowerCase() === catNameLower)) return true;
          if (p.categories.some((c) => subNamesLower.includes(c.trim().toLowerCase()))) return true;
        }
        return false;
      });
      counts[cat.id] = matching.length;
    }
    return counts;
  }, [categories, products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category / Subcategory filter
    if (activeCategory) {
      const catNameLower = activeCategory.name.trim().toLowerCase();
      const subNamesLower = (activeCategory.subCategories || []).map((s) => s.name.trim().toLowerCase());

      if (activeSubcategory) {
        // Specific subcategory filter
        const subNameLower = activeSubcategory.name.trim().toLowerCase();
        list = list.filter((p) => {
          if (p.subCategoryId === activeSubcategory.id || p.subCategorySlug === activeSubcategory.slug) return true;
          if (p.subCategoryName && p.subCategoryName.trim().toLowerCase() === subNameLower) return true;
          if (Array.isArray(p.categories) && p.categories.some((c) => c.trim().toLowerCase() === subNameLower)) {
            return true;
          }
          return false;
        });
      } else {
        // Top-level category filter (matches parent category OR any of its subcategories)
        list = list.filter((p) => {
          if (p.categoryId === activeCategory.id || p.categorySlug === activeCategory.slug) return true;
          if (p.categoryName && p.categoryName.trim().toLowerCase() === catNameLower) return true;
          if (Array.isArray(p.categories)) {
            if (p.categories.some((c) => c.trim().toLowerCase() === catNameLower)) return true;
            if (p.categories.some((c) => subNamesLower.includes(c.trim().toLowerCase()))) return true;
          }
          return false;
        });
      }
    }

    // Search query matching product name, description, brand, category, subcategory
    if (filterSearch.trim()) {
      const q = filterSearch.trim().toLowerCase();
      list = list.filter((p) => {
        if (p.name.toLowerCase().includes(q)) return true;
        if (p.description && p.description.toLowerCase().includes(q)) return true;
        if (p.brand && p.brand.toLowerCase().includes(q)) return true;
        if (p.categoryName && p.categoryName.toLowerCase().includes(q)) return true;
        if (p.subCategoryName && p.subCategoryName.toLowerCase().includes(q)) return true;
        if (Array.isArray(p.categories) && p.categories.some((c) => c.toLowerCase().includes(q))) return true;
        return false;
      });
    }

    return list;
  }, [products, activeCategory, activeSubcategory, filterSearch]);

  const handleSelectCategory = (catId: string) => {
    setSelectedCatId(catId);
    setSelectedSubId(null); // Reset subcategory when switching top category
  };

  const handleSelectSubCategory = (subId: string | null) => {
    setSelectedSubId(subId);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8" id="storefront-category-section">
      {/* Header and Live Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#fd6b03] flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#fd6b03]" />
            Department Showcase
          </span>
          <h2 className="section-title text-2xl sm:text-3xl text-[#0E140E]">
            All Categories & Products
          </h2>
          <p className="text-xs text-[#526052] mt-0.5">
            Filter by category or subcategory to instantly find what you need
          </p>
        </div>

        {/* Search within Category Filter */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="Search within categories..."
            className="w-full bg-white border border-[#DFECCE] rounded-xl py-2 pl-9 pr-8 text-xs text-[#0E140E] placeholder-[#879787] focus:outline-none focus:border-[#fd6b03] transition-all shadow-xs"
          />
          <Search className="w-4 h-4 text-[#879787] absolute left-3 top-1/2 -translate-y-1/2" />
          {filterSearch && (
            <button
              onClick={() => setFilterSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#879787] hover:text-[#0E140E]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Top-Level Categories Chips Row (Subcategories NEVER appear here!) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* Sob / All Chip */}
        <button
          onClick={() => handleSelectCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs ${
            selectedCatId === 'all'
              ? 'bg-[#0d1f61] text-white ring-2 ring-[#0d1f61]/20 scale-102'
              : 'bg-white text-[#0E140E] border border-[#DFECCE] hover:border-[#fd6b03] hover:text-[#fd6b03]'
          }`}
        >
          <span>সব / All</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
              selectedCatId === 'all' ? 'bg-white/20 text-white' : 'bg-[#FAFCF7] text-[#526052]'
            }`}
          >
            {products.length}
          </span>
        </button>

        {/* Top-Level Category Chips */}
        {categories.map((cat) => {
          const isSelected = selectedCatId === cat.id;
          const count = productCountByCat[cat.id] ?? 0;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isSelected
                  ? 'bg-[#fd6b03] text-white ring-2 ring-[#fd6b03]/30 scale-102'
                  : 'bg-white text-[#0E140E] border border-[#DFECCE] hover:border-[#fd6b03] hover:text-[#fd6b03]'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#FAFCF7] text-[#526052]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Nested Subcategories Group (Shown inside/under the active category) */}
      {activeCategory && activeCategory.subCategories && activeCategory.subCategories.length > 0 && (
        <div className="mt-3 p-3.5 bg-orange-50/60 rounded-2xl border border-orange-200/80 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#0d1f61]">
            <span>{activeCategory.name} Subcategories:</span>
            <span className="text-[10px] text-[#526052] font-normal">
              (Click a subcategory to filter specifically)
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* All in Parent Category Subchip */}
            <button
              onClick={() => handleSelectSubCategory(null)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedSubId === null
                  ? 'bg-[#0d1f61] text-white shadow-xs'
                  : 'bg-white text-[#0E140E] border border-[#DFECCE] hover:border-[#fd6b03]'
              }`}
            >
              All {activeCategory.name}
            </button>

            {/* Individual Subcategory Chips */}
            {activeCategory.subCategories.map((sub) => {
              const isSubSelected = selectedSubId === sub.id || selectedSubId === sub.slug;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSelectSubCategory(sub.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSubSelected
                      ? 'bg-[#fd6b03] text-white shadow-xs'
                      : 'bg-white text-[#0E140E] border border-[#DFECCE] hover:border-[#fd6b03]'
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Filter Status & Count */}
      <div className="flex items-center justify-between text-xs text-[#526052] mt-4 mb-6">
        <div>
          Showing <span className="font-bold text-[#0E140E]">{filteredProducts.length}</span> products
          {activeCategory && (
            <span>
              {' '}in <span className="font-bold text-[#fd6b03]">{activeCategory.name}</span>
              {activeSubcategory && (
                <span>
                  {' '}› <span className="font-bold text-[#0d1f61]">{activeSubcategory.name}</span>
                </span>
              )}
            </span>
          )}
          {filterSearch && (
            <span>
              {' '}matching &quot;<span className="font-bold text-[#0E140E]">{filterSearch}</span>&quot;
            </span>
          )}
        </div>
        {(selectedCatId !== 'all' || selectedSubId !== null || filterSearch) && (
          <button
            onClick={() => {
              setSelectedCatId('all');
              setSelectedSubId(null);
              setFilterSearch('');
            }}
            className="text-[11px] font-bold text-[#fd6b03] hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear Filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="text-center py-16 bg-[#FAFCF7] rounded-3xl border border-dashed border-[#DFECCE]">
          <Package className="w-12 h-12 text-[#879787] mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-[#0E140E]">No products found in this category</h3>
          <p className="text-xs text-[#526052] max-w-sm mx-auto mt-1">
            Try choosing another subcategory or clear your search to explore all available items.
          </p>
          <button
            onClick={() => {
              setSelectedCatId('all');
              setSelectedSubId(null);
              setFilterSearch('');
            }}
            className="mt-4 px-4 py-2 bg-[#0d1f61] hover:bg-[#162d85] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Show All Products
          </button>
        </div>
      )}
    </section>
  );
}
