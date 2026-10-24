import { DeliveryZone, StoreSettings } from './types';



export interface BDDivision {

  name: string;

  districts: string[];

}



export const BD_DIVISIONS: BDDivision[] = [

  {

    name: 'Dhaka',

    districts: [

      'Dhaka',

      'Gazipur',

      'Narayanganj',

      'Tangail',

      'Narsingdi',

      'Faridpur',

      'Manikganj',

      'Munshiganj',

      'Gopalganj',

      'Madaripur',

      'Rajbari',

      'Shariatpur',

      'Kishoreganj',

    ],

  },

  {

    name: 'Chattogram',

    districts: [

      'Chattogram',

      "Cox's Bazar",

      'Cumilla',

      'Feni',

      'Brahmanbaria',

      'Noakhali',

      'Chandpur',

      'Lakshmipur',

      'Rangamati',

      'Bandarban',

      'Khagrachhari',

    ],

  },

  {

    name: 'Sylhet',

    districts: ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],

  },

  {

    name: 'Rajshahi',

    districts: [

      'Rajshahi',

      'Bogura',

      'Pabna',

      'Sirajganj',

      'Naogaon',

      'Natore',

      'Chapai Nawabganj',

      'Joypurhat',

    ],

  },

  {

    name: 'Khulna',

    districts: [

      'Khulna',

      'Jashore',

      'Kushtia',

      'Satkhira',

      'Bagerhat',

      'Jhenaidah',

      'Chuadanga',

      'Meherpur',

      'Magura',

      'Narail',

    ],

  },

  {

    name: 'Barishal',

    districts: ['Barishal', 'Patuakhali', 'Bhola', 'Pirojpur', 'Jhalokati', 'Barguna'],

  },

  {

    name: 'Rangpur',

    districts: [

      'Rangpur',

      'Dinajpur',

      'Gaibandha',

      'Kurigram',

      'Lalmonirhat',

      'Nilphamari',

      'Panchagarh',

      'Thakurgaon',

    ],

  },

  {

    name: 'Mymensingh',

    districts: ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'],

  },

];



export const DHAKA_AREAS = [

  'Dhanmondi',

  'Gulshan 1',

  'Gulshan 2',

  'Banani',

  'Uttara',

  'Mirpur',

  'Mohammadpur',

  'Badda',

  'Bashundhara R/A',

  'Baridhara',

  'Motijheel',

  'Khilgaon',

  'Malibagh',

  'Shantinagar',

  'Lalmatia',

  'Tejgaon',

  'Panthapath',

  'Moghbazar',

  'Old Dhaka',

  'Jatrabari',

  'Rampura',

  'Nikunja',

  'Cantonment',

  'Khilkhet',

];



export const ALL_BD_DISTRICTS: string[] = Array.from(

  new Set(BD_DIVISIONS.flatMap((d) => d.districts))

).sort((a, b) => {

  if (a === 'Dhaka') return -1;

  if (b === 'Dhaka') return 1;

  return a.localeCompare(b);

});



export function getDivisionForDistrict(districtName: string): string {

  const found = BD_DIVISIONS.find((d) => d.districts.includes(districtName));

  return found?.name || 'Dhaka';

}



/**

 * Default District to Delivery Zone Mapping:

 * - Dhaka -> INSIDE_DHAKA

 * - Narayanganj, Gazipur, Munshiganj, Manikganj, Narsingdi -> DHAKA_SUBURBS (Nearby)

 * - All other districts -> OUTSIDE_DHAKA

 */

export const DEFAULT_DISTRICT_ZONE_MAPPING: Record<string, DeliveryZone> = {

  Dhaka: 'INSIDE_DHAKA',

  Narayanganj: 'DHAKA_SUBURBS',

  Gazipur: 'DHAKA_SUBURBS',

  Munshiganj: 'DHAKA_SUBURBS',

  Manikganj: 'DHAKA_SUBURBS',

  Narsingdi: 'DHAKA_SUBURBS',

};



// Populate default for all remaining 58 districts as OUTSIDE_DHAKA

for (const dist of ALL_BD_DISTRICTS) {

  if (!DEFAULT_DISTRICT_ZONE_MAPPING[dist]) {

    DEFAULT_DISTRICT_ZONE_MAPPING[dist] = 'OUTSIDE_DHAKA';

  }

}



/**

 * Resolves the delivery zone for a given district.

 * Checks custom mapping from settings first, then falls back to default mapping.

 */

export function getZoneForDistrict(

  districtName?: string | null,

  customMapping?: Record<string, DeliveryZone> | null

): DeliveryZone {

  if (!districtName || !districtName.trim()) {

    return 'INSIDE_DHAKA';

  }

  const cleanName = districtName.trim();



  // 1. Direct match in customMapping

  if (customMapping && customMapping[cleanName]) {

    return customMapping[cleanName];

  }



  // 2. Case-insensitive match in customMapping

  if (customMapping) {

    const lower = cleanName.toLowerCase();

    for (const [key, val] of Object.entries(customMapping)) {

      if (key.toLowerCase() === lower) {

        return val;

      }

    }

  }



  // 3. Fallback to default mapping

  if (DEFAULT_DISTRICT_ZONE_MAPPING[cleanName]) {

    return DEFAULT_DISTRICT_ZONE_MAPPING[cleanName];

  }

  const lower = cleanName.toLowerCase();

  for (const [key, val] of Object.entries(DEFAULT_DISTRICT_ZONE_MAPPING)) {

    if (key.toLowerCase() === lower) {

      return val;

    }

  }



  return 'OUTSIDE_DHAKA';

}



/**

 * Calculates delivery fee based on subtotal, district, and settings.

 * Single source of truth across Storefront, Checkout, Quick Order, and Server APIs.

 */

export function calculateDeliveryCharge({
  subtotal,
  district,
  settings,
}: {
  subtotal: number;
  district?: string | null;
  settings?: Partial<StoreSettings> | null;
}): { zone: DeliveryZone; fee: number; isFree: boolean; zoneLabel: string } {
  const insideFee = Number(settings?.insideDhakaFee) || 70;
  const suburbsFee = Number(settings?.suburbsDhakaFee) || 100;
  const outsideFee = Number(settings?.outsideDhakaFee) || 130;

  const zone = getZoneForDistrict(district, settings?.districtZoneMapping);

  let fee = outsideFee;
  if (zone === 'INSIDE_DHAKA') {
    fee = insideFee;
  } else if (zone === 'DHAKA_SUBURBS') {
    fee = suburbsFee;
  } else {
    fee = outsideFee;
  }

  const zoneLabel =
    zone === 'INSIDE_DHAKA'
      ? 'Inside Dhaka'
      : zone === 'DHAKA_SUBURBS'
      ? 'ঢাকার আশেপাশে (Nearby)'
      : 'Outside Dhaka (ঢাকার বাইরে)';

  return {
    zone,
    fee,
    isFree: false,
    zoneLabel,
  };
}

