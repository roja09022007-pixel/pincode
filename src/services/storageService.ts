import { DashboardStats, VerificationHistoryItem, VerificationResult, VerificationStatus } from '../types/postal';

const STORAGE_KEY = 'postal_ai_verification_history_v1';

export const INITIAL_DEMO_HISTORY: VerificationHistoryItem[] = [
  {
    id: 'VER-SEED-101',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    addressSummary: 'Plot 42, Sector 6, MVP Colony',
    city: 'Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    pinCode: '530017',
    postOfficeName: 'MVP Colony S.O',
    status: 'VERIFIED',
    confidence: 'High',
    result: {
      id: 'VER-SEED-101',
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      status: 'VERIFIED',
      confidence: 'High',
      confidenceReason: 'High confidence means the available postal information provides a strong match across locality, PIN, and circle.',
      input: {
        fullName: 'Dr. K. Srinivas Rao',
        houseFlat: 'Plot 42, Flat 3B',
        streetLocality: 'Sector 6, MVP Colony',
        city: 'Visakhapatnam',
        district: 'Visakhapatnam',
        state: 'Andhra Pradesh',
        pinCode: '530017'
      },
      parsedAddress: {
        fullName: 'Dr. K. Srinivas Rao',
        houseFlat: 'Plot 42, Flat 3B',
        streetLocality: 'Sector 6, MVP Colony',
        city: 'Visakhapatnam',
        district: 'Visakhapatnam',
        state: 'Andhra Pradesh',
        pinCode: '530017',
        confidenceScore: 95
      },
      matchedPostOffice: {
        officeName: 'MVP Colony S.O',
        pincode: '530017',
        officeType: 'S.O',
        deliveryStatus: 'Delivery',
        division: 'Visakhapatnam',
        region: 'Visakhapatnam',
        circle: 'Andhra Pradesh',
        taluk: 'Visakhapatnam Urban',
        district: 'Visakhapatnam',
        state: 'Andhra Pradesh'
      },
      enteredPin: '530017',
      explanation: {
        summary: 'The supplied address components are consistent with the available postal information.',
        details: [
          'Locality MVP Colony is directly served by MVP Colony S.O.',
          'Entered PIN 530017 maps to Visakhapatnam division.',
          'State jurisdiction conforms to Andhra Pradesh Postal Circle.'
        ],
        postalMatchReason: 'Locality and PIN code have a verified one-to-one correspondence.'
      },
      source: 'DEMO_DATASET',
      processingTimeMs: 1420,
      stagesCompleted: 6
    }
  },
  {
    id: 'VER-SEED-102',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    addressSummary: 'MVP Double Road, MVP Colony',
    city: 'Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    pinCode: '530018',
    postOfficeName: 'Lawsons Bay S.O',
    status: 'MISMATCH',
    confidence: 'High',
    result: {
      id: 'VER-SEED-102',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: 'MISMATCH',
      confidence: 'High',
      confidenceReason: 'High confidence means the postal dataset explicitly maps this locality to a different delivery post office and PIN.',
      input: {
        fullName: 'A. Lakshmi Narayana',
        streetLocality: 'MVP Double Road, MVP Colony',
        city: 'Visakhapatnam',
        district: 'Visakhapatnam',
        state: 'Andhra Pradesh',
        pinCode: '530018'
      },
      parsedAddress: {
        streetLocality: 'MVP Double Road, MVP Colony',
        city: 'Visakhapatnam',
        district: 'Visakhapatnam',
        state: 'Andhra Pradesh',
        pinCode: '530018',
        confidenceScore: 90
      },
      matchedPostOffice: {
        officeName: 'Lawsons Bay S.O',
        pincode: '530018',
        officeType: 'S.O',
        deliveryStatus: 'Delivery',
        division: 'Visakhapatnam',
        region: 'Visakhapatnam',
        circle: 'Andhra Pradesh',
        taluk: 'Visakhapatnam Urban',
        district: 'Visakhapatnam',
        state: 'Andhra Pradesh'
      },
      enteredPin: '530018',
      suggestedPin: '530017',
      suggestedPostOffice: 'MVP Colony S.O',
      mismatchType: 'PIN_LOCALITY_MISMATCH',
      explanation: {
        summary: 'The supplied PIN does not appear to correspond to the specified locality according to the available postal dataset.',
        details: [
          'Entered PIN 530018 corresponds to Lawsons Bay S.O.',
          'However, MVP Colony is serviced by MVP Colony S.O under PIN 530017.',
          'Discrepancy: 530018 (Entered) vs 530017 (Matched delivery office).'
        ],
        recommendation: 'Update PIN code from 530018 to 530017 (MVP Colony S.O) to avoid mail misrouting.',
        postalMatchReason: 'Locality belongs to MVP Colony S.O jurisdiction, not Lawsons Bay.'
      },
      source: 'DEMO_DATASET',
      processingTimeMs: 1380,
      stagesCompleted: 6
    }
  },
  {
    id: 'VER-SEED-103',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    addressSummary: '100 Feet Road, HAL 2nd Stage',
    city: 'Bengaluru',
    district: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560038',
    postOfficeName: 'Indiranagar S.O',
    status: 'VERIFIED',
    confidence: 'High',
    result: {
      id: 'VER-SEED-103',
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      status: 'VERIFIED',
      confidence: 'High',
      confidenceReason: 'High confidence means the available postal information provides a strong match.',
      input: {
        fullName: 'Priya Sundaram',
        streetLocality: '100 Feet Road, HAL 2nd Stage, Indiranagar',
        city: 'Bengaluru',
        district: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560038'
      },
      parsedAddress: {
        streetLocality: '100 Feet Road, Indiranagar',
        city: 'Bengaluru',
        district: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560038',
        confidenceScore: 92
      },
      matchedPostOffice: {
        officeName: 'Indiranagar S.O',
        pincode: '560038',
        officeType: 'S.O',
        deliveryStatus: 'Delivery',
        division: 'Bangalore East',
        region: 'Bengaluru HQ',
        circle: 'Karnataka',
        taluk: 'Bangalore North',
        district: 'Bengaluru',
        state: 'Karnataka'
      },
      enteredPin: '560038',
      explanation: {
        summary: 'The supplied address components are consistent with the available postal information.',
        details: [
          'Locality Indiranagar is directly served by Indiranagar S.O.',
          'Entered PIN 560038 correctly matches Bangalore East postal division.'
        ],
        postalMatchReason: 'Locality and PIN code verified in Karnataka Postal Circle.'
      },
      source: 'DEMO_DATASET',
      processingTimeMs: 1450,
      stagesCompleted: 6
    }
  },
  {
    id: 'VER-SEED-104',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    addressSummary: 'Gandhi Nagar Main Road',
    city: 'Gandhi Nagar',
    district: '',
    state: '',
    pinCode: '560009',
    postOfficeName: 'Gandhi Nagar S.O',
    status: 'NEEDS_REVIEW',
    confidence: 'Medium',
    result: {
      id: 'VER-SEED-104',
      timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      status: 'NEEDS_REVIEW',
      confidence: 'Medium',
      confidenceReason: 'Medium confidence means the locality name is ambiguous across multiple districts.',
      input: {
        streetLocality: 'Gandhi Nagar Main Road',
        city: 'Gandhi Nagar',
        state: '',
        pinCode: '560009'
      },
      parsedAddress: {
        streetLocality: 'Gandhi Nagar Main Road',
        city: 'Gandhi Nagar',
        district: 'Not specified',
        state: 'Not specified',
        pinCode: '560009',
        confidenceScore: 50
      },
      enteredPin: '560009',
      explanation: {
        summary: 'Locality information is ambiguous or incomplete.',
        details: [
          'Locality "Gandhi Nagar" is common to numerous postal divisions across India.',
          'Missing explicit district and state components in input.',
          'PIN 560009 belongs to Bengaluru, but confirmation of state is recommended.'
        ],
        recommendation: 'Specify district and state for automated postal dispatch.',
        postalMatchReason: 'Ambiguous locality requires additional component clarification.'
      },
      source: 'DEMO_DATASET',
      processingTimeMs: 1200,
      stagesCompleted: 6
    }
  },
  {
    id: 'VER-SEED-105',
    timestamp: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
    addressSummary: 'Pali Hill, Bandra West',
    city: 'Mumbai',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    pinCode: '400001',
    postOfficeName: 'Mumbai G.P.O',
    status: 'MISMATCH',
    confidence: 'High',
    result: {
      id: 'VER-SEED-105',
      timestamp: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
      status: 'MISMATCH',
      confidence: 'High',
      confidenceReason: 'High confidence means the postal dataset explicitly maps this locality to a different delivery post office and PIN.',
      input: {
        fullName: 'Rohan Mehta',
        streetLocality: 'Pali Hill, Bandra West',
        city: 'Mumbai',
        district: 'Mumbai Suburban',
        state: 'Maharashtra',
        pinCode: '400001'
      },
      parsedAddress: {
        streetLocality: 'Pali Hill, Bandra West',
        city: 'Mumbai',
        district: 'Mumbai Suburban',
        state: 'Maharashtra',
        pinCode: '400001',
        confidenceScore: 88
      },
      matchedPostOffice: {
        officeName: 'Mumbai G.P.O',
        pincode: '400001',
        officeType: 'G.P.O',
        deliveryStatus: 'Delivery',
        division: 'Mumbai GPO',
        region: 'Mumbai',
        circle: 'Maharashtra',
        taluk: 'Fort',
        district: 'Mumbai',
        state: 'Maharashtra'
      },
      enteredPin: '400001',
      suggestedPin: '400050',
      suggestedPostOffice: 'Bandra West S.O',
      mismatchType: 'PIN_LOCALITY_MISMATCH',
      explanation: {
        summary: 'The supplied PIN does not appear to correspond to the specified locality according to the available postal dataset.',
        details: [
          'Entered PIN 400001 corresponds to Mumbai G.P.O in South Mumbai.',
          'Locality Bandra West is served by Bandra West S.O with PIN 400050.'
        ],
        recommendation: 'Update PIN to 400050 to prevent dispatch across Mumbai postal zones.',
        postalMatchReason: 'Locality Bandra West is outside Mumbai GPO jurisdiction.'
      },
      source: 'DEMO_DATASET',
      processingTimeMs: 1410,
      stagesCompleted: 6
    }
  },
  {
    id: 'VER-SEED-106',
    timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    addressSummary: 'Connaught Place, Barakhamba Road',
    city: 'New Delhi',
    district: 'Central Delhi',
    state: 'Delhi',
    pinCode: '110001',
    postOfficeName: 'Connaught Place H.O',
    status: 'VERIFIED',
    confidence: 'High',
    result: {
      id: 'VER-SEED-106',
      timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
      status: 'VERIFIED',
      confidence: 'High',
      confidenceReason: 'High confidence means postal records verify this landmark directly.',
      input: {
        streetLocality: 'Connaught Place, Barakhamba Road',
        city: 'New Delhi',
        district: 'Central Delhi',
        state: 'Delhi',
        pinCode: '110001'
      },
      parsedAddress: {
        streetLocality: 'Connaught Place',
        city: 'New Delhi',
        district: 'Central Delhi',
        state: 'Delhi',
        pinCode: '110001',
        confidenceScore: 96
      },
      matchedPostOffice: {
        officeName: 'Connaught Place H.O',
        pincode: '110001',
        officeType: 'H.O',
        deliveryStatus: 'Delivery',
        division: 'New Delhi Central',
        region: 'Delhi',
        circle: 'Delhi',
        taluk: 'New Delhi',
        district: 'Central Delhi',
        state: 'Delhi'
      },
      enteredPin: '110001',
      explanation: {
        summary: 'The supplied address components are consistent with the available postal information.',
        details: [
          'Locality Connaught Place is the primary seat for Connaught Place H.O (PIN 110001).',
          'Circle, taluk and district match New Delhi Central records.'
        ],
        postalMatchReason: 'Verified one-to-one record match in Delhi Postal Circle.'
      },
      source: 'DEMO_DATASET',
      processingTimeMs: 1320,
      stagesCompleted: 6
    }
  }
];

class StorageService {
  getHistory(): VerificationHistoryItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Initialize with default demo history
        this.saveHistory(INITIAL_DEMO_HISTORY);
        return INITIAL_DEMO_HISTORY;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_DEMO_HISTORY;
    }
  }

  saveHistory(items: VerificationHistoryItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  addResult(result: VerificationResult): VerificationHistoryItem {
    const history = this.getHistory();
    const item: VerificationHistoryItem = {
      id: result.id,
      timestamp: result.timestamp,
      addressSummary: result.parsedAddress.streetLocality || result.input.streetLocality || 'Address',
      city: result.parsedAddress.city || result.input.city || 'City',
      district: result.parsedAddress.district || result.input.district || '',
      state: result.parsedAddress.state || result.input.state || '',
      pinCode: result.enteredPin,
      postOfficeName: result.matchedPostOffice?.officeName || result.suggestedPostOffice || 'Unknown Post Office',
      status: result.status,
      confidence: result.confidence,
      result
    };

    const updated = [item, ...history.filter(h => h.id !== item.id)].slice(0, 100);
    this.saveHistory(updated);
    return item;
  }

  deleteItem(id: string): void {
    const history = this.getHistory();
    const updated = history.filter(h => h.id !== id);
    this.saveHistory(updated);
  }

  clearHistory(): void {
    this.saveHistory([]);
  }

  resetDemoHistory(): void {
    this.saveHistory(INITIAL_DEMO_HISTORY);
  }

  getDashboardStats(): DashboardStats {
    const history = this.getHistory();
    const stats: DashboardStats = {
      total: history.length,
      verified: history.filter(h => h.status === 'VERIFIED').length,
      needsReview: history.filter(h => h.status === 'NEEDS_REVIEW').length,
      mismatch: history.filter(h => h.status === 'MISMATCH').length,
      unverified: history.filter(h => h.status === 'UNVERIFIED').length,
      recentActivity: []
    };

    // Build day-by-day activity trend for the last 7 days
    const dayMap = new Map<string, { verified: number; needsReview: number; mismatch: number }>();
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      dayMap.set(label, { verified: 0, needsReview: 0, mismatch: 0 });
    }

    history.forEach(item => {
      const itemDate = new Date(item.timestamp);
      const label = itemDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const current = dayMap.get(label);
      if (current) {
        if (item.status === 'VERIFIED') current.verified++;
        else if (item.status === 'NEEDS_REVIEW') current.needsReview++;
        else if (item.status === 'MISMATCH') current.mismatch++;
      }
    });

    stats.recentActivity = Array.from(dayMap.entries()).map(([date, counts]) => ({
      date,
      ...counts
    }));

    return stats;
  }
}

export const storageService = new StorageService();
