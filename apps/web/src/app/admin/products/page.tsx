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
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Eye,
} from 'lucide-react';
import { ProductItem, CategoryItem } from '@/lib/types';
import { formatPrice, parseRobustPrice } from '@/lib/formatters';
import { INITIAL_CATEGORIES } from '@/lib/sample-data';
import { useToast } from '@/context/toast-context';
import ImageUploadPicker from '@/components/admin/ImageUploadPicker';
import ProductImageGalleryPicker from '@/components/admin/ProductImageGalleryPicker';
import ExportProductsModal from '@/components/admin/ExportProductsModal';

export default function AdminProductsPage() {
  const { success, error } = useToast();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Multi-Category states
  const [editSelectedCategories, setEditSelectedCategories] = useState<string[]>([]);
  const [customNewCategoryEdit, setCustomNewCategoryEdit] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customNewCategoryAdd, setCustomNewCategoryAdd] = useState('');

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
  const [editImages, setEditImages] = useState<string[]>([]);
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
  const [image, setImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Table Quick View Modal State
  const [tablePreviewImages, setTablePreviewImages] = useState<string[] | null>(null);
  const [tablePreviewIndex, setTablePreviewIndex] = useState(0);
  const [tablePreviewTitle, setTablePreviewTitle] = useState('');

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
      const res = await fetch('/api/products?includeInactive=true');
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const allCategoryNames = useMemo(() => {
    const set = new Set<string>();
    categories.forEach((c) => set.add(c.name));
    products.forEach((p) => {
      if (Array.isArray(p.categories)) {
        p.categories.forEach((cat) => set.add(cat));
      } else if (p.categoryName) {
        set.add(p.categoryName);
      }
    });
    return Array.from(set);
  }, [categories, products]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'jawata_products_last_synced') {
        fetchProducts();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
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
    const initialImages = prod.images && prod.images.length > 0
      ? [...prod.images]
      : prod.image
      ? [prod.image]
      : [];
    setEditImages(initialImages);
    setEditDescription(prod.description || '');

    const initialCats = Array.isArray(prod.categories) && prod.categories.length > 0
      ? [...prod.categories]
      : prod.categoryName
      ? [prod.categoryName]
      : [categories[0]?.name || 'General'];
    setEditSelectedCategories(initialCats);
    setCustomNewCategoryEdit('');
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editName.trim()) {
      error('Product title is required');
      return;
    }

    const parsedPrice = parseRobustPrice(editPrice);
    if (parsedPrice === null || parsedPrice <= 0) {
      error('দয়া করে একটি সঠিক ও ইতিবাচক মূল্য লিখুন (যেমন: 1200 বা ১২০০)। মূল্য ০ বা খালি রাখা যাবে না।');
      return;
    }

    if (editSelectedCategories.length === 0) {
      error('অন্তত একটি ক্যাটাগরি অবশ্যই নির্বাচন করতে হবে (At least one category is required)');
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

      const cleanImages = editImages.filter((img) => img && img.trim().length > 0);
      const primaryImage = cleanImages[0] || editImage.trim() || undefined;

      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct.id,
          name: editName.trim(),
          categoryId: editCategoryId,
          categoryName: selectedCat?.name,
          categorySlug: selectedCat?.slug,
          categories: editSelectedCategories,
          subCategoryId: targetSubId,
          subCategoryName: targetSubName,
          subCategorySlug: targetSubSlug,
          price: parsedPrice,
          originalPrice: editOriginalPrice ? (parseRobustPrice(editOriginalPrice) || undefined) : undefined,
          stock: Number(editStock) || 0,
          sku: editSku.trim() || undefined,
          badge: editBadge.trim() || undefined,
          image: primaryImage,
          images: cleanImages.length > 0 ? cleanImages : undefined,
          description: editDescription.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update product');

      try {
        localStorage.setItem('jawata_products_last_synced', Date.now().toString());
      } catch {}

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

      try {
        localStorage.setItem('jawata_products_last_synced', Date.now().toString());
      } catch {}

      success(`Product "${prodName.slice(0, 22)}..." deleted successfully`);
      fetchProducts();
    } catch (err: any) {
      error(err.message);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Product name is required');
      return;
    }

    const parsedPrice = parseRobustPrice(price);
    if (parsedPrice === null || parsedPrice <= 0) {
      error('দয়া করে একটি সঠিক ও ইতিবাচক মূল্য লিখুন (যেমন: 1200 বা ১২০০)। মূল্য ০ বা খালি রাখা যাবে না।');
      return;
    }

    if (selectedCategories.length === 0) {
      error('অন্তত একটি ক্যাটাগরি অবশ্যই নির্বাচন করতে হবে (At least one category is required)');
      return;
    }

    const cat = categories.find((c) => c.id === categoryId);
    const catsToSave = selectedCategories;

    setIsSubmitting(true);
    try {
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

      const cleanImages = images.filter((img) => img && img.trim().length > 0);
      const primaryImage = cleanImages[0] || image || '';

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          categoryId,
          categoryName: cat?.name,
          categorySlug: cat?.slug,
          categories: catsToSave,
          subCategoryId: targetSubId,
          subCategoryName: targetSubName,
          subCategorySlug: targetSubSlug,
          price: parsedPrice,
          originalPrice: originalPrice ? (parseRobustPrice(originalPrice) || undefined) : undefined,
          stock: Number(stock) || 50,
          sku: sku || `SKU-${Date.now()}`,
          badge: badge || undefined,
          image: primaryImage,
          images: cleanImages.length > 0 ? cleanImages : primaryImage ? [primaryImage] : [],
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add product');

      try {
        localStorage.setItem('jawata_products_last_synced', Date.now().toString());
      } catch {}

      success('New product added to catalog successfully!');
      setShowAddModal(false);
      setName('');
      setPrice('');
      setOriginalPrice('');
      setDescription('');
      setImage('');
      setImages([]);
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
      const q = search.toLowerCase().trim();
      const isHoney = q === 'modhu' || q === 'madhu' || q === 'honey' || q.includes('মধু');
      const matchSearch =
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
        (p.subCategoryName && p.subCategoryName.toLowerCase().includes(q)) ||
        (Array.isArray(p.categories) && p.categories.some((c) => c.toLowerCase().includes(q))) ||
        (isHoney && (
          p.slug.includes('honey') ||
          p.slug.includes('modhu') ||
          p.name.includes('মধু') ||
          p.name.toLowerCase().includes('honey') ||
          p.name.toLowerCase().includes('modhu')
        ));
      if (!matchSearch) return false;
    }

    if (selectedCategoryFilter !== 'all') {
      const selectedCatObj = categories.find((c) => c.id === selectedCategoryFilter);
      const selectedCatName = selectedCatObj?.name.toLowerCase();
      const matchCat =
        p.categoryId === selectedCategoryFilter ||
        p.categorySlug === selectedCategoryFilter ||
        (p.categoryName &&
          selectedCatName === p.categoryName.toLowerCase()) ||
        (Array.isArray(p.categories) &&
          selectedCatName &&
          p.categories.some((c) => c.toLowerCase() === selectedCatName));
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
            onClick={() => {
              const defaultCat = categories.find((c) => c.id === categoryId)?.name || categories[0]?.name || 'General';
              setSelectedCategories([defaultCat]);
              setCustomNewCategoryAdd('');
              setShowAddModal(true);
            }}
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
                        <button
                          type="button"
                          onClick={() => {
                            const allImgs = prod.images && prod.images.length > 0
                              ? prod.images
                              : prod.image
                              ? [prod.image]
                              : [];
                            if (allImgs.length > 0) {
                              setTablePreviewImages(allImgs);
                              setTablePreviewIndex(0);
                              setTablePreviewTitle(prod.name);
                            }
                          }}
                          className="relative group shrink-0 rounded-xl overflow-hidden border border-[#EDE5E1] hover:border-[#6CAE14] focus:outline-none focus:ring-2 focus:ring-[#6CAE14]/40 transition-all cursor-pointer"
                          title="ছবি বড় করে দেখতে ক্লিক করুন (Click to view full HD)"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover bg-[#F8F7F5] transition-transform duration-200 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                            <Maximize2 className="w-4 h-4" />
                          </div>
                          {prod.images && prod.images.length > 1 && (
                            <span className="absolute bottom-0.5 right-0.5 bg-[#0d1f61] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs leading-none">
                              +{prod.images.length}
                            </span>
                          )}
                        </button>
                        <div className="min-w-0 max-w-xs sm:max-w-md">
                          <p className="font-semibold text-[#1A1512] line-clamp-1">{prod.name}</p>
                          <p className="text-[10px] text-[#9B8A86]">{prod.brand || 'General'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[#6B5B58]">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(prod.categories) && prod.categories.length > 0 ? (
                          prod.categories.map((c, i) => (
                            <span key={i} className="bg-orange-50 text-[#fd6b03] border border-orange-200 text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
                              {c}
                            </span>
                          ))
                        ) : (
                          <span className="font-medium text-[#1A1512] block">{prod.categoryName || 'General'}</span>
                        )}
                      </div>
                      {prod.subCategoryName && (
                        <span className="text-[10px] text-[#9B8A86] block mt-0.5">↳ {prod.subCategoryName}</span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-[#1A1512]">
                      <span>{formatPrice(prod.price)}</span>
                      {Boolean(prod.originalPrice && prod.originalPrice > prod.price) && (
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

              {/* Primary Department & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Primary Department</label>
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

              {/* Multi-Category Checkbox Selector */}
              <div>
                <label className="block font-semibold text-[#1A1512] mb-1">
                  Product Categories (একাধিক নির্বাচন করুন) *
                </label>
                <div className="max-h-32 overflow-y-auto border border-[#EDE5E1] rounded-xl p-2.5 bg-[#F8F7F5] grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allCategoryNames.map((catName) => (
                    <label key={catName} className="flex items-center gap-1.5 text-xs font-medium cursor-pointer text-[#1A1512]">
                      <input
                        type="checkbox"
                        checked={editSelectedCategories.includes(catName)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditSelectedCategories([...editSelectedCategories, catName]);
                          } else {
                            setEditSelectedCategories(editSelectedCategories.filter((c) => c !== catName));
                          }
                        }}
                        className="rounded border-[#EDE5E1] text-[#6CAE14] focus:ring-[#6CAE14]"
                      />
                      <span className="truncate">{catName}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={customNewCategoryEdit}
                    onChange={(e) => setCustomNewCategoryEdit(e.target.value)}
                    placeholder="+ নতুন ক্যাটাগরি তৈরি করুন..."
                    className="flex-1 bg-white border border-[#EDE5E1] rounded-lg px-2.5 py-1 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (customNewCategoryEdit.trim()) {
                          const newCat = customNewCategoryEdit.trim();
                          if (!editSelectedCategories.includes(newCat)) {
                            setEditSelectedCategories([...editSelectedCategories, newCat]);
                          }
                          setCustomNewCategoryEdit('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customNewCategoryEdit.trim()) {
                        const newCat = customNewCategoryEdit.trim();
                        if (!editSelectedCategories.includes(newCat)) {
                          setEditSelectedCategories([...editSelectedCategories, newCat]);
                        }
                        setCustomNewCategoryEdit('');
                      }
                    }}
                    className="px-2.5 py-1 bg-white border border-[#EDE5E1] hover:border-[#6CAE14] text-xs font-semibold rounded-lg text-[#1A1512] cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Price, Regular Price, Stock */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Selling Price (৳) *</label>
                  <input
                    type="text"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="1200 বা ১২০০"
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 font-bold text-[#6CAE14] focus:outline-none focus:border-[#6CAE14]"
                  />
                  <span className="text-[10px] text-[#9B8A86] block mt-0.5">বাংলা/ইংরেজি ও কমা গ্রহণযোগ্য</span>
                </div>
                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Regular Price (৳)</label>
                  <input
                    type="text"
                    value={editOriginalPrice}
                    onChange={(e) => setEditOriginalPrice(e.target.value)}
                    placeholder="1500"
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

              {/* Image Input (Multiple Images & HD Zoom Preview) */}
              <ProductImageGalleryPicker
                label="Product Images (একাধিক ছবি যোগ ও বড় করে দেখার সুবিধা)"
                images={editImages}
                onChange={(imgs) => {
                  setEditImages(imgs);
                  setEditImage(imgs[0] || '');
                }}
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

              {/* Multi-Category Checkbox Selector */}
              <div>
                <label className="block font-semibold text-[#1A1512] mb-1">
                  Product Categories (একাধিক নির্বাচন করুন) *
                </label>
                <div className="max-h-32 overflow-y-auto border border-[#EDE5E1] rounded-xl p-2.5 bg-[#F8F7F5] grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allCategoryNames.map((catName) => (
                    <label key={catName} className="flex items-center gap-1.5 text-xs font-medium cursor-pointer text-[#1A1512]">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(catName)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, catName]);
                          } else {
                            setSelectedCategories(selectedCategories.filter((c) => c !== catName));
                          }
                        }}
                        className="rounded border-[#EDE5E1] text-[#6CAE14] focus:ring-[#6CAE14]"
                      />
                      <span className="truncate">{catName}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={customNewCategoryAdd}
                    onChange={(e) => setCustomNewCategoryAdd(e.target.value)}
                    placeholder="+ নতুন ক্যাটাগরি তৈরি করুন..."
                    className="flex-1 bg-white border border-[#EDE5E1] rounded-lg px-2.5 py-1 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (customNewCategoryAdd.trim()) {
                          const newCat = customNewCategoryAdd.trim();
                          if (!selectedCategories.includes(newCat)) {
                            setSelectedCategories([...selectedCategories, newCat]);
                          }
                          setCustomNewCategoryAdd('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customNewCategoryAdd.trim()) {
                        const newCat = customNewCategoryAdd.trim();
                        if (!selectedCategories.includes(newCat)) {
                          setSelectedCategories([...selectedCategories, newCat]);
                        }
                        setCustomNewCategoryAdd('');
                      }
                    }}
                    className="px-2.5 py-1 bg-white border border-[#EDE5E1] hover:border-[#6CAE14] text-xs font-semibold rounded-lg text-[#1A1512] cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Selling Price (৳) *</label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1200 বা ১২০০"
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 font-bold text-[#6CAE14] focus:outline-none focus:border-[#6CAE14]"
                  />
                  <span className="text-[10px] text-[#9B8A86] block mt-0.5">বাংলা/ইংরেজি ও কমা গ্রহণযোগ্য</span>
                </div>

                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Regular Price (৳)</label>
                  <input
                    type="text"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="1500"
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#6B5B58] focus:outline-none focus:border-[#6CAE14]"
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

              {/* Image Input (Multiple Images & HD Zoom Preview) */}
              <ProductImageGalleryPicker
                label="Product Images (একাধিক ছবি যোগ ও বড় করে দেখার সুবিধা)"
                images={images}
                onChange={(imgs) => {
                  setImages(imgs);
                  setImage(imgs[0] || '');
                }}
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

      {/* Table Image Fullscreen Lightbox Modal */}
      {tablePreviewImages && tablePreviewImages.length > 0 && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none animate-fade-in"
          onClick={() => setTablePreviewImages(null)}
        >
          {/* Header Bar */}
          <div
            className="w-full max-w-4xl flex items-center justify-between text-white/90 pb-3 border-b border-white/10 mb-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 truncate max-w-[70%]">
              <span className="font-bold text-sm truncate text-white">
                {tablePreviewTitle || 'প্রোডাক্টের ছবি প্রিভিউ'}
              </span>
              <span className="text-xs text-white/70 bg-white/15 px-2.5 py-0.5 rounded-full shrink-0 font-medium">
                ছবি {tablePreviewIndex + 1} / {tablePreviewImages.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={tablePreviewImages[tablePreviewIndex]}
                target="_blank"
                rel="noreferrer"
                download
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all text-xs font-semibold flex items-center gap-1.5"
                title="আসল ছবি খুলুন বা ডাউনলোড করুন"
              >
                <span>আসল রেজোলিউশন</span>
              </a>
              <button
                type="button"
                onClick={() => setTablePreviewImages(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title="বন্ধ করুন (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Stage Image */}
          <div
            className="relative flex items-center justify-center max-w-4xl max-h-[75vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={tablePreviewImages[tablePreviewIndex]}
              alt={`Product preview ${tablePreviewIndex + 1}`}
              className="max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 bg-black/40"
            />

            {/* Left Prev Arrow */}
            {tablePreviewImages.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setTablePreviewIndex((prev) =>
                    prev === 0 ? tablePreviewImages.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer"
                title="আগের ছবি"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Right Next Arrow */}
            {tablePreviewImages.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setTablePreviewIndex((prev) =>
                    prev === tablePreviewImages.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer"
                title="পরের ছবি"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails */}
          {tablePreviewImages.length > 1 && (
            <div
              className="flex items-center gap-2 mt-4 max-w-4xl overflow-x-auto p-1.5 rounded-2xl bg-black/50 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {tablePreviewImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTablePreviewIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    tablePreviewIndex === idx
                      ? 'border-[#6CAE14] ring-2 ring-[#6CAE14]/40 scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
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
