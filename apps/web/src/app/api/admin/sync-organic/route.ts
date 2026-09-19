import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const results: string[] = [];

    // 1. Update Organic Food Category Image
    try {
      const cat = await prisma.category.findFirst({
        where: { OR: [{ id: 'cat-organic-food' }, { slug: 'organic-food' }] },
      });
      if (cat) {
        await prisma.category.update({
          where: { id: cat.id },
          data: {
            image: '/images/organic-pure-ghee.jpg',
            description: '100% pure natural honey, wood-pressed mustard oil, homemade cow ghee, organic pickles, and authentic rural delicacies.',
          },
        });
        results.push(`Updated category ${cat.name} with new image`);
      }
    } catch (e: any) {
      results.push(`Category update warning: ${e.message}`);
    }

    // 2. Ensure homemade pickle subcategory exists
    let pickleSubId: string | null = null;
    try {
      const cat = await prisma.category.findFirst({
        where: { OR: [{ id: 'cat-organic-food' }, { slug: 'organic-food' }] },
      });
      if (cat) {
        let sub = await prisma.subCategory.findFirst({
          where: { slug: 'homemade-pickle', categoryId: cat.id },
        });
        if (!sub) {
          sub = await prisma.subCategory.create({
            data: {
              categoryId: cat.id,
              name: 'Homemade Pickles & Achar (ঘরোয়া আচার)',
              slug: 'homemade-pickle',
              order: 4,
            },
          });
          results.push('Created subcategory homemade-pickle');
        }
        pickleSubId = sub.id;
      }
    } catch (e: any) {
      results.push(`Subcategory warning: ${e.message}`);
    }

    // 3. Update Cow Ghee product
    try {
      const ghee = await prisma.product.findFirst({
        where: {
          OR: [
            { id: 'p-org-pure-cow-ghee' },
            { slug: { contains: 'cow-milk-ghee' } },
            { slug: { contains: 'danadar-pure-cow-ghee' } },
          ],
        },
      });
      if (ghee) {
        await prisma.product.update({
          where: { id: ghee.id },
          data: {
            name: 'Jawata Mart Special Offer Danadar Pure Cow Ghee (খাঁটি দানাদার গাওয়া ঘি - ৫০০ গ্রাম)',
            image: '/images/organic-pure-ghee.jpg',
            images: JSON.stringify(['/images/organic-pure-ghee.jpg']),
            badge: 'Special Offer 🔥',
            description: 'জাওয়াটা মার্ট স্পেশাল অফার খাঁটি দানাদার গাওয়া ঘি। প্রাকৃতিক ঘাস খাওয়া দেশি গরুর দুধের ননী থেকে সম্পূর্ণ ঘরোয়া ও ঐতিহ্যবাহী পদ্ধতিতে তৈরি। সুস্বাদু ঘ্রাণ ও অতুলনীয় স্বাদ। ১০০% খাঁটি ও নির্ভেজাল।',
          },
        });
        results.push(`Updated product: ${ghee.name}`);
      }
    } catch (e: any) {
      results.push(`Ghee update warning: ${e.message}`);
    }

    // 4. Update Mustard Oil product
    try {
      const oil = await prisma.product.findFirst({
        where: {
          OR: [
            { id: 'p-org-mustard-oil-1l' },
            { slug: { contains: 'mustard-oil' } },
          ],
        },
      });
      if (oil) {
        await prisma.product.update({
          where: { id: oil.id },
          data: {
            name: 'Jawata Mart Special Offer Pure Wood Ghani Mustard Oil (জাওয়াটা মার্ট কাঠের ঘানি ভাঙা খাঁটি সরিষার তেল - ১ লিটার)',
            image: '/images/organic-mustard-oil.jpg',
            images: JSON.stringify(['/images/organic-mustard-oil.jpg']),
            badge: 'Special Offer 🔥',
            description: 'জাওয়াটা মার্ট স্পেশাল অফার ১০০% খাঁটি কাঠের ঘানি ভাঙা সরিষার তেল। দেশি বাছাইকৃত সরিষার প্রথম কোল্ড-প্রেস থেকে সংগৃহীত। কোনো ক্ষতিকর কেমিক্যাল বা কৃত্রিম ঝাঁজ ছাড়া প্রাকৃতিক তীব্র ঝাঁজ ও অনন্য সুগন্ধ।',
          },
        });
        results.push(`Updated product: ${oil.name}`);
      }
    } catch (e: any) {
      results.push(`Oil update warning: ${e.message}`);
    }

    // 5. Update Natural Honey product
    try {
      const honey = await prisma.product.findFirst({
        where: {
          OR: [
            { id: 'p-org-sundarbans-honey' },
            { slug: { contains: 'sundarbans-wild-flower-honey' } },
            { slug: { contains: 'pure-natural-raw-honey' } },
          ],
        },
      });
      if (honey) {
        await prisma.product.update({
          where: { id: honey.id },
          data: {
            name: 'Jawata Mart 100% Pure Natural Raw Honey (খাঁটি প্রাকৃতিক সুন্দরবন মধু - ৫০০ গ্রাম)',
            image: '/images/organic-natural-honey.png',
            images: JSON.stringify(['/images/organic-natural-honey.png']),
            badge: '100% Pure Raw 🍯',
            description: 'জাওয়াটা মার্ট ১০০% প্রাকৃতিক কাঁচা মধু। সুন্দরবনের প্রাকৃতিক মৌচাক থেকে সরাসরি সংগৃহীত কোনো প্রকার হিট বা প্রসেসিং ছাড়া অপরিশোধিত প্রাকৃতিক এনজাইম ও পোলেন সমৃদ্ধ খাঁটি মধু।',
          },
        });
        results.push(`Updated product: ${honey.name}`);
      }
    } catch (e: any) {
      results.push(`Honey update warning: ${e.message}`);
    }

    // 6. Upsert Homemade Pickle product
    try {
      const cat = await prisma.category.findFirst({
        where: { OR: [{ id: 'cat-organic-food' }, { slug: 'organic-food' }] },
      });
      if (cat) {
        const pickleSlug = 'jawata-mart-traditional-homemade-mango-pickle-500g';
        const existingPickle = await prisma.product.findFirst({
          where: { OR: [{ id: 'p-org-homemade-pickle' }, { slug: pickleSlug }] },
        });

        if (existingPickle) {
          await prisma.product.update({
            where: { id: existingPickle.id },
            data: {
              name: 'Jawata Mart Traditional Homemade Raw Mango Pickle (টক-ঝাল-মিষ্টি ঘরোয়া আমের আচার - ৫০০ গ্রাম)',
              image: '/images/organic-homemade-pickle.jpg',
              images: JSON.stringify(['/images/organic-homemade-pickle.jpg']),
              badge: 'Homemade Special 🌶️',
              price: 380,
              originalPrice: 480,
              discount: 21,
            },
          });
          results.push('Updated existing pickle product');
        } else {
          await prisma.product.create({
            data: {
              id: 'p-org-homemade-pickle',
              name: 'Jawata Mart Traditional Homemade Raw Mango Pickle (টক-ঝাল-মিষ্টি ঘরোয়া আমের আচার - ৫০০ গ্রাম)',
              slug: pickleSlug,
              categoryId: cat.id,
              subCategoryId: pickleSubId,
              brand: 'Jawata Mart',
              price: 380,
              originalPrice: 480,
              discount: 21,
              stock: 65,
              sku: 'JM-ORG-PICKLE-500',
              image: '/images/organic-homemade-pickle.jpg',
              images: JSON.stringify(['/images/organic-homemade-pickle.jpg']),
              description: '১০০% খাঁটি সরিষার তেলে তৈরি ঐতিহ্যবাহী টক-ঝাল-মিষ্টি ঘরোয়া আমের আচার। বিশেষ পাঁচফোড়ন, রসুন ও খাঁটি মসলার দারুণ সংমিশ্রণে রোদে শুকিয়ে প্রস্তুতকৃত স্পেশাল স্বাদ। কোনো রাসায়নিক প্রিজারভেটিভ নেই।',
              badge: 'Homemade Special 🌶️',
              isFeatured: true,
              isBestSeller: true,
              isNew: true,
              isActive: true,
              rating: 5.0,
              reviewCount: 52,
            },
          });
          results.push('Created new pickle product in DB');
        }
      }
    } catch (e: any) {
      results.push(`Pickle upsert warning: ${e.message}`);
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
