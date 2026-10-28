'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  Package,
  ArrowRight,
  Boxes,
} from 'lucide-react';
import { ProductGroup, ProductItem, CategoryItem } from '@/lib/types';
import { formatPrice } from '@/lib/formatters';
import { useToast } from '@/context/toast-context';
import ImageUploadPicker from '@/components/admin/ImageUploadPicker';

export default function AdminGroupsPage() {
  const { success, error } = useToast();
  const [groups, setGroups] = useState<ProductGroup[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ProductGroup | null>(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation
  const [deleteTarget, setDeleteTarget] = useState<ProductGroup | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [groupsRes, prodsRes, catsRes] = await Promise.all([
        fetch('/api/admin/groups'),
        fetch('/api/products?limit=300&includeInactive=true'),
        fetch('/api/categories'),
      ]);

      const groupsData = await groupsRes.json();
      const prodsData = await prodsRes.json();
      const catsData = await catsRes.json();

      setGroups(groupsData.groups || []);
      setProducts(prodsData.products || []);
      setCategories(catsData.categories || []);
    } catch (err: any) {
      error('Failed to load groups data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingGroup(null);
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormImage('');
    setFormCategoryId(categories[0]?.id || '');
    setSelectedProductIds([]);
    setProductSearch('');
    setShowModal(true);
  };

  const openEditModal = (group: ProductGroup) => {
    setEditingGroup(group);
    setFormName(group.name);
    setFormSlug(group.slug);
    setFormDescription(group.description || '');
    setFormImage(group.image || '');
    setFormCategoryId(group.categoryId || '');
    setSelectedProductIds([...(group.productIds || [])]);
    setProductSearch('');
    setShowModal(true);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      error('Please enter a group name');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCategory = categories.find((c) => c.id === formCategoryId);
      const payload: Partial<ProductGroup> = {
        name: formName.trim(),
        slug: formSlug.trim() || undefined,
        description: formDescription.trim(),
        image: formImage || undefined,
        categoryId: formCategoryId || undefined,
        categoryName: selectedCategory?.name || undefined,
        categorySlug: selectedCategory?.slug || undefined,
        categories: selectedCategory?.name ? [selectedCategory.name] : [],
        productIds: selectedProductIds,
      };

      if (editingGroup) {
        const res = await fetch('/api/admin/groups', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingGroup.id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update group');
        success(`Group "${formName}" updated successfully`);
      } else {
        const res = await fetch('/api/admin/groups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create group');
        success(`Group "${formName}" created successfully`);
      }

      setShowModal(false);
      fetchData();
    } catch (err: any) {
      error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/groups?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete group');
      success(`Group "${deleteTarget.name}" deleted. Member products unassigned.`);
      setDeleteTarget(null);
      fetchData();
    } catch (err: any) {
      error(err.message || 'Deletion failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailableProducts = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const term = productSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.sku && p.sku.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE5E1]">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="w-6 h-6 text-[#FD6B03]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#0D1F61]">
              Product Groups &amp; Collections
            </h1>
          </div>
          <p className="text-xs text-[#6B5B58] mt-1">
            Group related styles/colors into a single collection card with dedicated /group/&lt;slug&gt; pages.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D1F61] hover:bg-[#162D85] text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#FD6B03]" />
          <span>Create New Group</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8A86]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search groups by name or slug..."
          className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-[#EDE5E1] text-xs text-[#1A1512] focus:outline-none focus:border-[#FD6B03]"
        />
      </div>

      {/* Groups List Table / Cards */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#EDE5E1] p-12 text-center text-xs text-[#6B5B58]">
          Loading product groups...
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EDE5E1] p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-[#FD6B03] mx-auto stroke-[1.5]" />
          <h3 className="text-sm font-bold text-[#1A1512]">No Product Groups Found</h3>
          <p className="text-xs text-[#6B5B58] max-w-md mx-auto">
            Create a group to combine individual color/style products into a collection card on the storefront!
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D1F61] text-white text-xs font-bold"
          >
            <Plus className="w-4 h-4 text-[#FD6B03]" />
            <span>Create First Group</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => {
            const displayPrice =
              group.minPrice === group.maxPrice
                ? formatPrice(group.minPrice)
                : `${formatPrice(group.minPrice)} – ${formatPrice(group.maxPrice)}`;

            return (
              <div
                key={group.id}
                className="bg-white rounded-2xl border border-[#EDE5E1] p-4 flex flex-col justify-between hover:border-[#FD6B03]/50 transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-xl bg-[#F8F7F5] border border-[#EDE5E1] overflow-hidden shrink-0">
                      <img
                        src={group.image || '/jawata-mart-logo.jpg'}
                        alt={group.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="bg-[#0D1F61] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                          {group.totalStyles || group.productIds?.length || 0} Styles
                        </span>
                        {group.categoryName && (
                          <span className="bg-orange-50 text-[#FD6B03] border border-orange-200 text-[9px] font-semibold px-1.5 py-0.2 rounded">
                            {group.categoryName}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-[#0D1F61] mt-1 truncate">
                        {group.name}
                      </h3>
                      <p className="text-[10px] text-[#6B5B58] font-mono mt-0.5 truncate">
                        /group/{group.slug}
                      </p>
                    </div>
                  </div>

                  {group.description && (
                    <p className="text-[11px] text-[#6B5B58] line-clamp-2 mt-2 leading-relaxed">
                      {group.description}
                    </p>
                  )}

                  <div className="mt-3 pt-2 border-t border-[#EDE5E1] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#6B5B58]">Price Range:</span>
                    <span className="font-bold text-[#0D1F61]">{displayPrice}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EDE5E1] flex items-center justify-between gap-2">
                  <Link
                    href={`/group/${group.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0D1F61] hover:text-[#FD6B03] transition-colors"
                  >
                    <span>View Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(group)}
                      className="p-1.5 rounded-lg hover:bg-[#F8F7F5] text-[#6B5B58] hover:text-[#0D1F61] transition-colors"
                      title="Edit Group"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(group)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-[#6B5B58] hover:text-red-600 transition-colors"
                      title="Delete Group"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#EDE5E1] shadow-2xl w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-[#EDE5E1]">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-[#FD6B03]" />
                <h2 className="text-base font-bold text-[#0D1F61]">
                  {editingGroup ? 'Edit Product Group' : 'Create Product Group'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full hover:bg-[#F8F7F5] text-[#6B5B58]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-[#1A1512] mb-1">
                  Group Name (গ্রুপের নাম) *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Ear Muff Collection"
                  className="w-full px-3 py-2 bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl text-xs text-[#1A1512] focus:outline-none focus:border-[#FD6B03]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1A1512] mb-1">
                    Slug (URL পথ)
                  </label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. ear-muff-collection"
                    className="w-full px-3 py-2 bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl text-xs text-[#1A1512] focus:outline-none focus:border-[#FD6B03]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1512] mb-1">
                    Category (ক্যাটাগরি)
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl text-xs text-[#1A1512] focus:outline-none focus:border-[#FD6B03]"
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1512] mb-1">
                  Thumbnail Image (থাম্বনেইল ছবি)
                </label>
                <ImageUploadPicker
                  value={formImage}
                  onChange={(url) => setFormImage(url)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1512] mb-1">
                  Description (বিবরণ)
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Short description of this product collection..."
                  className="w-full px-3 py-2 bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl text-xs text-[#1A1512] focus:outline-none focus:border-[#FD6B03]"
                />
              </div>

              {/* Product Selector */}
              <div className="border border-[#EDE5E1] rounded-2xl p-4 bg-[#FAFCF7] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#0D1F61] flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-[#FD6B03]" />
                    <span>Select Products in this Group ({selectedProductIds.length} selected)</span>
                  </label>
                  <span className="text-[10px] text-[#6B5B58]">
                    Check items to include
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8A86]" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Filter products to add..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#EDE5E1] rounded-lg text-xs text-[#1A1512] focus:outline-none focus:border-[#FD6B03]"
                  />
                </div>

                <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 divide-y divide-[#EDE5E1]/60">
                  {filteredAvailableProducts.map((p) => {
                    const isChecked = selectedProductIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleProductSelection(p.id)}
                        className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${
                          isChecked ? 'bg-orange-50/60 border border-[#FD6B03]/30' : 'hover:bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent div
                          className="w-4 h-4 rounded text-[#FD6B03] focus:ring-[#FD6B03] cursor-pointer"
                        />
                        <div className="w-9 h-9 rounded-lg bg-white border border-[#EDE5E1] overflow-hidden shrink-0">
                          <img
                            src={p.image || '/jawata-mart-logo.jpg'}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#1A1512] truncate">
                            {p.name}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-[#6B5B58]">
                            <span>SKU: {p.sku || 'N/A'}</span>
                            <span>•</span>
                            <span>৳{p.price}</span>
                            <span>•</span>
                            <span>Stock: {p.stock}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDE5E1]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#EDE5E1] text-xs font-bold text-[#6B5B58] hover:bg-[#F8F7F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#0D1F61] hover:bg-[#162D85] text-white text-xs font-bold transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingGroup ? 'Update Group' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EDE5E1] shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-[#1A1512]">
                Delete Group &ldquo;{deleteTarget.name}&rdquo;?
              </h3>
              <p className="text-xs text-[#6B5B58]">
                Deleting this group will <strong>NOT</strong> delete any products. It will simply unassign them so they appear as individual products.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl border border-[#EDE5E1] text-xs font-bold text-[#6B5B58] hover:bg-[#F8F7F5]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
