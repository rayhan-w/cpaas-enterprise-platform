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
} from 'lucide-react';
import { ProductItem } from '@/lib/types';
import { formatPrice } from '@/lib/formatters';
import { INITIAL_CATEGORIES } from '@/lib/sample-data';
import { useToast } from '@/context/toast-context';

export default function AdminProductsPage() {
  const { success, error } = useToast();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editOriginalPrice, setEditOriginalPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const openEditModal = (prod: ProductItem) => {
    setEditingProduct(prod);
    setEditPrice(String(prod.price));
    setEditOriginalPrice(prod.originalPrice ? String(prod.originalPrice) : '');
    setEditStock(String(prod.stock));
    setEditBadge(prod.badge || '');
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsUpdating(true);
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct.id,
          price: Number(editPrice) || 0,
          originalPrice: editOriginalPrice ? Number(editOriginalPrice) : undefined,
          stock: Number(editStock) || 0,
          badge: editBadge || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      success('Updated price & details for ' + editingProduct.name.slice(0, 20) + '...');
      setEditingProduct(null);
      fetchProducts();
    } catch (err: any) {
      error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // New Product Form
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(INITIAL_CATEGORIES[0].id);
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [sku, setSku] = useState('');
  const [badge, setBadge] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      // Handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      error('Product name and price are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const cat = INITIAL_CATEGORIES.find((c) => c.id === categoryId);
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          categoryId,
          categoryName: cat?.name,
          categorySlug: cat?.slug,
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
      (p.sku && p.sku.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title text-2xl sm:text-3xl text-[#1A1512]">
            Product Catalog ({products.length})
          </h1>
          <p className="text-xs text-[#6B5B58] mt-1">
            Manage multi-category inventory, update stock, pricing, and showcase badges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="bg-white border border-[#EDE5E1] rounded-xl px-3 py-2 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14] w-52"
          />

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#6CAE14] hover:bg-[#5B960E] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#EDE5E1] p-6 sm:p-8 shadow-elevation-1 space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#9B8A86]">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#9B8A86]">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F7F5] text-[#9B8A86] uppercase text-[10px] tracking-wider border-y border-[#EDE5E1]">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock Status</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Badge</th>
                  <th className="p-3 text-right">Rating</th>
                    <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EDEA]">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#F1F8E8]/40 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-[#F8F7F5] border border-[#EDE5E1] shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1A1512] line-clamp-1">{prod.name}</p>
                          <p className="text-[10px] text-[#9B8A86]">{prod.brand || 'General'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[#6B5B58]">{prod.categoryName || 'General'}</td>
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
                        <span className="bg-[#F1F8E8] text-[#6CAE14] font-bold text-[10px] px-2 py-0.5 rounded-full border border-[#6CAE14]/20">
                          {prod.badge}
                        </span>
                      ) : (
                        <span className="text-[#9B8A86]">-</span>
                      )}
                    </td>
                    <td className="p-3 text-right text-[#F0B840] font-bold">
                      ★ {prod.rating.toFixed(1)} ({prod.reviewCount})
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
    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EDE5E1] shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#EDE5E1] pb-3">
        <div>
          <h3 className="section-title text-lg text-[#1A1512]">Update Product Pricing</h3>
          <p className="text-[11px] text-[#6B5B58] line-clamp-1">{editingProduct.name}</p>
        </div>
        <button
          onClick={() => setEditingProduct(null)}
          className="p-1.5 text-[#6B5B58] hover:text-[#1A1512]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleUpdateProduct} className="space-y-3.5 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#1A1512] mb-1">Selling Price (৳) *</label>
            <input
              type="number"
              required
              min="0"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              placeholder="e.g. 850"
              className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl p-2.5 font-bold text-[#6CAE14] focus:outline-none focus:border-[#6CAE14]"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#1A1512] mb-1">Regular (৳)</label>
            <input
              type="number"
              min="0"
              value={editOriginalPrice}
              onChange={(e) => setEditOriginalPrice(e.target.value)}
              placeholder="e.g. 1200"
              className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl p-2.5 text-[#6B5B58] focus:outline-none focus:border-[#6CAE14]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#1A1512] mb-1">Stock Quantity</label>
            <input
              type="number"
              min="0"
              value={editStock}
              onChange={(e) => setEditStock(e.target.value)}
              className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl p-2.5 focus:outline-none focus:border-[#6CAE14]"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#1A1512] mb-1">Highlight Badge</label>
            <input
              type="text"
              value={editBadge}
              onChange={(e) => setEditBadge(e.target.value)}
              placeholder="e.g. Hot Deal / Popular"
              className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl p-2.5 focus:outline-none focus:border-[#6CAE14]"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditingProduct(null)}
            className="flex-1 py-2.5 px-3 rounded-xl border border-[#EDE5E1] text-[#6B5B58] hover:bg-[#F8F7F5] font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#6CAE14] hover:bg-[#5B960E] disabled:opacity-50 text-white font-bold transition-colors shadow-sm"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
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
                className="p-1.5 text-[#6B5B58] hover:text-[#1A1512]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1A1512] mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pampers Premium Diaper Pants L"
                  className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Category Department</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  >
                    {INITIAL_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">SKU / Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. PAM-L-54"
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Price (BDT) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1850"
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Regular Price</label>
                  <input
                    type="number"
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
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Image URL</label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Badge</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. Bestseller, Eid Special"
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1A1512] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed product specifications, origins, and instructions..."
                  className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl p-3 text-[#1A1512] focus:outline-none focus:border-[#6CAE14] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EDE5E1]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#EDE5E1] text-[#6B5B58]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#6CAE14] hover:bg-[#5B960E] text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-sm"
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
