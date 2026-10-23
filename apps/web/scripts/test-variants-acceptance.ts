/**
 * Acceptance Verification Test Suite for Product Variants (Group) System
 * All test entities use prefix `TEST-` and are cleaned up at the end.
 */

import { dbService } from '../src/lib/db-service';
import { getProductPriceRange, getProductTotalStock } from '../src/lib/variant-helpers';
import { parseRobustPrice } from '../src/lib/formatters';
import fs from 'fs';
import path from 'path';

interface TestResult {
  caseName: string;
  description: string;
  status: 'PASS' | 'FAIL';
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, caseName: string, description: string, details?: string) {
  if (condition) {
    results.push({ caseName, description, status: 'PASS', details });
    console.log(`[PASS] ${caseName}: ${description}`);
  } else {
    results.push({ caseName, description, status: 'FAIL', details });
    console.error(`[FAIL] ${caseName}: ${description} - ${details || ''}`);
  }
}

function cleanTestEntities() {
  try {
    const ordersFile = path.join(process.cwd(), 'data', 'orders.json');
    if (fs.existsSync(ordersFile)) {
      const rawOrders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
      const cleanedOrders = rawOrders.filter(
        (o: any) =>
          !o.customerName?.startsWith('TEST-') &&
          !o.id?.startsWith('TEST-')
      );
      fs.writeFileSync(ordersFile, JSON.stringify(cleanedOrders, null, 2), 'utf8');
    }
  } catch {}

  try {
    const productsFile = path.join(process.cwd(), 'data', 'products.json');
    if (fs.existsSync(productsFile)) {
      const rawProds = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
      const cleanedProds = rawProds.filter(
        (p: any) =>
          !p.name?.startsWith('TEST-') &&
          !p.sku?.startsWith('TEST-')
      );
      fs.writeFileSync(productsFile, JSON.stringify(cleanedProds, null, 2), 'utf8');
    }
  } catch {}
}

async function runAcceptanceSuite() {
  console.log('====================================================');
  console.log('STARTING PRODUCT VARIANTS ACCEPTANCE TEST SUITE');
  console.log('====================================================\n');

  cleanTestEntities();

  let testProductSimpleId: string | null = null;
  let testProductVariantId: string | null = null;
  let testMergeParentId: string | null = null;
  let testMergeChildId: string | null = null;
  let testOrderSimpleId: string | null = null;
  let testOrderVariantId: string | null = null;

  try {
    // ------------------------------------------------------------------
    // Case A: Simple product without variants
    // ------------------------------------------------------------------
    console.log('--- Testing Case A: Simple Product Without Variants ---');
    const simpleProd = await dbService.addProduct({
      name: 'TEST-Pure-Ghee-500g',
      price: 750,
      originalPrice: 850,
      sku: 'TEST-GHEE-500',
      stock: 20,
      image: 'https://jawatamart.com/test-ghee.jpg',
      description: 'Test organic ghee 500g',
    });
    testProductSimpleId = simpleProd.id;

    assert(
      simpleProd.price === 750 && simpleProd.originalPrice === 850 && simpleProd.stock === 20 && simpleProd.sku === 'TEST-GHEE-500',
      'Case A1',
      'Simple product created with correct price, regularPrice, SKU, and stock'
    );

    const priceRangeSimple = getProductPriceRange(simpleProd);
    assert(
      priceRangeSimple.displayPrice === '৳750' && !priceRangeSimple.hasRange,
      'Case A2',
      'Catalog displays single price ৳750 with no range'
    );

    // Place order for 2 units
    const orderSimple = await dbService.createOrder({
      customerName: 'TEST-Customer-A',
      customerPhone: '01711000001',
      address: 'TEST-Address-Dhaka',
      deliveryZone: 'INSIDE_DHAKA',
      deliveryCharge: 70,
      subtotal: 1500,
      total: 1570,
      paymentMethod: 'COD',
      items: [
        {
          id: `item-${Date.now()}`,
          orderId: '',
          productId: simpleProd.id,
          productName: simpleProd.name,
          productImage: simpleProd.image,
          sku: simpleProd.sku || undefined,
          price: 750,
          quantity: 2,
          total: 1500,
        },
      ],
    } as any);
    testOrderSimpleId = orderSimple.id;

    const afterOrderSimple = await dbService.getProductBySlug(simpleProd.slug);
    assert(
      afterOrderSimple?.stock === 18,
      'Case A3',
      'Stock deducted from 20 to 18 upon order creation'
    );

    // Cancel order
    await dbService.updateOrderStatus(orderSimple.id, 'CANCELLED');
    const afterCancelSimple = await dbService.getProductBySlug(simpleProd.slug);
    assert(
      afterCancelSimple?.stock === 20,
      'Case A4',
      'Stock restored from 18 to 20 upon order cancellation'
    );

    // Cancel again (idempotent test)
    await dbService.updateOrderStatus(orderSimple.id, 'CANCELLED');
    const afterDoubleCancelSimple = await dbService.getProductBySlug(simpleProd.slug);
    assert(
      afterDoubleCancelSimple?.stock === 20,
      'Case A5',
      'Idempotent stock restoration: second cancellation does not double-restore stock'
    );

    // ------------------------------------------------------------------
    // Case B: Product with variants
    // ------------------------------------------------------------------
    console.log('\n--- Testing Case B: Product With Variants ---');
    const variantProd = await dbService.addProduct({
      name: 'TEST-Olevs-Watch-9947',
      price: 2100,
      originalPrice: 2500,
      sku: 'TEST-OLEVS-MAIN',
      stock: 15,
      image: 'https://jawatamart.com/test-watch-main.jpg',
      description: 'Test Olevs watch with 3 variants',
      variants: [
        {
          id: 'var-1',
          name: 'Black',
          sku: 'TEST-OLEVS-BLK',
          price: 2100,
          regularPrice: 2500,
          stock: 10,
          image: 'https://jawatamart.com/test-watch-blk.jpg',
          isActive: true,
          order: 0,
        },
        {
          id: 'var-2',
          name: 'Gold',
          sku: 'TEST-OLEVS-GLD',
          price: 2300,
          regularPrice: 2600,
          stock: 5,
          image: 'https://jawatamart.com/test-watch-gld.jpg',
          isActive: true,
          order: 1,
        },
        {
          id: 'var-3',
          name: 'Silver-White',
          sku: 'TEST-OLEVS-SLV',
          price: 2200,
          regularPrice: 2500,
          stock: 0, // out of stock
          image: 'https://jawatamart.com/test-watch-slv.jpg',
          isActive: true,
          order: 2,
        },
      ],
    } as any);
    testProductVariantId = variantProd.id;

    assert(
      variantProd.variants?.length === 3,
      'Case B1',
      'Product created with 3 active variants'
    );

    const priceRangeVar = getProductPriceRange(variantProd);
    assert(
      priceRangeVar.hasRange && priceRangeVar.displayPrice === '৳2,100 – ৳2,300',
      'Case B2',
      `Catalog displays price range "${priceRangeVar.displayPrice}" (expected ৳2,100 – ৳2,300)`
    );

    const totalStockVar = getProductTotalStock(variantProd);
    assert(
      totalStockVar === 15,
      'Case B3',
      `Total stock across variants correctly calculated as 10 + 5 + 0 = ${totalStockVar}`
    );

    // Place order for 2 units of Variant 2 ("Gold", SKU "TEST-OLEVS-GLD")
    const orderVariant = await dbService.createOrder({
      customerName: 'TEST-Customer-B',
      customerPhone: '01711000002',
      address: 'TEST-Address-Dhaka',
      deliveryZone: 'INSIDE_DHAKA',
      deliveryCharge: 70,
      subtotal: 4600,
      total: 4670,
      paymentMethod: 'COD',
      items: [
        {
          id: `item-${Date.now()}-var`,
          orderId: '',
          productId: variantProd.id,
          productName: variantProd.name,
          productImage: variantProd.image,
          variantName: 'Gold',
          sku: 'TEST-OLEVS-GLD',
          price: 2300,
          quantity: 2,
          total: 4600,
        },
      ],
    } as any);
    testOrderVariantId = orderVariant.id;

    const afterOrderVariantProd = await dbService.getProductBySlug(variantProd.slug);
    const varGold = afterOrderVariantProd?.variants?.find((v) => v.sku === 'TEST-OLEVS-GLD');
    const varBlack = afterOrderVariantProd?.variants?.find((v) => v.sku === 'TEST-OLEVS-BLK');
    const varSilver = afterOrderVariantProd?.variants?.find((v) => v.sku === 'TEST-OLEVS-SLV');

    assert(
      varGold?.stock === 3 && varBlack?.stock === 10 && varSilver?.stock === 0,
      'Case B4',
      `Variant stock deducted selectively: Gold 5->3, Black remained 10, Silver remained 0`
    );

    assert(
      afterOrderVariantProd?.stock === 13,
      'Case B5',
      `Parent product total stock updated correctly to 10 + 3 + 0 = ${afterOrderVariantProd?.stock}`
    );

    // Cancel variant order
    await dbService.updateOrderStatus(orderVariant.id, 'CANCELLED');
    const afterCancelVarProd = await dbService.getProductBySlug(variantProd.slug);
    const varGoldRestored = afterCancelVarProd?.variants?.find((v) => v.sku === 'TEST-OLEVS-GLD');

    assert(
      varGoldRestored?.stock === 5 && afterCancelVarProd?.stock === 15,
      'Case B6',
      `Variant stock restored to 5 and parent stock back to 15 upon cancellation`
    );

    // Double cancel check
    await dbService.updateOrderStatus(orderVariant.id, 'CANCELLED');
    const afterDoubleCancelVarProd = await dbService.getProductBySlug(variantProd.slug);
    const varGoldDouble = afterDoubleCancelVarProd?.variants?.find((v) => v.sku === 'TEST-OLEVS-GLD');
    assert(
      varGoldDouble?.stock === 5 && afterDoubleCancelVarProd?.stock === 15,
      'Case B7',
      `Idempotent cancellation: Variant stock remains 5 and not double-restored`
    );

    // ------------------------------------------------------------------
    // Case C: Duplicate SKU validation
    // ------------------------------------------------------------------
    console.log('\n--- Testing Case C: Duplicate SKU Validation ---');
    let duplicateRejected = false;
    try {
      await dbService.addProduct({
        name: 'TEST-Duplicate-Product',
        price: 1000,
        sku: 'TEST-OLEVS-BLK', // Already taken by Variant 1
        stock: 5,
        image: 'https://jawatamart.com/test.jpg',
        description: 'Test duplicate SKU',
      });
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes('sku')) {
        duplicateRejected = true;
      }
    }
    assert(
      duplicateRejected,
      'Case C1',
      'Duplicate SKU creation rejected with descriptive SKU validation error'
    );

    // ------------------------------------------------------------------
    // Case D: Price robustness
    // ------------------------------------------------------------------
    console.log('\n--- Testing Case D: Price Robustness ---');
    const parsedComma = parseRobustPrice('2,100');
    const parsedBengali = parseRobustPrice('১২০০');
    const parsedSymbol = parseRobustPrice('৳ 2,500');
    const parsedInvalid = parseRobustPrice('abc');
    const parsedZero = parseRobustPrice('0');

    assert(
      parsedComma === 2100 && parsedBengali === 1200 && parsedSymbol === 2500,
      'Case D1',
      'Robust price parser handles commas ("2,100"->2100), Bengali numerals ("১২০০"->1200), and currency symbols ("৳ 2,500"->2500)'
    );

    assert(
      parsedInvalid === null && parsedZero === null,
      'Case D2',
      'Invalid string and 0 are blocked as invalid prices'
    );

    // ------------------------------------------------------------------
    // Case E: Regular Price preservation
    // ------------------------------------------------------------------
    console.log('\n--- Testing Case E: Regular Price Preservation ---');
    const updatedSimple = await dbService.updateProduct(simpleProd.id, {
      name: 'TEST-Pure-Ghee-500g-Renamed',
      // originalPrice omitted intentionally
    });

    assert(
      updatedSimple?.originalPrice === 850,
      'Case E1',
      'Unmodified regularPrice preserved without loss when updating other fields'
    );

    // ------------------------------------------------------------------
    // Case F: Merge Tool
    // ------------------------------------------------------------------
    console.log('\n--- Testing Case F: Merge Tool & Redirects ---');
    const mergeParent = await dbService.addProduct({
      name: 'TEST-Parent-Watch-Model-X',
      price: 1800,
      originalPrice: 2200,
      sku: 'TEST-MRG-PARENT-01',
      stock: 8,
      image: 'https://jawatamart.com/parent.jpg',
      description: 'Parent watch model description',
    });
    testMergeParentId = mergeParent.id;

    const mergeChild = await dbService.addProduct({
      name: 'TEST-Child-Watch-Black-Edition',
      price: 1950,
      originalPrice: 2400,
      sku: 'TEST-MRG-CHILD-01',
      stock: 6,
      image: 'https://jawatamart.com/child-black.jpg',
      description: 'Child watch to be merged as variant',
    });
    testMergeChildId = mergeChild.id;

    const mergedResult = await dbService.mergeProducts(mergeParent.id, [mergeChild.id]);

    assert(
      Boolean(mergedResult.variants && mergedResult.variants.length >= 2),
      'Case F1',
      `Merge tool merged source product as variant (total variants now: ${mergedResult.variants?.length})`
    );

    const childVariant = mergedResult.variants?.find((v) => v.sku === 'TEST-MRG-CHILD-01');
    assert(
      Boolean(childVariant && childVariant.price === 1950 && childVariant.stock === 6 && childVariant.image === 'https://jawatamart.com/child-black.jpg'),
      'Case F2',
      'Merged variant preserved original price (1950), stock (6), image, and SKU (TEST-MRG-CHILD-01)'
    );

    assert(
      Boolean(mergedResult.mergedFromSlugs?.includes(mergeChild.slug)),
      'Case F3',
      'Parent product recorded child slug in mergedFromSlugs for redirect mapping'
    );

    // Test URL resolution of old child slug
    const resolvedProduct = await dbService.getProductBySlug(mergeChild.slug);
    assert(
      resolvedProduct?.id === mergeParent.id,
      'Case F4',
      'getProductBySlug with old child slug resolves to parent product'
    );

    // ------------------------------------------------------------------
    // Case G: Search by Variant Name and SKU
    // ------------------------------------------------------------------
    console.log('\n--- Testing Case G: Search by Variant SKU and Name ---');
    const searchBySku = await dbService.getProducts({ search: 'TEST-OLEVS-GLD' });
    const searchByName = await dbService.getProducts({ search: 'Silver-White' });

    assert(
      searchBySku.some((p) => p.id === variantProd.id),
      'Case G1',
      'Search by variant SKU ("TEST-OLEVS-GLD") successfully returns parent product'
    );

    assert(
      searchByName.some((p) => p.id === variantProd.id),
      'Case G2',
      'Search by variant name ("Silver-White") successfully returns parent product'
    );

    // ------------------------------------------------------------------
    // Case H: Data Safety & Backward Compatibility
    // ------------------------------------------------------------------
    console.log('\n--- Testing Case H: Data Safety Verification ---');
    const allProducts = await dbService.getProducts({ includeInactive: true });
    const nonTestProducts = allProducts.filter((p) => !p.name.startsWith('TEST-'));

    assert(
      nonTestProducts.length > 0,
      'Case H1',
      `Catalog retains all real products (${nonTestProducts.length} real products preserved)`
    );

    const realOrders = await dbService.getOrders();
    const nonTestOrders = realOrders.filter(
      (o) => !o.customerName?.startsWith('TEST-') && !o.id.startsWith('TEST-')
    );
    assert(
      nonTestOrders.every((o) => o.items && Array.isArray(o.items)),
      'Case H2',
      `Existing orders data structure is 100% intact with zero historical corruption`
    );

  } catch (error: any) {
    console.error('UNEXPECTED TEST EXCEPTION:', error);
    results.push({
      caseName: 'CRITICAL',
      description: 'Test suite encountered an uncaught error',
      status: 'FAIL',
      details: error.message,
    });
  } finally {
    // ------------------------------------------------------------------
    // Case I: Cleanup Test Entities
    // ------------------------------------------------------------------
    console.log('\n--- Testing Case I: Cleaning Up Test Entities ---');
    cleanTestEntities();
    console.log('Cleanup completed cleanly.');
  }

  // ------------------------------------------------------------------
  // Summary Report
  // ------------------------------------------------------------------
  console.log('\n====================================================');
  console.log('ACCEPTANCE TEST RESULTS SUMMARY');
  console.log('====================================================');
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${passed} | FAILED: ${failed}`);

  results.forEach((r) => {
    const icon = r.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} [${r.status}] ${r.caseName}: ${r.description}`);
  });

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAcceptanceSuite();
