'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  X,
  Tag,
  CheckCircle2,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import { CategoryItem, SubCategoryItem } from '@/lib/types';
import { INITIAL_CATEGORIES } from '@/lib/sample-data';
import { useToast } from '@/context/toast-context';
import Link from 'next/link';

export default function AdminCategoriesPage() {
  const { success, error } = useToast();
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);

  // Add Category Modal State
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);

  // Edit Category Modal State
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatSlug, setEditCatSlug] = useState('');
  const [editCatImage, setEditCatImage] = useState('');
  const [editCatDescription, setEditCatDescription] = useState('');
  const [isUpdatingCat, setIsUpdatingCat] = useState(false);

  // Add Subcategory Modal State
  const [activeCatForSub, setActiveCatForSub] = useState<CategoryItem | null>(null);
  const [subCatName, setSubCatName] = useState('');
  const [isAddingSub, setIsAddingSub] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.categories && data.categories.length > 0) {
        setCategories(data.categories);
      }
    } catch {
      // Fallback to current
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- Add Category ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      error('Category name is required');
      return;
    }

    setIsAddingCat(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCatName.trim(),
          slug: newCatSlug.trim() || undefined,
          image: newCatImage.trim() || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop',
          description: newCatDescription.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create category');

      success(`Department "${newCatName.trim()}" created successfully!`);
      setShowAddCatModal(false);
      setNewCatName('');
      setNewCatSlug('');
      setNewCatImage('');
      setNewCatDescription('');
      fetchCategories();
    } catch (err: any) {
      error(err.message);
    } finally {
      setIsAddingCat(false);
    }
  };

  // --- Edit Category ---
  const openEditCategory = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setEditCatName(cat.name);
    setEditCatSlug(cat.slug);
    setEditCatImage(cat.image || '');
    setEditCatDescription(cat.description || '');
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!editCatName.trim()) {
      error('Category name is required');
      return;
    }

    setIsUpdatingCat(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCategory.id,
          name: editCatName.trim(),
          slug: editCatSlug.trim() || undefined,
          image: editCatImage.trim() || undefined,
          description: editCatDescription.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update category');

      success(`Category "${editCatName.trim()}" updated successfully!`);
      setEditingCategory(null);
      fetchCategories();
    } catch (err: any) {
      error(err.message);
    } finally {
      setIsUpdatingCat(false);
    }
  };

  // --- Delete Category ---
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"? All subcategories will also be removed.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete category');

      success(`Category "${name}" deleted successfully!`);
      fetchCategories();
    } catch (err: any) {
      error(err.message);
    }
  };

  // --- Add Subcategory ---
  const handleAddSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCatForSub || !subCatName.trim()) {
      error('Subcategory name is required');
      return;
    }

    setIsAddingSub(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'subcategory',
          categoryId: activeCatForSub.id,
          name: subCatName.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add subcategory');

      success(`Subcategory "${subCatName.trim()}" added to ${activeCatForSub.name}!`);
      setActiveCatForSub(null);
      setSubCatName('');
      fetchCategories();
    } catch (err: any) {
      error(err.message);
    } finally {
      setIsAddingSub(false);
    }
  };

  // --- Delete Subcategory ---
  const handleDeleteSubCategory = async (categoryId: string, subCategoryId: string, subName: string) => {
    if (!window.confirm(`Are you sure you want to delete subcategory "${subName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/categories?categoryId=${categoryId}&subCategoryId=${subCategoryId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete subcategory');

      success(`Subcategory "${subName}" removed!`);
      fetchCategories();
    } catch (err: any) {
      error(err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title text-2xl sm:text-3xl text-[#1A1512]">
            Category & Department Management
          </h1>
          <p className="text-xs text-[#6B5B58] mt-1">
            Organize marketplace departments, create subcategories, and customize storefront navigation.
          </p>
        </div>
        <button
          onClick={() => setShowAddCatModal(true)}
          className="flex items-center justify-center gap-2 bg-[#6CAE14] hover:bg-[#5B960E] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#6B5B58] bg-white rounded-3xl border border-[#EDE5E1]">
          <div className="animate-spin w-6 h-6 border-2 border-[#6CAE14] border-t-transparent rounded-full mx-auto mb-3" />
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="p-12 text-center text-xs text-[#6B5B58] bg-white rounded-3xl border border-[#EDE5E1]">
          <Layers className="w-10 h-10 text-[#9B8A86] mx-auto mb-3" />
          <p className="font-semibold text-sm text-[#1A1512]">No categories created yet</p>
          <p className="mt-1">Click "Add New Category" to create your first department.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl p-6 border border-[#EDE5E1] shadow-elevation-1 flex flex-col justify-between space-y-4 relative group"
            >
              <div>
                {/* Category Header & Controls */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={cat.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop'}
                      alt={cat.name}
                      className="w-12 h-12 rounded-xl object-cover bg-[#F8F7F5] border border-[#EDE5E1] shrink-0"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-[#1A1512] line-clamp-1">{cat.name}</h3>
                      <span className="font-mono text-[10px] text-[#9B8A86]">/{cat.slug}</span>
                    </div>
                  </div>

                  {/* Edit & Delete Category buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditCategory(cat)}
                      title="Edit Category"
                      className="p-1.5 rounded-lg border border-[#EDE5E1] bg-[#F8F7F5] hover:bg-[#6CAE14] hover:text-white hover:border-[#6CAE14] text-[#1A1512] transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      title="Delete Category"
                      className="p-1.5 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-600 hover:text-white text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#6B5B58] leading-relaxed mb-3 line-clamp-2">
                  {cat.description || 'No description provided.'}
                </p>

                {/* Subcategories Section */}
                <div className="space-y-2 pt-3 border-t border-[#F2EDEA]">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase text-[#9B8A86] tracking-wider">
                      Subcategories ({cat.subCategories ? cat.subCategories.length : 0})
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCatForSub(cat);
                        setSubCatName('');
                      }}
                      className="text-[10px] text-[#6CAE14] hover:text-[#5B960E] font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Sub</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 min-h-[32px] items-center">
                    {cat.subCategories && cat.subCategories.length > 0 ? (
                      cat.subCategories.map((sub) => (
                        <span
                          key={sub.id}
                          className="inline-flex items-center gap-1.5 bg-[#F8F7F5] text-[#1A1512] text-[10px] font-semibold pl-2 pr-1.5 py-0.5 rounded-md border border-[#EDE5E1]"
                        >
                          <span>{sub.name}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubCategory(cat.id, sub.id, sub.name)}
                            title={`Delete subcategory "${sub.name}"`}
                            className="text-[#9B8A86] hover:text-red-600 p-0.5 transition-colors cursor-pointer"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-[#9B8A86] italic">No subcategories yet</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[#F2EDEA] flex items-center justify-between text-xs">
                <span className="text-[#6CAE14] font-semibold text-[11px]">Active Department</span>
                <Link
                  href={`/category/${cat.slug}`}
                  target="_blank"
                  className="text-[#6CAE14] hover:underline font-semibold flex items-center gap-1 text-[11px]"
                >
                  <span>View Storefront</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Modal: Add New Category --- */}
      {showAddCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EDE5E1] shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex items-center justify-between border-b border-[#EDE5E1] pb-3">
              <h3 className="section-title text-xl text-[#1A1512]">Add Department / Category</h3>
              <button
                onClick={() => setShowAddCatModal(false)}
                className="p-1.5 text-[#6B5B58] hover:text-[#1A1512] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#1A1512] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    if (!newCatSlug) {
                      setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                    }
                  }}
                  placeholder="e.g. Honey & Ghee"
                  className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1A1512] mb-1">Slug URL</label>
                <input
                  type="text"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  placeholder="e.g. honey-ghee"
                  className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 font-mono text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1A1512] mb-1">Cover Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCatImage}
                    onChange={(e) => setNewCatImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  />
                  {newCatImage && (
                    <img
                      src={newCatImage}
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
                  value={newCatDescription}
                  onChange={(e) => setNewCatDescription(e.target.value)}
                  placeholder="Short description of items in this department..."
                  className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl p-3 text-[#1A1512] focus:outline-none focus:border-[#6CAE14] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDE5E1]">
                <button
                  type="button"
                  onClick={() => setShowAddCatModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#EDE5E1] text-[#6B5B58] hover:bg-[#F8F7F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingCat}
                  className="bg-[#6CAE14] hover:bg-[#5B960E] disabled:opacity-50 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  {isAddingCat ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Modal: Edit Category --- */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EDE5E1] shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex items-center justify-between border-b border-[#EDE5E1] pb-3">
              <h3 className="section-title text-xl text-[#1A1512]">Edit Category</h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1.5 text-[#6B5B58] hover:text-[#1A1512] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#1A1512] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                  placeholder="e.g. Honey & Ghee"
                  className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1A1512] mb-1">Slug URL</label>
                <input
                  type="text"
                  value={editCatSlug}
                  onChange={(e) => setEditCatSlug(e.target.value)}
                  placeholder="e.g. honey-ghee"
                  className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 font-mono text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1A1512] mb-1">Cover Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editCatImage}
                    onChange={(e) => setEditCatImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                  />
                  {editCatImage && (
                    <img
                      src={editCatImage}
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
                  value={editCatDescription}
                  onChange={(e) => setEditCatDescription(e.target.value)}
                  placeholder="Short description of items in this department..."
                  className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl p-3 text-[#1A1512] focus:outline-none focus:border-[#6CAE14] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDE5E1]">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#EDE5E1] text-[#6B5B58] hover:bg-[#F8F7F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingCat}
                  className="bg-[#6CAE14] hover:bg-[#5B960E] disabled:opacity-50 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  {isUpdatingCat ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Modal: Add Subcategory --- */}
      {activeCatForSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-[#EDE5E1] shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex items-center justify-between border-b border-[#EDE5E1] pb-3">
              <div>
                <h3 className="section-title text-lg text-[#1A1512]">Add Subcategory</h3>
                <p className="text-[11px] text-[#6CAE14] font-semibold">Under: {activeCatForSub.name}</p>
              </div>
              <button
                onClick={() => setActiveCatForSub(null)}
                className="p-1.5 text-[#6B5B58] hover:text-[#1A1512] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#1A1512] mb-1">Subcategory Name *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={subCatName}
                  onChange={(e) => setSubCatName(e.target.value)}
                  placeholder="e.g. Pure Mustard Oil, Raw Honey"
                  className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDE5E1]">
                <button
                  type="button"
                  onClick={() => setActiveCatForSub(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#EDE5E1] text-[#6B5B58] hover:bg-[#F8F7F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingSub}
                  className="bg-[#6CAE14] hover:bg-[#5B960E] disabled:opacity-50 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  {isAddingSub ? 'Adding...' : 'Add Subcategory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
