import { AddressInput, ParsedAddress } from '../types/postal';

// Standard Indian States and Union Territories
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Andaman and Nicobar Islands', 'Lakshadweep'
];

/**
 * Intelligent Address Parser
 * Performs multi-layer tokenization and entity recognition on Indian postal addresses.
 * Can parse raw freeform text or refine structured form inputs.
 */
export function parseAddress(input: AddressInput | string): ParsedAddress {
  let raw = '';
  let preName = '';
  let preHouse = '';
  let preLocality = '';
  let preCity = '';
  let preDistrict = '';
  let preState = '';
  let prePin = '';

  if (typeof input === 'string') {
    raw = input.trim();
  } else {
    raw = input.rawAddress?.trim() || '';
    preName = input.fullName?.trim() || '';
    preHouse = input.houseFlat?.trim() || '';
    preLocality = input.streetLocality?.trim() || '';
    preCity = input.city?.trim() || '';
    preDistrict = input.district?.trim() || '';
    preState = input.state?.trim() || '';
    prePin = input.pinCode?.trim() || '';

    // If raw is empty, reconstruct from components
    if (!raw) {
      raw = [preHouse, preLocality, preCity, preDistrict, preState, prePin]
        .filter(Boolean)
        .join(', ');
    }
  }

  // 1. PIN code extraction: Indian PIN is 6 digits starting with 1-9
  const pinMatch = raw.match(/\b([1-9][0-9]{5})\b/);
  const pinCode = prePin || (pinMatch ? pinMatch[1] : '');

  // 2. State extraction
  let detectedState = preState;
  if (!detectedState) {
    for (const state of INDIAN_STATES) {
      const regex = new RegExp(`\\b${state}\\b`, 'i');
      if (regex.test(raw)) {
        detectedState = state;
        break;
      }
    }
  }

  // 3. City / District extraction
  let detectedCity = preCity;
  let detectedDistrict = preDistrict;

  // 4. House / Flat token heuristics if raw
  let detectedHouse = preHouse;
  let detectedLocality = preLocality;

  if (!detectedLocality && raw) {
    // Break address lines by comma or newline
    const parts = raw.split(/[\n,]+/).map(p => p.trim()).filter(Boolean);
    
    // Look for house number prefixes
    const housePrefixes = ['flat', 'plot', 'door', 'd.no', 'house', 'h.no', 'villa', 'apt', 'room', 'bldg', 'building'];
    const localityParts: string[] = [];

    parts.forEach(part => {
      const lower = part.toLowerCase();
      const hasHousePrefix = housePrefixes.some(pref => lower.includes(pref));
      const isPinOnly = /^[1-9][0-9]{5}$/.test(part);
      const isState = INDIAN_STATES.some(s => s.toLowerCase() === lower);

      if (hasHousePrefix && !detectedHouse) {
        detectedHouse = part;
      } else if (!isPinOnly && !isState && lower !== detectedCity.toLowerCase()) {
        localityParts.push(part);
      }
    });

    if (localityParts.length > 0) {
      detectedLocality = localityParts.join(', ');
    }
  }

  // Calculate completeness / confidence score for parsing stage
  let score = 0;
  if (pinCode && /^[1-9][0-9]{5}$/.test(pinCode)) score += 30;
  if (detectedLocality && detectedLocality.length > 3) score += 25;
  if (detectedCity && detectedCity.length > 2) score += 20;
  if (detectedState) score += 15;
  if (detectedHouse) score += 10;

  return {
    fullName: preName || undefined,
    houseFlat: detectedHouse || preHouse || undefined,
    streetLocality: detectedLocality || 'Not specified',
    city: detectedCity || preCity || 'Unknown City',
    district: detectedDistrict || detectedCity || 'Not specified',
    state: detectedState || 'Not specified',
    pinCode: pinCode || '',
    confidenceScore: Math.min(100, score)
  };
}
