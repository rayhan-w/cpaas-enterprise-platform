async function request(url, options = {}, body = null) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 AcceptanceTestRunner',
    ...(options.headers || {}),
  };
  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
  });

  const text = await res.text();
  return {
    statusCode: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    body: text,
  };
}

async function run() {
  console.log('=== RUNNING GTM & GA4 ACCEPTANCE TEST SUITE ON JAWATAMART.COM ===\n');

  // Authenticate as Admin
  console.log('Logging in to obtain JWT admin session...');
  const loginRes = await request('https://jawatamart.com/api/admin/auth/login', { method: 'POST' }, {
    email: 'admin@jawatamart.com',
    password: 'Admin@JawataMart2026!'
  });
  if (loginRes.statusCode !== 200) {
    console.error('Failed to login:', loginRes.statusCode, loginRes.body);
    process.exit(1);
  }
  const loginJson = JSON.parse(loginRes.body);
  const token = loginJson.token;
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Cookie': `nurtura_admin_token=${token}`
  };
  console.log('✓ Admin authenticated successfully.\n');

  // Fetch initial settings
  const initRes = await request('https://jawatamart.com/api/admin/settings', { headers: authHeaders });
  const initSettings = JSON.parse(initRes.body).settings;
  console.log('Initial Store Settings:', {
    storeName: initSettings.storeName,
    insideDhakaFee: initSettings.insideDhakaFee,
    suburbsDhakaFee: initSettings.suburbsDhakaFee,
    outsideDhakaFee: initSettings.outsideDhakaFee,
    freeDeliveryThreshold: initSettings.freeDeliveryThreshold,
    gtmId: initSettings.gtmId,
    enableGTM: initSettings.enableGTM,
    ga4MeasurementId: initSettings.ga4MeasurementId,
    enableGA4: initSettings.enableGA4,
    ga4ViaGtm: initSettings.ga4ViaGtm,
  });

  const results = {};

  // -------------------------------------------------------------
  // TEST 1: Valid GTM ID -> Storefront head/noscript render; Toggle OFF -> none
  // -------------------------------------------------------------
  console.log('\n--- TEST 1: Valid GTM ID & Toggle OFF ---');
  // 1a: Save valid GTM ID
  const saveGtmRes = await request('https://jawatamart.com/api/admin/settings', {
    method: 'PUT',
    headers: authHeaders
  }, {
    gtmId: 'GTM-TEST999',
    enableGTM: true
  });
  console.log('1a Save GTM-TEST999 status:', saveGtmRes.statusCode);
  await new Promise(r => setTimeout(r, 800));

  // Reload storefront
  const sf1Res = await request('https://jawatamart.com/?cb=' + Date.now());
  const sf1Html = sf1Res.body;
  const hasGtmHead = sf1Html.includes('gtm.js?id=') && sf1Html.includes('GTM-TEST999');
  const hasDataLayer = sf1Html.includes('dataLayer');
  const hasGtmNoscript = sf1Html.includes('https://www.googletagmanager.com/ns.html?id=GTM-TEST999');

  console.log('1a Storefront check:');
  console.log(' - <head> gtm.js present:', hasGtmHead);
  console.log(' - dataLayer init present:', hasDataLayer);
  console.log(' - <body> noscript iframe present:', hasGtmNoscript);

  // 1b: Toggle OFF
  const toggleOffRes = await request('https://jawatamart.com/api/admin/settings', {
    method: 'PUT',
    headers: authHeaders
  }, {
    enableGTM: false
  });
  console.log('1b Toggle OFF status:', toggleOffRes.statusCode);
  await new Promise(r => setTimeout(r, 800));

  const sf1bRes = await request('https://jawatamart.com/?cb=' + Date.now());
  const sf1bHtml = sf1bRes.body;
  const hasGtmHeadOff = sf1bHtml.includes('gtm.js?id=');
  const hasGtmNoscriptOff = sf1bHtml.includes('https://www.googletagmanager.com/ns.html?id=');

  console.log('1b Storefront check when OFF:');
  console.log(' - gtm.js absent:', !hasGtmHeadOff);
  console.log(' - noscript absent:', !hasGtmNoscriptOff);

  if (hasGtmHead && hasDataLayer && hasGtmNoscript && !hasGtmHeadOff && !hasGtmNoscriptOff) {
    results.test1 = 'PASS';
    console.log('>>> TEST 1 RESULT: PASS');
  } else {
    results.test1 = 'FAIL';
    console.log('>>> TEST 1 RESULT: FAIL');
  }

  // -------------------------------------------------------------
  // TEST 2: Toggle ON + ID empty -> No script, warning in admin, no console error
  // -------------------------------------------------------------
  console.log('\n--- TEST 2: Toggle ON + ID Empty ---');
  const emptySaveRes = await request('https://jawatamart.com/api/admin/settings', {
    method: 'PUT',
    headers: authHeaders
  }, {
    enableGTM: true,
    gtmId: '',
    enableGA4: true,
    ga4MeasurementId: ''
  });
  console.log('2 Save empty IDs status:', emptySaveRes.statusCode);
  await new Promise(r => setTimeout(r, 800));

  const sf2Res = await request('https://jawatamart.com/?cb=' + Date.now());
  const sf2Html = sf2Res.body;
  const noBrokenGtm = !sf2Html.includes('gtm.js') && !sf2Html.includes('ns.html');
  const noBrokenGa4 = !sf2Html.includes('googletagmanager.com/gtag/js');

  // Verify Admin settings returns empty status (isGTMConfigured=false, isGA4Configured=false)
  const getAdminRes = await request('https://jawatamart.com/api/admin/settings', { headers: authHeaders });
  const adminSettings = JSON.parse(getAdminRes.body);
  const isGtmUnconfigured = adminSettings.envStatus.isGTMConfigured === false;
  const isGa4Unconfigured = adminSettings.envStatus.isGA4Configured === false;

  console.log('2 Storefront has no broken GTM script:', noBrokenGtm);
  console.log('2 Storefront has no broken GA4 script:', noBrokenGa4);
  console.log('2 Admin reports GTM unconfigured (triggers warning):', isGtmUnconfigured);
  console.log('2 Admin reports GA4 unconfigured (triggers warning):', isGa4Unconfigured);

  if (noBrokenGtm && noBrokenGa4 && isGtmUnconfigured && isGa4Unconfigured) {
    results.test2 = 'PASS';
    console.log('>>> TEST 2 RESULT: PASS');
  } else {
    results.test2 = 'FAIL';
    console.log('>>> TEST 2 RESULT: FAIL');
  }

  // -------------------------------------------------------------
  // TEST 3: Invalid ID Save -> Reject, previous value preserved
  // -------------------------------------------------------------
  console.log('\n--- TEST 3: Invalid ID Save Rejection ---');
  // First set a known valid value
  await request('https://jawatamart.com/api/admin/settings', {
    method: 'PUT',
    headers: authHeaders
  }, {
    gtmId: 'GTM-KEEP123'
  });

  // Try saving full script tag
  const scriptTagRes = await request('https://jawatamart.com/api/admin/settings', {
    method: 'PUT',
    headers: authHeaders
  }, {
    gtmId: '<script>alert("hack")</script>'
  });
  console.log('3a Script tag reject status:', scriptTagRes.statusCode, JSON.parse(scriptTagRes.body).error);

  // Try saving malformed ID
  const malformedRes = await request('https://jawatamart.com/api/admin/settings', {
    method: 'PUT',
    headers: authHeaders
  }, {
    gtmId: 'invalid-id-without-prefix'
  });
  console.log('3b Malformed ID reject status:', malformedRes.statusCode, JSON.parse(malformedRes.body).error);

  // Verify previous value was preserved
  const verifyKeepRes = await request('https://jawatamart.com/api/admin/settings', { headers: authHeaders });
  const keptId = JSON.parse(verifyKeepRes.body).settings.gtmId;
  console.log('3c Current GTM ID in settings after rejected saves:', keptId);

  if (scriptTagRes.statusCode === 400 && malformedRes.statusCode === 400 && keptId === 'GTM-KEEP123') {
    results.test3 = 'PASS';
    console.log('>>> TEST 3 RESULT: PASS');
  } else {
    results.test3 = 'FAIL';
    console.log('>>> TEST 3 RESULT: FAIL');
  }

  // -------------------------------------------------------------
  // TEST 4: Valid GA4 ID -> gtag loads; OFF -> does not load; GTM active -> double-counting prevented
  // -------------------------------------------------------------
  console.log('\n--- TEST 4: GA4 Wiring & Double-Counting Prevention ---');
  // 4a: Valid GA4 with direct route (GTM disabled or ga4ViaGtm: false)
  const ga4DirectRes = await request('https://jawatamart.com/api/admin/settings', {
    method: 'PUT',
    headers: authHeaders
  }, {
    enableGA4: true,
    ga4MeasurementId: 'G-TESTGA499',
    enableGTM: false,
    ga4ViaGtm: false
  });
  console.log('4a Direct GA4 save status:', ga4DirectRes.statusCode);
  await new Promise(r => setTimeout(r, 800));

  const sf4aRes = await request('https://jawatamart.com/?cb=' + Date.now());
  const sf4aHtml = sf4aRes.body;
  const hasDirectGtag = sf4aHtml.includes('gtag/js?id=G-TESTGA499');
  const hasGtagConfig = sf4aHtml.includes("gtag('config', 'G-TESTGA499'");
  console.log('4a Direct gtag script loaded:', hasDirectGtag);
  console.log('4a Direct gtag config loaded:', hasGtagConfig);

  // 4b: Turn GA4 OFF
  await request('https://jawatamart.com/api/admin/settings', {
    method: 'PUT',
    headers: authHeaders
  }, {
    enableGA4: false
  });
  await new Promise(r => setTimeout(r, 800));

  const sf4bRes = await request('https://jawatamart.com/?cb=' + Date.now());
  const sf4bHtml = sf4bRes.body;
  const noGtagWhenOff = !sf4bHtml.includes('G-TESTGA499');
  console.log('4b gtag absent when GA4 OFF:', noGtagWhenOff);

  // 4c: GTM active AND GA4 active with ga4ViaGtm: true (Route: GTM Container)
  await request('https://jawatamart.com/api/admin/settings', {
    method: 'PUT',
    headers: authHeaders
  }, {
    enableGTM: true,
    gtmId: 'GTM-TEST999',
    enableGA4: true,
    ga4MeasurementId: 'G-TESTGA499',
    ga4ViaGtm: true
  });
  await new Promise(r => setTimeout(r, 1000));

  const sf4cRes = await request('https://jawatamart.com/?cb=' + Date.now());
  const sf4cHtml = sf4cRes.body;
  const hasGtm4c = sf4cHtml.includes('gtm.js?id=') && sf4cHtml.includes('GTM-TEST999');
  const directGtagSuppressed = !sf4cHtml.includes('gtag/js?id=G-TESTGA499');
  console.log('4c GTM is active:', hasGtm4c);
  console.log('4c Direct gtag.js suppressed (preventing double-counting):', directGtagSuppressed);
  console.log('4c Active route: Google Tag Manager Container (dataLayer standard events)');

  if (hasDirectGtag && hasGtagConfig && noGtagWhenOff && hasGtm4c && directGtagSuppressed) {
    results.test4 = 'PASS';
    console.log('>>> TEST 4 RESULT: PASS');
  } else {
    results.test4 = 'FAIL';
    console.log('>>> TEST 4 RESULT: FAIL');
  }

  // -------------------------------------------------------------
  // TEST 5: Settings Persistence Check (delivery, storeName, etc. NOT altered)
  // -------------------------------------------------------------
  console.log('\n--- TEST 5: Settings Persistence Check ---');
  const checkSettingsRes = await request('https://jawatamart.com/api/admin/settings', { headers: authHeaders });
  const finalSettings = JSON.parse(checkSettingsRes.body).settings;

  const storeNameMatches = finalSettings.storeName === initSettings.storeName;
  const insideFeeMatches = finalSettings.insideDhakaFee === 70;
  const suburbsFeeMatches = finalSettings.suburbsDhakaFee === 100;
  const outsideFeeMatches = finalSettings.outsideDhakaFee === 130;
  const freeThresholdMatches = finalSettings.freeDeliveryThreshold === 2000;

  console.log('5 Store name preserved:', storeNameMatches, finalSettings.storeName);
  console.log('5 Inside Dhaka fee preserved (70):', insideFeeMatches, finalSettings.insideDhakaFee);
  console.log('5 Suburbs Dhaka fee preserved (100):', suburbsFeeMatches, finalSettings.suburbsDhakaFee);
  console.log('5 Outside Dhaka fee preserved (130):', outsideFeeMatches, finalSettings.outsideDhakaFee);
  console.log('5 Free delivery threshold preserved (2000):', freeThresholdMatches, finalSettings.freeDeliveryThreshold);

  if (storeNameMatches && insideFeeMatches && suburbsFeeMatches && outsideFeeMatches && freeThresholdMatches) {
    results.test5 = 'PASS';
    console.log('>>> TEST 5 RESULT: PASS');
  } else {
    results.test5 = 'FAIL';
    console.log('>>> TEST 5 RESULT: FAIL');
  }

  // -------------------------------------------------------------
  // TEST 6: Cleanup Test Data (Empty placeholder IDs, cart empty, no real data touched)
  // -------------------------------------------------------------
  console.log('\n--- TEST 6: Cleanup & Final Integrity Verification ---');
  // Reset GTM & GA4 IDs to empty (original live state) with toggles ON as owner left them
  await request('https://jawatamart.com/api/admin/settings', {
    method: 'PUT',
    headers: authHeaders
  }, {
    gtmId: '',
    enableGTM: true,
    ga4MeasurementId: '',
    enableGA4: true,
    ga4ViaGtm: true
  });
  console.log('6 Reset GTM & GA4 to empty clean state with toggles preserved.');

  await new Promise(r => setTimeout(r, 800));

  // Verify storefront clean
  const cleanSfRes = await request('https://jawatamart.com/?cb=' + Date.now());
  const cleanHtml = cleanSfRes.body;
  const cleanFromTestIds = !cleanHtml.includes('GTM-TEST') && !cleanHtml.includes('G-TEST');
  console.log('6 Storefront clean from test IDs:', cleanFromTestIds);

  // Check products & categories
  const prodsRes = await request('https://jawatamart.com/api/products?includeInactive=true&limit=200');
  const prodsJson = JSON.parse(prodsRes.body);
  const liveProdsCount = prodsJson.products?.length;
  console.log('6 Live products count:', liveProdsCount, '(Expected: > 60)');

  const ordersRes = await request('https://jawatamart.com/api/admin/orders', { headers: authHeaders });
  const ordersJson = JSON.parse(ordersRes.body);
  const liveOrdersCount = ordersJson.total || ordersJson.orders?.length;
  console.log('6 Live orders count:', liveOrdersCount, '(Expected: 6)');

  if (cleanFromTestIds && liveProdsCount > 60 && liveOrdersCount === 6) {
    results.test6 = 'PASS';
    console.log('>>> TEST 6 RESULT: PASS');
  } else {
    results.test6 = 'FAIL';
    console.log('>>> TEST 6 RESULT: FAIL');
  }

  console.log('\n=============================================================');
  console.log('FINAL ACCEPTANCE TEST REPORT:');
  console.log(JSON.stringify(results, null, 2));
  console.log('=============================================================');
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
