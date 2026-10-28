'use client';



import React, { useState, useEffect, useMemo } from 'react';

import Link from 'next/link';

import { useRouter, useSearchParams } from 'next/navigation';

import { trackViewContent } from '@/lib/tracking';

import {

  Star,

  ShoppingBag,

  Zap,

  Heart,

  Truck,

  ShieldCheck,

  RefreshCw,

  Plus,

  Minus,

  Check,

  ChevronRight,

  Layers,

  AlertTriangle,

} from 'lucide-react';

import { ProductItem, ProductVariant, VariantColor } from '@/lib/types';

import { formatPrice } from '@/lib/formatters';

import { useCart } from '@/context/cart-context';

import { useToast } from '@/context/toast-context';

import ProductCard from './ProductCard';



import BackButton from '@/components/common/BackButton';



export default function ProductView({

  product,

  relatedProducts,

}: {

  product: ProductItem;

  relatedProducts: ProductItem[];

}) {

  const router = useRouter();

  const searchParams = useSearchParams();

  const { addItem } = useCart();

  const { success, error } = useToast();



  // Initialize selected variant with URL query sync support (?variant=SKU)

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(() => {

    if (!product.variants || product.variants.length === 0) return undefined;

    const variantParam = searchParams?.get('variant');

    if (variantParam) {

      const match = product.variants.find(

        (v) =>

          v.sku.toLowerCase() === variantParam.toLowerCase() ||

          v.id === variantParam ||

          v.name.toLowerCase() === variantParam.toLowerCase()

      );

      if (match) return match;

    }

    return product.variants.find((v) => v.isActive !== false) || product.variants[0];

  });



  // Selected colour state with URL query sync (?color=Kalo)

  const [selectedColor, setSelectedColor] = useState<VariantColor | undefined>(() => {

    if (!selectedVariant?.colors || selectedVariant.colors.length === 0) return undefined;

    const colorParam = searchParams?.get('color');

    if (colorParam) {

      const match = selectedVariant.colors.find(

        (c) =>

          c.name.toLowerCase() === colorParam.toLowerCase() ||

          (c.sku && c.sku.toLowerCase() === colorParam.toLowerCase()) ||

          c.id === colorParam

      );

      if (match) return match;

    }

    return selectedVariant.colors[0];

  });



  const [activeImage, setActiveImage] = useState<string>(() => {

    return (

      selectedColor?.image ||

      selectedVariant?.image ||

      product.image ||

      '/jawata-mart-logo.jpg'

    );

  });

  const [quantity, setQuantity] = useState(1);

  const [isWishlisted, setIsWishlisted] = useState(false);

  const [addedAnim, setAddedAnim] = useState(false);



  // Sync when variant or URL params change

  useEffect(() => {

    const variantParam = searchParams?.get('variant');

    const colorParam = searchParams?.get('color');



    let activeVar = selectedVariant;

    if (variantParam && product.variants && product.variants.length > 0) {

      const matchVar = product.variants.find(

        (v) =>

          v.sku.toLowerCase() === variantParam.toLowerCase() ||

          v.id === variantParam ||

          v.name.toLowerCase() === variantParam.toLowerCase()

      );

      if (matchVar && matchVar.id !== selectedVariant?.id) {

        activeVar = matchVar;

        setSelectedVariant(matchVar);

      }

    }



    if (activeVar?.colors && activeVar.colors.length > 0) {

      let matchCol: VariantColor | undefined;

      if (colorParam) {

        matchCol = activeVar.colors.find(

          (c) =>

            c.name.toLowerCase() === colorParam.toLowerCase() ||

            (c.sku && c.sku.toLowerCase() === colorParam.toLowerCase()) ||

            c.id === colorParam

        );

      }

      const targetCol = matchCol || activeVar.colors[0];

      setSelectedColor(targetCol);

      if (targetCol?.image) {

        setActiveImage(targetCol.image);

      } else if (activeVar.image) {

        setActiveImage(activeVar.image);

      }

    } else {

      setSelectedColor(undefined);

      if (activeVar?.image) {

        setActiveImage(activeVar.image);

      }

    }

  }, [searchParams, product.variants]);



  const handleSelectVariant = (v: ProductVariant) => {

    setSelectedVariant(v);

    const defaultCol = v.colors && v.colors.length > 0 ? v.colors[0] : undefined;

    setSelectedColor(defaultCol);



    const nextImg = defaultCol?.image || (defaultCol?.images && defaultCol.images[0]) || v.image || (v.images && v.images[0]) || product.image;

    if (nextImg) setActiveImage(nextImg);



    try {

      const url = new URL(window.location.href);

      url.searchParams.set('variant', v.sku);

      if (defaultCol?.name) {

        url.searchParams.set('color', defaultCol.name);

      } else {

        url.searchParams.delete('color');

      }

      window.history.replaceState({}, '', url.toString());

    } catch {}

  };



  const handleSelectColor = (c: VariantColor) => {

    setSelectedColor(c);

    if (c.image) {

      setActiveImage(c.image);

    }

    try {

      const url = new URL(window.location.href);

      if (selectedVariant?.sku) {

        url.searchParams.set('variant', selectedVariant.sku);

      }

      url.searchParams.set('color', c.name);

      window.history.replaceState({}, '', url.toString());

    } catch {}

  };



  // Effective attributes taking color stock and sku into account

  const currentPrice = selectedVariant?.price ?? product.price;

  const currentRegularPrice = selectedVariant?.regularPrice ?? product.originalPrice;

  const currentStock =

    selectedColor && typeof selectedColor.stock === 'number'

      ? selectedColor.stock

      : selectedVariant

      ? selectedVariant.stock

      : product.stock;

  const currentSku = selectedColor?.sku || selectedVariant?.sku || product.sku;

  const isOutOfStock = currentStock <= 0;



  const discountPercent = Boolean(currentRegularPrice && currentRegularPrice > currentPrice)

    ? Math.round(((currentRegularPrice! - currentPrice) / currentRegularPrice!) * 100)

    : 0;



  // Gallery images strictly scoped to the active selection (Color or Variant).
  // The main product display pic must ONLY show for the variant it belongs to (or when no variant images exist).
  const displayImages = useMemo(() => {
    // 1. Color specific images first (if color is selected and has images)
    if (selectedColor) {
      const colList: string[] = [];
      if (selectedColor.image) colList.push(selectedColor.image);
      if (Array.isArray(selectedColor.images)) {
        for (const img of selectedColor.images) {
          if (img && !colList.includes(img)) colList.push(img);
        }
      }
      if (colList.length > 0) return colList;
    }

    // 2. Variant specific images (if variant is selected and has images)
    if (selectedVariant) {
      const varList: string[] = [];
      if (selectedVariant.image) varList.push(selectedVariant.image);
      if (Array.isArray(selectedVariant.images)) {
        for (const img of selectedVariant.images) {
          if (img && !varList.includes(img)) varList.push(img);
        }
      }
      if (varList.length > 0) return varList;
    }

    // 3. Fallback ONLY if the product has NO variants, or if the selected variant has NO images of its own:
    const list: string[] = [];
    if (product.image && !list.includes(product.image)) {
      list.push(product.image);
    }
    if (Array.isArray(product.images)) {
      for (const img of product.images) {
        if (img && !list.includes(img)) list.push(img);
      }
    }
    return list.length > 0 ? list : ['/jawata-mart-logo.jpg'];
  }, [product, selectedVariant, selectedColor]);

  // Synchronize activeImage whenever displayImages changes (e.g. variant or color switched)
  useEffect(() => {
    if (displayImages.length > 0 && !displayImages.includes(activeImage)) {
      setActiveImage(displayImages[0]);
    }
  }, [displayImages, activeImage]);



  useEffect(() => {

    trackViewContent({

      id: product.id,

      name: product.name,

      price: currentPrice,

      category: product.categoryName,

      brand: product.brand,

    });

  }, [product.id, currentPrice]);



  const handleAddToCart = () => {

    if (isOutOfStock) {

      error('Selected variation or colour is currently out of stock.');

      return;

    }

    addItem(product, quantity, selectedVariant, selectedColor);

    setAddedAnim(true);

    const varLabel = selectedVariant

      ? ` (${selectedVariant.name}${selectedColor ? ` - ${selectedColor.name}` : ''})`

      : '';

    success(`Added ${quantity}x "${product.name.slice(0, 20)}..."${varLabel} to your bag!`);

    setTimeout(() => setAddedAnim(false), 1500);

  };



  const handleBuyNow = () => {

    if (isOutOfStock) {

      error('Selected variation or colour is currently out of stock.');

      return;

    }

    addItem(product, quantity, selectedVariant, selectedColor);

    router.push('/checkout');

  };



  return (

    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10 space-y-12">

      {/* Top Nav with Back Button & Breadcrumbs */}

      <div className="flex flex-wrap items-center gap-3">

        <BackButton label="Back" fallback={product.categorySlug ? `/category/${product.categorySlug}` : '/'} />

        <span className="text-[#EDE5E1] hidden sm:inline">|</span>

        <nav className="flex items-center gap-1.5 text-xs text-[#9B8A86] flex-wrap">

          <Link href="/" className="hover:text-[#6CAE14] transition-colors">

            Home

          </Link>

          <ChevronRight className="w-3 h-3" />

          <Link

            href={`/category/${product.categorySlug}`}

            className="hover:text-[#6CAE14] transition-colors"

          >

            {product.categoryName || 'Category'}

          </Link>

          <ChevronRight className="w-3 h-3" />

          <span className="text-[#1A1512] font-semibold truncate max-w-xs">{product.name}</span>

        </nav>

      </div>



      {/* Main Product Layout */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        {/* Left: Images Gallery (5 cols) */}

        <div className="lg:col-span-6 space-y-4">

          <div className="relative aspect-square bg-white rounded-3xl border border-[#EDE5E1] overflow-hidden shadow-elevation-1">

            <img

              src={activeImage || '/jawata-mart-logo.jpg'}

              alt={product.name}

              onError={(e) => {

                (e.currentTarget as HTMLImageElement).src = '/jawata-mart-logo.jpg';

              }}

              className="w-full h-full object-cover"

            />

            {product.badge && (

              <span className="absolute top-4 left-4 bg-[#6CAE14] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">

                {product.badge}

              </span>

            )}

            <button

              onClick={() => setIsWishlisted(!isWishlisted)}

              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#6B5B58] hover:text-[#6CAE14] shadow-sm transition-transform active:scale-90 cursor-pointer"

              aria-label="Wishlist"

            >

              <Heart

                className={`w-5 h-5 ${

                  isWishlisted ? 'fill-[#6CAE14] text-[#6CAE14]' : 'stroke-[1.75]'

                }`}

              />

            </button>

          </div>



          {/* Thumbnail Gallery */}

          {displayImages.length > 1 && (

            <div className="flex gap-3 overflow-x-auto pb-2">

              {displayImages.map((img, i) => (

                <button

                  key={i}

                  type="button"

                  onClick={() => setActiveImage(img)}

                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${

                    activeImage === img ? 'border-[#6CAE14] shadow-sm' : 'border-[#EDE5E1] opacity-70 hover:opacity-100'

                  }`}

                >

                  <img src={img} alt="" className="w-full h-full object-cover" />

                </button>

              ))}

            </div>

          )}

        </div>



        {/* Right: Details & Purchase Actions (7 cols) */}

        <div className="lg:col-span-6 space-y-6">

          <div>

            {product.brand && (

              <span className="text-xs font-bold uppercase tracking-wider text-[#6CAE14] block mb-1">

                {product.brand}

              </span>

            )}

            {Array.isArray(product.categories) && product.categories.length > 0 && (

              <div className="flex flex-wrap gap-1.5 mb-2">

                {product.categories.map((cat, idx) => (

                  <span

                    key={idx}

                    className="bg-orange-50 text-[#fd6b03] border border-orange-200 text-xs font-semibold px-2.5 py-0.5 rounded-full"

                  >

                    {cat}

                  </span>

                ))}

              </div>

            )}

            <h1 className="section-title text-2xl sm:text-3xl lg:text-4xl text-[#1A1512] leading-tight mb-3">

              {product.name}

            </h1>



            {/* Rating, Stock & SKU */}

            <div className="flex items-center gap-3 text-xs flex-wrap">

              <div className="flex items-center gap-1 text-[#F0B840] font-semibold">

                <Star className="w-4 h-4 fill-current" />

                <span>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>

                <span className="text-[#9B8A86]">({product.reviewCount || 0} reviews)</span>

              </div>

              <span className="text-[#EDE5E1]">•</span>

              <span

                className={`font-semibold px-2 py-0.5 rounded-full ${

                  currentStock > 0

                    ? 'bg-[#EAF3E9] text-[#7A9C78]'

                    : 'bg-[#FBDADA] text-[#D94040]'

                }`}

              >

                {currentStock > 0 ? `In Stock (${currentStock} units)` : 'Out of Stock'}

              </span>

              {currentSku && (

                <>

                  <span className="text-[#EDE5E1]">•</span>

                  <span className="font-mono text-[#6B5B58] bg-[#F8F7F5] border border-[#EDE5E1] px-2 py-0.5 rounded text-[11px]">

                    SKU: {currentSku}

                  </span>

                </>

              )}

            </div>

          </div>

          {/* Group / Collection Badge */}
          {product.groupSlug && (
            <Link
              href={`/group/${product.groupSlug}`}
              className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50/60 border border-[#fd6b03]/30 text-xs font-bold text-[#0d1f61] hover:border-[#fd6b03] transition-all group"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#fd6b03]" />
                <span>Part of a collection / গ্রুপ কালেকশন</span>
              </div>
              <span className="text-[#fd6b03] group-hover:underline flex items-center gap-1">
                View all styles <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          )}

          {/* Pricing Box */}

          <div className="p-4 bg-white rounded-2xl border border-[#EDE5E1] shadow-xs flex items-baseline gap-3 flex-wrap">

            <span className="text-3xl font-bold text-[#1A1512]">

              {formatPrice(currentPrice)}

            </span>

            {Boolean(currentRegularPrice && currentRegularPrice > currentPrice) && (

              <>

                <span className="text-sm text-[#9B8A86] line-through">

                  {formatPrice(currentRegularPrice!)}

                </span>

                <span className="bg-orange-50 text-[#fd6b03] font-bold text-xs px-2 py-0.5 rounded-md">

                  Save {formatPrice(currentRegularPrice! - currentPrice)} ({discountPercent}%)

                </span>

              </>

            )}

          </div>



          {/* Variants selector (Rich thumbnails / color swatch + name + price) */}

          {product.variants && product.variants.length > 0 && (

            <div className="space-y-3 p-4 bg-[#FAFCF7] rounded-2xl border border-[#DFECCE]">

              <div className="flex items-center justify-between">

                <label className="text-xs font-bold uppercase tracking-wider text-[#1A1512] flex items-center gap-1.5">

                  <Layers className="w-3.5 h-3.5 text-[#fd6b03]" />

                  <span>Choose Variation / কালার বা সাইজ নির্বাচন করুন:</span>

                </label>

                {selectedVariant && (

                  <span className="text-xs font-bold text-[#fd6b03]">

                    Selected: {selectedVariant.name}

                  </span>

                )}

              </div>

              <div className="flex flex-wrap gap-2.5">

                {product.variants.map((v) => {

                  const isSelected = selectedVariant?.id === v.id;

                  const isVOutOfStock = v.stock <= 0;

                  return (

                    <button

                      key={v.id}

                      type="button"

                      onClick={() => handleSelectVariant(v)}

                      className={`relative px-3.5 py-2.5 rounded-2xl text-xs font-semibold border-2 flex items-center gap-2.5 transition-all cursor-pointer ${

                        isSelected

                          ? 'border-[#fd6b03] bg-white text-[#fd6b03] shadow-sm ring-2 ring-[#fd6b03]/30 scale-[1.02]'

                          : 'border-[#EDE5E1] bg-white text-[#1A1512] hover:border-[#fd6b03]/50'

                      } ${isVOutOfStock ? 'opacity-65' : ''}`}

                    >

                      {v.image && (

                        <img

                          src={v.image}

                          alt={v.name}

                          className="w-7 h-7 rounded-lg object-cover border border-[#EDE5E1] shrink-0"

                        />

                      )}

                      <div className="text-left">

                        <span className="block font-bold">{v.name}</span>

                        <span className="text-[11px] text-[#6CAE14] font-semibold block">

                          {formatPrice(v.price)}

                        </span>

                      </div>

                      {isVOutOfStock ? (

                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">

                          Out of stock

                        </span>

                      ) : isSelected ? (

                        <span className="w-2 h-2 rounded-full bg-[#fd6b03]" />

                      ) : null}

                    </button>

                  );

                })}

              </div>



              {/* Nested Colour Swatches for Selected Variant */}

              {selectedVariant?.colors && selectedVariant.colors.length > 0 && (

                <div className="space-y-2.5 pt-3 border-t border-[#DFECCE]">

                  <div className="flex items-center justify-between">

                    <label className="text-xs font-bold uppercase tracking-wider text-[#1A1512] flex items-center gap-1.5">

                      <span className="w-2.5 h-2.5 rounded-full bg-[#6CAE14] inline-block" />

                      <span>Select Colour / কালার নির্বাচন করুন:</span>

                    </label>

                    {selectedColor && (

                      <span className="text-xs font-bold text-[#6CAE14] bg-[#F1F8E8] px-2 py-0.5 rounded-md">

                        Colour: {selectedColor.name}

                      </span>

                    )}

                  </div>



                  <div className="flex flex-wrap items-center gap-2.5">

                    {selectedVariant.colors.map((c) => {

                      const isColorSelected = selectedColor?.id === c.id;

                      const isColorOOS = typeof c.stock === 'number' && c.stock <= 0;

                      const isHex = Boolean(c.swatch && (c.swatch.startsWith('#') || c.swatch.startsWith('rgb')));



                      return (

                        <button

                          key={c.id}

                          type="button"

                          onClick={() => handleSelectColor(c)}

                          title={c.name}

                          className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 transition-all cursor-pointer ${

                            isColorSelected

                              ? 'border-[#6CAE14] bg-white text-[#1A1512] shadow-sm ring-2 ring-[#6CAE14]/30 scale-[1.02]'

                              : 'border-[#EDE5E1] bg-white text-[#6B5B58] hover:border-[#6CAE14]/50 hover:bg-[#FAFCF7]'

                          } ${isColorOOS ? 'opacity-60' : ''}`}

                        >

                          {/* Swatch circle or thumbnail */}

                          {isHex ? (

                            <span

                              className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-2xs"

                              style={{ backgroundColor: c.swatch }}

                            />

                          ) : c.image || c.swatch ? (

                            <img

                              src={c.swatch || c.image}

                              alt={c.name}

                              className="w-5 h-5 rounded-full object-cover border border-[#EDE5E1] shrink-0"

                            />

                          ) : (

                            <span className="w-3.5 h-3.5 rounded-full bg-neutral-300 border border-neutral-400 shrink-0" />

                          )}



                          <span className="text-xs font-semibold">{c.name}</span>



                          {typeof c.stock === 'number' && (

                            <span className={`text-[10px] font-bold ${c.stock <= 0 ? 'text-red-500' : 'text-[#6CAE14]'}`}>

                              {c.stock <= 0 ? '(Stock Out)' : `(${c.stock})`}

                            </span>

                          )}



                          {isColorSelected && (

                            <span className="w-1.5 h-1.5 rounded-full bg-[#6CAE14]" />

                          )}

                        </button>

                      );

                    })}

                  </div>

                </div>

              )}

            </div>

          )}



          {/* Out of Stock Notice */}

          {isOutOfStock && (

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">

              <AlertTriangle className="w-4 h-4 shrink-0" />

              <span>

                এই ভ্যারিয়েন্টটি বর্তমানে আউট অব স্টক। আপনি চাইলে অন্য ভ্যারিয়েন্ট নির্বাচন করতে পারেন।

              </span>

            </div>

          )}



          {/* Quantity & CTA Buttons */}

          <div className="space-y-3 pt-2">

            <div className="flex items-center gap-4">

              <span className="text-xs font-semibold text-[#1A1512]">Quantity:</span>

              <div className="flex items-center border border-[#EDE5E1] rounded-xl bg-white overflow-hidden shadow-xs">

                <button

                  type="button"

                  disabled={isOutOfStock}

                  onClick={() => setQuantity(Math.max(1, quantity - 1))}

                  className="p-2.5 hover:bg-[#F8F7F5] disabled:opacity-40 text-[#6B5B58] transition-colors cursor-pointer"

                >

                  <Minus className="w-4 h-4" />

                </button>

                <span className="px-4 text-xs font-bold text-[#1A1512]">{quantity}</span>

                <button

                  type="button"

                  disabled={isOutOfStock}

                  onClick={() => setQuantity(quantity + 1)}

                  className="p-2.5 hover:bg-[#F8F7F5] disabled:opacity-40 text-[#6B5B58] transition-colors cursor-pointer"

                >

                  <Plus className="w-4 h-4" />

                </button>

              </div>

            </div>



            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">

              <button

                type="button"

                onClick={handleAddToCart}

                disabled={isOutOfStock}

                className={`flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-xs font-bold border-2 transition-all active:scale-95 shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${

                  addedAnim

                    ? 'bg-[#0d1f61] text-white border-[#0d1f61]'

                    : 'bg-white hover:bg-orange-50/50 text-[#0d1f61] border-[#0d1f61]'

                }`}

              >

                {addedAnim ? (

                  <>

                    <Check className="w-4 h-4 text-[#fd6b03]" />

                    <span>Added to Bag!</span>

                  </>

                ) : isOutOfStock ? (

                  <span>Out of Stock</span>

                ) : (

                  <>

                    <ShoppingBag className="w-4 h-4 text-[#fd6b03]" />

                    <span>Add to Bag</span>

                  </>

                )}

              </button>



              <button

                type="button"

                onClick={handleBuyNow}

                disabled={isOutOfStock}

                className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-xs font-bold bg-[#0d1f61] hover:bg-[#162d85] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-md active:scale-95 cursor-pointer"

              >

                <Zap className="w-4 h-4 fill-current text-[#fd6b03]" />

                <span>{isOutOfStock ? 'Out of Stock' : 'Order Now'}</span>

              </button>

            </div>

          </div>



          {/* Delivery & Trust Highlights */}

          <div className="bg-orange-50/60 rounded-2xl p-4 border border-[#fd6b03]/20 space-y-2.5 text-xs text-[#1A1512]">

            <div className="flex items-center gap-2.5">

              <Truck className="w-4 h-4 text-[#fd6b03] shrink-0" />

              <span>

                <strong>Inside Dhaka:</strong> ৳70 (Same/Next Day) • <strong>Dhaka Suburbs:</strong> ৳100 • <strong>Outside Dhaka:</strong> ৳130

              </span>

            </div>

            <div className="flex items-center gap-2.5">

              <ShieldCheck className="w-4 h-4 text-[#fd6b03] shrink-0" />

              <span>Pay with Cash on Delivery, bKash, Nagad, UCB Bank Transfer or Cards</span>

            </div>

            <div className="flex items-center gap-2.5">

              <RefreshCw className="w-4 h-4 text-[#F0B840] shrink-0" />

              <span>7 Days easy return policy for damaged or defective items</span>

            </div>

          </div>

        </div>

      </div>



      {/* Description & Specifications Tabs */}

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EDE5E1] shadow-elevation-1 space-y-8">

        <div>

          <h2 className="section-title text-xl text-[#1A1512] mb-3">Product Overview</h2>

          <p className="text-xs sm:text-sm text-[#6B5B58] leading-relaxed whitespace-pre-line">

            {product.description}

          </p>

        </div>



        {product.specifications && Object.keys(product.specifications).length > 0 && (

          <div>

            <h3 className="section-title text-lg text-[#1A1512] mb-3">Specifications</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">

              {Object.entries(product.specifications).map(([key, val]) => (

                <div

                  key={key}

                  className="flex justify-between p-3 rounded-xl bg-[#F8F7F5] border border-[#EDE5E1]"

                >

                  <span className="font-semibold text-[#1A1512]">{key}</span>

                  <span className="text-[#6B5B58]">{val}</span>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>



      {/* Related Products */}

      {relatedProducts.length > 0 && (

        <section className="space-y-6">

          <div>

            <span className="text-xs font-bold uppercase tracking-wider text-[#6CAE14]">

              You May Also Like

            </span>

            <h2 className="section-title text-2xl text-[#1A1512]">Related Products</h2>

          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">

            {relatedProducts.slice(0, 4).map((p) => (

              <ProductCard key={p.id} product={p} />

            ))}

          </div>

        </section>

      )}

    </div>

  );

}

