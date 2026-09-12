'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { ProductItem, CategoryItem } from '@/lib/types';
import { formatPrice } from '@/lib/formatters';
import { INITIAL_CATEGORIES } from '@/lib/sample-data';
import { useToast } from '@/context/toast-context';

export default function AdminProductsPage() {
  const { success, error } = useToast();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

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

  // Add Product Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(INITIAL_CATEGORIES[0]?.id || '');
  const [subCategoryId, setSubCategoryId] = useState('');
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
      const selectedSub = selectedCat?.subCategories?.find((s) => s.id === editSubCategoryId);

      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct.id,
          name: editName.trim(),
          categoryId: editCategoryId,
          categoryName: selectedCat?.name,
          categorySlug: selectedCat?.slug,
          subCategoryId: editSubCategoryId || undefined,
          subCategoryName: selectedSub?.name,
          subCategorySlug: selectedSub?.slug,
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
      const sub = cat?.subCategories?.find((s) => s.id === subCategoryId);

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          categoryId,
          categoryName: cat?.name,
          categorySlug: cat?.slug,
          subCategoryId: subCategoryId || undefined,
          subCategoryName: sub?.name,
          subCategorySlug: sub?.slug,
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

  const filteredProducts = products.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(q))
    );
  });

  const activeCategoryForAdd = categories.find((c) => c.id === categoryId);
  const activeCategoryForEdit = categories.find((c) => c.id === editCategoryId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title text-2xl sm:text-3xl text-[#1A1512]">
            Product Catalog ({products.length})
          </h1>
          <p className="text-xs text-[#6B5B58] mt-1">
            Manage your store items, update pricing, categories, stock, and product details.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-[#6CAE14] hover:bg-[#5B960E] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-[#EDE5E1]">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#9B8A86] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by title, SKU, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8F7F5] border border-transparent rounded-xl text-xs text-[#1A1512] placeholder-[#9B8A86] focus:border-[#6CAE14] focus:bg-white focus:outline-none transition-all"
          />
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
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.stock > 10
                            ? 'bg-[#EAF3E9] text-[#7A9C78]'
                            : prod.stock > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-[#FBDADA] text-[#D94040]'
                        }`}
                      >
                        {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of stock'}
                      </span>
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
                  <label className="block font-semibold text-[#1A1512] mb-1">Subcategory</label>
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

              {/* Image URL & Preview */}
              <div>
                <label className="block font-semibold text-[#1A1512] mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  />
                  {editImage && (
                    <img
                      src={editImage}
                      alt="Preview"
                      className="w-9 h-9 rounded-lg object-cover border border-[#EDE5E1] shrink-0"
                    />
                  )}
                </div>
              </div>

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
                  <label className="block font-semibold text-[#1A1512] mb-1">Subcategory</label>
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

              <div>
                <label className="block font-semibold text-[#1A1512] mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="flex-1 bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  />
                  {image && (
                    <img
                      src={image}
                      alt="Preview"
                      className="w-9 h-9 rounded-lg object-cover border border-[#EDE5E1] shrink-0"
                    />
                  )}
                </div>
              </div>

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
    </div>
  );
}
