import { AddressInput } from '../types/postal';

export interface DemoPreset {
  id: string;
  name: string;
  tag: 'VERIFIED' | 'MISMATCH' | 'NEEDS_REVIEW';
  description: string;
  address: AddressInput;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'demo-verified-mvp',
    name: 'Case 1: Fully Verified (MVP Colony, Vizag)',
    tag: 'VERIFIED',
    description: 'Valid locality, district, state and matching PIN (530017). Identifies MVP Colony S.O.',
    address: {
      fullName: 'Dr. K. Srinivas Rao',
      houseFlat: 'Plot No. 42, Flat 3B, Golden Palms',
      streetLocality: 'Sector 6, MVP Colony',
      city: 'Visakhapatnam',
      district: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      pinCode: '530017',
      rawAddress: 'Flat 3B, Golden Palms, Plot 42, Sector 6, MVP Colony, Visakhapatnam, Andhra Pradesh 530017'
    }
  },
  {
    id: 'demo-mismatch-mvp',
    name: 'Case 2: Possible Mismatch (MVP Colony with Lawsons Bay PIN)',
    tag: 'MISMATCH',
    description: 'Locality MVP Colony entered with adjacent PIN 530018 (Lawsons Bay) instead of 530017.',
    address: {
      fullName: 'A. Lakshmi Narayana',
      houseFlat: 'Door 14-3-8',
      streetLocality: 'MVP Double Road, MVP Colony',
      city: 'Visakhapatnam',
      district: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      pinCode: '530018', // Lawsons Bay SO PIN!
      rawAddress: 'Door 14-3-8, MVP Double Road, MVP Colony, Visakhapatnam - 530018, Andhra Pradesh'
    }
  },
  {
    id: 'demo-review-ambiguous',
    name: 'Case 3: Needs Review (Ambiguous Locality)',
    tag: 'NEEDS_REVIEW',
    description: 'Locality name "Gandhi Nagar" exists across multiple postal circles and districts.',
    address: {
      fullName: 'Rajesh Kumar Verma',
      houseFlat: 'House 112, 2nd Cross',
      streetLocality: 'Gandhi Nagar Main Road',
      city: 'Gandhi Nagar',
      district: '', // Missing specific district
      state: '',   // Missing state
      pinCode: '560009',
      rawAddress: 'House 112, 2nd Cross, Gandhi Nagar Main Road, PIN 560009'
    }
  },
  {
    id: 'demo-verified-indiranagar',
    name: 'Case 4: Verified (Indiranagar, Bengaluru)',
    tag: 'VERIFIED',
    description: 'Matching PIN 560038 for Indiranagar S.O in Bengaluru Urban.',
    address: {
      fullName: 'Priya Sundaram',
      houseFlat: 'Villa 18, Ferns Meadows',
      streetLocality: '100 Feet Road, HAL 2nd Stage, Indiranagar',
      city: 'Bengaluru',
      district: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560038',
      rawAddress: 'Villa 18, Ferns Meadows, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038'
    }
  },
  {
    id: 'demo-mismatch-bandra',
    name: 'Case 5: Mismatch (Bandra West with South Mumbai PIN)',
    tag: 'MISMATCH',
    description: 'Bandra West locality entered with Mumbai Fort GPO PIN 400001 instead of 400050.',
    address: {
      fullName: 'Rohan Mehta',
      houseFlat: 'B-702, Sea Crest Apartments',
      streetLocality: 'Pali Hill, Bandra West',
      city: 'Mumbai',
      district: 'Mumbai Suburban',
      state: 'Maharashtra',
      pinCode: '400001', // Mumbai GPO instead of Bandra West 400050
      rawAddress: 'B-702 Sea Crest, Pali Hill, Bandra West, Mumbai 400001, Maharashtra'
    }
  }
];
