'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Boxes,
  Filter,
  Check,
  BarChart3,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { ProductItem, CategoryItem } from '@/lib/types';
import { formatPrice } from '@/lib/formatters';
import { INITIAL_CATEGORIES } from '@/lib/sample-data';
import { useToast } from '@/context/toast-context';
import ImageUploadPicker from '@/components/admin/ImageUploadPicker';
import ExportProductsModal from '@/components/admin/ExportProductsModal';

export default function AdminProductsPage() {
  const { success, error } = useToast();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editSubCategoryId, setEditSubCategoryId] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editOriginalPrice, setEditOriginalPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCustomSubEdit, setIsCustomSubEdit] = useState(false);
  const [customSubNameEdit, setCustomSubNameEdit] = useState('');

  // Add Product Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(INITIAL_CATEGORIES[0]?.id || '');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [isCustomSubAdd, setIsCustomSubAdd] = useState(false);
  const [customSubNameAdd, setCustomSubNameAdd] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [sku, setSku] = useState('');
  const [badge, setBadge] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.categories && data.categories.length > 0) {
        setCategories(data.categories);
        if (!categoryId) setCategoryId(data.categories[0].id);
      }
    } catch {
      // Fallback already INITIAL_CATEGORIES
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openEditModal = (prod: ProductItem) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditCategoryId(prod.categoryId || (categories[0]?.id || ''));
    setEditSubCategoryId(prod.subCategoryId || '');
    setIsCustomSubEdit(false);
    setCustomSubNameEdit('');
    setEditPrice(String(prod.price));
    setEditOriginalPrice(prod.originalPrice ? String(prod.originalPrice) : '');
    setEditStock(String(prod.stock));
    setEditSku(prod.sku || '');
    setEditBadge(prod.badge || '');
    setEditImage(prod.image || '');
    setEditDescription(prod.description || '');
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editName.trim() || !editPrice) {
      error('Product title and selling price are required');
      return;
    }

    setIsUpdating(true);
    try {
      const selectedCat = categories.find((c) => c.id === editCategoryId);
      let targetSubId = editSubCategoryId || undefined;
      let targetSubName = selectedCat?.subCategories?.find((s) => s.id === editSubCategoryId)?.name;
      let targetSubSlug = selectedCat?.subCategories?.find((s) => s.id === editSubCategoryId)?.slug;

      // If user typed a new custom subcategory, create it in category
      if (isCustomSubEdit && customSubNameEdit.trim() && editCategoryId) {
        try {
          const subRes = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'subcategory',
              categoryId: editCategoryId,
              name: customSubNameEdit.trim(),
            }),
          });
          const subData = await subRes.json();
          if (subData.subCategory) {
            targetSubId = subData.subCategory.id;
            targetSubName = subData.subCategory.name;
            targetSubSlug = subData.subCategory.slug;
            fetchCategories();
          }
        } catch {
          targetSubName = customSubNameEdit.trim();
        }
      }

      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct.id,
          name: editName.trim(),
          categoryId: editCategoryId,
          categoryName: selectedCat?.name,
          categorySlug: selectedCat?.slug,
          subCategoryId: targetSubId,
          subCategoryName: targetSubName,
          subCategorySlug: targetSubSlug,
          price: Number(editPrice) || 0,
          originalPrice: editOriginalPrice ? Number(editOriginalPrice) : undefined,
          stock: Number(editStock) || 0,
          sku: editSku.trim() || undefined,
          badge: editBadge.trim() || undefined,
          image: editImage.trim() || undefined,
          description: editDescription.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update product');

      success('Updated product: ' + editName.slice(0, 25) + '...');
      setEditingProduct(null);
      fetchProducts();
    } catch (err: any) {
      error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${prodName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete product');

      success(`Product "${prodName.slice(0, 22)}..." deleted successfully`);
      fetchProducts();
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      error('Product name and price are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const cat = categories.find((c) => c.id === categoryId);
      let targetSubId = subCategoryId || undefined;
      let targetSubName = cat?.subCategories?.find((s) => s.id === subCategoryId)?.name;
      let targetSubSlug = cat?.subCategories?.find((s) => s.id === subCategoryId)?.slug;

      // If user typed a new custom subcategory, create it in category
      if (isCustomSubAdd && customSubNameAdd.trim() && categoryId) {
        try {
          const subRes = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'subcategory',
              categoryId,
              name: customSubNameAdd.trim(),
            }),
          });
          const subData = await subRes.json();
          if (subData.subCategory) {
            targetSubId = subData.subCategory.id;
            targetSubName = subData.subCategory.name;
            targetSubSlug = subData.subCategory.slug;
            fetchCategories();
          }
        } catch {
          targetSubName = customSubNameAdd.trim();
        }
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          categoryId,
          categoryName: cat?.name,
          categorySlug: cat?.slug,
          subCategoryId: targetSubId,
          subCategoryName: targetSubName,
          subCategorySlug: targetSubSlug,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : undefined,
          stock: Number(stock) || 50,
          sku: sku || `SKU-${Date.now()}`,
          badge: badge || undefined,
          image,
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add product');

      success('New product added to catalog successfully!');
      setShowAddModal(false);
      setName('');
      setPrice('');
      setOriginalPrice('');
      setDescription('');
      fetchProducts();
    } catch (err: any) {
      error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Category & Stock Filters & Inline Editing State
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'instock' | 'low' | 'out'>('all');
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);
  const [editingStockValues, setEditingStockValues] = useState<Record<string, number>>({});

  const handleInlineStockChange = async (productId: string, newStock: number) => {
    if (newStock < 0) newStock = 0;
    setUpdatingStockId(productId);

    // Optimistic local update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
    // Clear temporary edit state for this product
    setEditingStockValues((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });

    try {
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, stock: newStock }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update stock');
      success(`Stock updated to ${newStock} units`);
    } catch (err: any) {
      error(err.message || 'Could not update stock');
      fetchProducts(); // rollback on error
    } finally {
      setUpdatingStockId(null);
    }
  };

  const categoryStats = useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      slug?: string;
      productCount: number;
      totalUnits: number;
      lowStockCount: number;
      outOfStockCount: number;
    }>();

    categories.forEach((c) => {
      map.set(c.id, {
        id: c.id,
        name: c.name,
        slug: c.slug,
        productCount: 0,
        totalUnits: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
      });
    });

    products.forEach((p) => {
      let catStat = p.categoryId ? map.get(p.categoryId) : undefined;
      if (!catStat && p.categoryName) {
        catStat = Array.from(map.values()).find(
          (c) => c.name.toLowerCase() === p.categoryName?.toLowerCase()
        );
      }
      if (catStat) {
        catStat.productCount += 1;
        catStat.totalUnits += (p.stock || 0);
        if ((p.stock || 0) === 0) catStat.outOfStockCount += 1;
        else if ((p.stock || 0) <= 10) catStat.lowStockCount += 1;
      }
    });

    return Array.from(map.values());
  }, [products, categories]);

  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalLowStock = products.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length;
  const totalOutOfStock = products.filter((p) => (p.stock || 0) === 0).length;
  const totalInStock = products.filter((p) => (p.stock || 0) > 10).length;

  const filteredProducts = products.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q));
      if (!matchSearch) return false;
    }

    if (selectedCategoryFilter !== 'all') {
      const matchCat =
        p.categoryId === selectedCategoryFilter ||
        p.categorySlug === selectedCategoryFilter ||
        (p.categoryName &&
          categories.find((c) => c.id === selectedCategoryFilter)?.name.toLowerCase() ===
            p.categoryName.toLowerCase());
      if (!matchCat) return false;
    }

    if (stockFilter === 'out') {
      if ((p.stock || 0) !== 0) return false;
    } else if (stockFilter === 'low') {
      if ((p.stock || 0) <= 0 || (p.stock || 0) > 10) return false;
    } else if (stockFilter === 'instock') {
      if ((p.stock || 0) <= 10) return false;
    }

    return true;
  });

  const activeCategoryForAdd = categories.find((c) => c.id === categoryId);
  const activeCategoryForEdit = categories.find((c) => c.id === editCategoryId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title text-2xl sm:text-3xl text-[#1A1512]">
            Product Catalog & Stock Management
          </h1>
          <p className="text-xs text-[#6B5B58] mt-1">
            Real-time stock tracking by category, automatic deduction on orders, and instant inline stock editing.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="flex items-center justify-center gap-2 bg-white hover:bg-[#F1F8E8] text-[#1A1512] hover:text-[#4E820E] border border-[#EDE5E1] hover:border-[#6CAE14] px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#6CAE14]" />
            <span>Export Products Excel</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-[#6CAE14] hover:bg-[#5B960E] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Category Stock & Inventory Overview */}
      <div className="bg-white p-5 rounded-3xl border border-[#EDE5E1] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE5E1] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F1F8E8] text-[#6CAE14] flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-[#1A1512]">Category Stock Overview</h2>
              <p className="text-[11px] text-[#6B5B58]">
                Click any category card to filter items. Shows available units and out-of-stock alerts.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="px-3 py-1 bg-[#F8F7F5] rounded-xl border border-[#EDE5E1] text-[#1A1512]">
              Total Units: <span className="font-bold text-[#6CAE14]">{totalStockUnits}</span>
            </div>
            {totalLowStock > 0 && (
              <div className="px-2.5 py-1 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 font-semibold text-[11px]">
                ⚠️ {totalLowStock} Low Stock
              </div>
            )}
            {totalOutOfStock > 0 && (
              <div className="px-2.5 py-1 bg-red-50 rounded-xl border border-red-200 text-red-700 font-semibold text-[11px]">
                🚫 {totalOutOfStock} Out of Stock
              </div>
            )}
          </div>
        </div>

        {/* Category Cards Carousel / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-1">
          {/* All Categories Card */}
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('all')}
            className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
              selectedCategoryFilter === 'all'
                ? 'bg-[#F1F8E8] border-[#6CAE14] shadow-xs ring-1 ring-[#6CAE14]'
                : 'bg-[#F8F7F5] border-[#EDE5E1] hover:border-[#6CAE14]/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5B58]">Catalog</span>
              {selectedCategoryFilter === 'all' && (
                <span className="w-2 h-2 rounded-full bg-[#6CAE14]" />
              )}
            </div>
            <p className="font-bold text-xs text-[#1A1512] mt-1 truncate">All Categories</p>
            <div className="mt-2 flex items-baseline justify-between text-[11px]">
              <span className="text-[#6B5B58]">{products.length} items</span>
              <span className="font-bold text-[#6CAE14]">{totalStockUnits} pcs</span>
            </div>
          </button>

          {/* Each Category Card */}
          {categoryStats.map((cat) => {
            const isSelected = selectedCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryFilter(isSelected ? 'all' : cat.id)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#F1F8E8] border-[#6CAE14] shadow-xs ring-1 ring-[#6CAE14]'
                    : 'bg-[#F8F7F5] border-[#EDE5E1] hover:border-[#6CAE14]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#6B5B58] font-medium truncate max-w-[75%]">
                    {cat.productCount} {cat.productCount === 1 ? 'item' : 'items'}
                  </span>
                  {cat.outOfStockCount > 0 ? (
                    <span className="w-2 h-2 rounded-full bg-red-500" title={`${cat.outOfStockCount} out of stock`} />
                  ) : cat.lowStockCount > 0 ? (
                    <span className="w-2 h-2 rounded-full bg-amber-500" title={`${cat.lowStockCount} low stock`} />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#7A9C78]" title="Stock healthy" />
                  )}
                </div>
                <p className="font-bold text-xs text-[#1A1512] mt-1 truncate" title={cat.name}>
                  {cat.name}
                </p>
                <div className="mt-2 flex items-baseline justify-between text-[11px]">
                  <span className="text-[#6B5B58]">Stock:</span>
                  <span className={`font-bold ${cat.totalUnits === 0 ? 'text-red-600' : 'text-[#1A1512]'}`}>
                    {cat.totalUnits} pcs
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Quick Filters Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#EDE5E1]">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#9B8A86] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by title, SKU, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-[#F8F7F5] border border-transparent rounded-xl text-xs text-[#1A1512] placeholder-[#9B8A86] focus:border-[#6CAE14] focus:bg-white focus:outline-none transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B8A86] hover:text-[#1A1512]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Stock Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap w-full lg:w-auto">
          <span className="text-xs text-[#6B5B58] font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#9B8A86]" /> Stock:
          </span>
          <button
            type="button"
            onClick={() => setStockFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              stockFilter === 'all'
                ? 'bg-[#1A1512] text-white'
                : 'bg-[#F8F7F5] text-[#6B5B58] hover:bg-[#EDE5E1]'
            }`}
          >
            All ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setStockFilter('instock')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              stockFilter === 'instock'
                ? 'bg-[#7A9C78] text-white'
                : 'bg-[#F8F7F5] text-[#7A9C78] hover:bg-[#EAF3E9]'
            }`}
          >
            In Stock ({totalInStock})
          </button>
          <button
            type="button"
            onClick={() => setStockFilter('low')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              stockFilter === 'low'
                ? 'bg-amber-600 text-white'
                : 'bg-[#F8F7F5] text-amber-800 hover:bg-amber-50'
            }`}
          >
            Low Stock ({totalLowStock})
          </button>
          <button
            type="button"
            onClick={() => setStockFilter('out')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              stockFilter === 'out'
                ? 'bg-[#D94040] text-white'
                : 'bg-[#F8F7F5] text-[#D94040] hover:bg-red-50'
            }`}
          >
            Out of Stock ({totalOutOfStock})
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-[#EDE5E1] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#6B5B58]">
            <div className="animate-spin w-6 h-6 border-2 border-[#6CAE14] border-t-transparent rounded-full mx-auto mb-3" />
            Loading catalog data...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6B5B58]">
            <Package className="w-10 h-10 text-[#9B8A86] mx-auto mb-3" />
            <p className="font-semibold text-sm text-[#1A1512]">No products found</p>
            <p className="mt-1">Try adjusting your search criteria or add a new product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EDE5E1] bg-[#F8F7F5] text-[#6B5B58] font-bold">
                  <th className="p-3 pl-4">Product</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Badge</th>
                  <th className="p-3 text-right">Rating</th>
                  <th className="p-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EDEA]">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#F1F8E8]/40 transition-colors">
                    <td className="p-3 pl-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt=""
                          className="w-11 h-11 rounded-lg object-cover bg-[#F8F7F5] border border-[#EDE5E1] shrink-0"
                        />
                        <div className="min-w-0 max-w-xs sm:max-w-md">
                          <p className="font-semibold text-[#1A1512] line-clamp-1">{prod.name}</p>
                          <p className="text-[10px] text-[#9B8A86]">{prod.brand || 'General'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[#6B5B58]">
                      <span className="font-medium text-[#1A1512] block">{prod.categoryName || 'General'}</span>
                      {prod.subCategoryName && (
                        <span className="text-[10px] text-[#9B8A86] block">↳ {prod.subCategoryName}</span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-[#1A1512]">
                      <span>{formatPrice(prod.price)}</span>
                      {prod.originalPrice && (
                        <span className="text-[10px] text-[#9B8A86] line-through block">
                          {formatPrice(prod.originalPrice)}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col gap-1.5 min-w-[135px]">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              prod.stock > 10
                                ? 'bg-[#EAF3E9] text-[#7A9C78]'
                                : prod.stock > 0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-[#FBDADA] text-[#D94040]'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                prod.stock > 10 ? 'bg-[#7A9C78]' : prod.stock > 0 ? 'bg-amber-500' : 'bg-[#D94040]'
                              }`}
                            />
                            {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of stock'}
                          </span>
                          {updatingStockId === prod.id && (
                            <span className="animate-spin w-3 h-3 border-2 border-[#6CAE14] border-t-transparent rounded-full" />
                          )}
                        </div>

                        {/* Quick Inline Stepper & Input */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={prod.stock <= 0 || updatingStockId === prod.id}
                            onClick={() => handleInlineStockChange(prod.id, Math.max(0, prod.stock - 1))}
                            className="w-6 h-6 rounded bg-[#F8F7F5] hover:bg-[#EDE5E1] disabled:opacity-40 text-[#1A1512] font-bold text-xs flex items-center justify-center border border-[#EDE5E1] transition-all cursor-pointer"
                            title="Decrease stock by 1"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={editingStockValues[prod.id] !== undefined ? editingStockValues[prod.id] : prod.stock}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              setEditingStockValues((prev) => ({
                                ...prev,
                                [prod.id]: isNaN(val) ? 0 : Math.max(0, val),
                              }));
                            }}
                            onBlur={() => {
                              if (editingStockValues[prod.id] !== undefined && editingStockValues[prod.id] !== prod.stock) {
                                handleInlineStockChange(prod.id, editingStockValues[prod.id]);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur();
                              }
                            }}
                            className="w-14 px-1 py-0.5 text-center bg-white border border-[#EDE5E1] focus:border-[#6CAE14] rounded text-xs font-semibold text-[#1A1512] focus:outline-none transition-all"
                            title="Edit stock directly, press Enter or click away to save"
                          />
                          <button
                            type="button"
                            disabled={updatingStockId === prod.id}
                            onClick={() => handleInlineStockChange(prod.id, prod.stock + 1)}
                            className="w-6 h-6 rounded bg-[#F8F7F5] hover:bg-[#EDE5E1] disabled:opacity-40 text-[#1A1512] font-bold text-xs flex items-center justify-center border border-[#EDE5E1] transition-all cursor-pointer"
                            title="Increase stock by 1"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#6B5B58]">
                      {prod.sku || 'N/A'}
                    </td>
                    <td className="p-3">
                      {prod.badge ? (
                        <span className="inline-flex items-center gap-1 bg-[#6CAE14]/10 text-[#6CAE14] px-2 py-0.5 rounded text-[10px] font-bold">
                          <Sparkles className="w-2.5 h-2.5" />
                          {prod.badge}
                        </span>
                      ) : (
                        <span className="text-[#9B8A86]">-</span>
                      )}
                    </td>
                    <td className="p-3 text-right text-[#F0B840] font-bold">
                      ★ {prod.rating ? prod.rating.toFixed(1) : '5.0'} ({prod.reviewCount || 0})
                    </td>
                    <td className="p-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(prod)}
                          title="Edit Product"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#EDE5E1] bg-[#F8F7F5] hover:bg-[#6CAE14] hover:text-white hover:border-[#6CAE14] text-[#1A1512] font-semibold transition-all shadow-xs cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          title="Delete Product"
                          className="p-1.5 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-600 hover:text-white text-red-600 transition-all shadow-xs cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto border border-[#EDE5E1] shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex items-center justify-between border-b border-[#EDE5E1] pb-3">
              <div>
                <h3 className="section-title text-xl text-[#1A1512]">Edit Existing Product</h3>
                <p className="text-[11px] text-[#6B5B58] mt-0.5">ID: {editingProduct.id}</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 text-[#6B5B58] hover:text-[#1A1512] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} noValidate className="space-y-3.5 text-xs">
              {/* Product Title */}
              <div>
                <label className="block font-semibold text-[#1A1512] mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Natural Organic Wild Forest Honey"
                  className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] font-semibold focus:outline-none focus:border-[#6CAE14]"
                />
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Department / Category</label>
                  <select
                    value={editCategoryId}
                    onChange={(e) => {
                      setEditCategoryId(e.target.value);
                      setEditSubCategoryId('');
                    }}
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-[#1A1512]">Subcategory</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomSubEdit(!isCustomSubEdit);
                        if (!isCustomSubEdit) setCustomSubNameEdit('');
                      }}
                      className="text-[10px] text-[#6CAE14] hover:text-[#5B960E] hover:underline font-bold cursor-pointer"
                    >
                      {isCustomSubEdit ? '← Choose list' : '+ Type new'}
                    </button>
                  </div>
                  {isCustomSubEdit ? (
                    <input
                      type="text"
                      value={customSubNameEdit}
                      onChange={(e) => setCustomSubNameEdit(e.target.value)}
                      placeholder="Type new subcategory..."
                      className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] placeholder-[#9B8A86] focus:outline-none focus:border-[#6CAE14]"
                    />
                  ) : (
                    <select
                      value={editSubCategoryId}
                      onChange={(e) => setEditSubCategoryId(e.target.value)}
                      className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                    >
                      <option value="">-- None / General --</option>
                      {activeCategoryForEdit?.subCategories?.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Price, Regular Price, Stock */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Selling Price (৳) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="850"
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 font-bold text-[#6CAE14] focus:outline-none focus:border-[#6CAE14]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Regular Price (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={editOriginalPrice}
                    onChange={(e) => setEditOriginalPrice(e.target.value)}
                    placeholder="1200"
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#6B5B58] focus:outline-none focus:border-[#6CAE14]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Stock Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    placeholder="50"
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  />
                </div>
              </div>

              {/* SKU & Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">SKU / Code</label>
                  <input
                    type="text"
                    value={editSku}
                    onChange={(e) => setEditSku(e.target.value)}
                    placeholder="e.g. HONEY-500"
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 font-mono text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Highlight Badge</label>
                  <input
                    type="text"
                    value={editBadge}
                    onChange={(e) => setEditBadge(e.target.value)}
                    placeholder="e.g. 100% Pure, Best Value"
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  />
                </div>
              </div>

              {/* Image Input (Device & Link) */}
              <ImageUploadPicker
                label="Product Image (পণ্যের ছবি)"
                value={editImage}
                onChange={setEditImage}
              />

              {/* Description */}
              <div>
                <label className="block font-semibold text-[#1A1512] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Detailed product highlights, specifications, benefits..."
                  className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl p-3 text-[#1A1512] focus:outline-none focus:border-[#6CAE14] resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDE5E1]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#EDE5E1] text-[#6B5B58] hover:bg-[#F8F7F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-[#6CAE14] hover:bg-[#5B960E] disabled:opacity-50 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  {isUpdating ? 'Saving Changes...' : 'Save Product Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto border border-[#EDE5E1] shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex items-center justify-between border-b border-[#EDE5E1] pb-3">
              <h3 className="section-title text-xl text-[#1A1512]">Add New Product</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-[#6B5B58] hover:text-[#1A1512] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#1A1512] mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Natural Organic Honey 500g"
                  className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Department / Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      setSubCategoryId('');
                    }}
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-[#1A1512]">Subcategory</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomSubAdd(!isCustomSubAdd);
                        if (!isCustomSubAdd) setCustomSubNameAdd('');
                      }}
                      className="text-[10px] text-[#6CAE14] hover:text-[#5B960E] hover:underline font-bold cursor-pointer"
                    >
                      {isCustomSubAdd ? '← Choose list' : '+ Type new'}
                    </button>
                  </div>
                  {isCustomSubAdd ? (
                    <input
                      type="text"
                      value={customSubNameAdd}
                      onChange={(e) => setCustomSubNameAdd(e.target.value)}
                      placeholder="Type new subcategory..."
                      className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] placeholder-[#9B8A86] focus:outline-none focus:border-[#6CAE14]"
                    />
                  ) : (
                    <select
                      value={subCategoryId}
                      onChange={(e) => setSubCategoryId(e.target.value)}
                      className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                    >
                      <option value="">-- None / General --</option>
                      {activeCategoryForAdd?.subCategories?.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Selling Price (৳) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1850"
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Regular Price (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="2200"
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">SKU / Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. HONEY-001"
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Badge</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. Bestseller, 100% Pure"
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  />
                </div>
              </div>

              {/* Image Input (Device & Link) */}
              <ImageUploadPicker
                label="Product Image (পণ্যের ছবি)"
                value={image}
                onChange={setImage}
                required
              />

              <div>
                <label className="block font-semibold text-[#1A1512] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed product highlights, specifications, instructions..."
                  className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl p-3 text-[#1A1512] focus:outline-none focus:border-[#6CAE14] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EDE5E1]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#EDE5E1] text-[#6B5B58] hover:bg-[#F8F7F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#6CAE14] hover:bg-[#5B960E] text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <ExportProductsModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        products={products}
        categories={categories}
      />
    </div>
  );
}
