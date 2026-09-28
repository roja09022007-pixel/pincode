import { DEMO_POSTAL_RECORDS } from '../data/demoPostalRecords';
import { PostalOfficeRecord } from '../types/postal';

export interface PostalLookupOptions {
  useCache?: boolean;
  source?: 'demo' | 'api';
}

/**
 * Postal Service Abstraction
 * 
 * DESIGN RATIONALE:
 * In enterprise / government workflows, postal databases can be queried via:
 * 1. Offline in-memory dataset (Demo Postal Dataset)
 * 2. Enterprise Indian Post Master database (PostgreSQL / Cloud SQL)
 * 3. Government OpenAPI (data.gov.in / postalpincode.in)
 * 
 * This service encapsulates the lookup interface so changing the provider
 * requires zero changes to the UI or verification business logic.
 */
class PostalService {
  private localRecords: PostalOfficeRecord[] = DEMO_POSTAL_RECORDS;

  /**
   * Search postal records by 6-digit PIN code
   */
  async getByPincode(pincode: string): Promise<PostalOfficeRecord[]> {
    const cleanPin = pincode.trim().replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      return [];
    }

    // --- FUTURE API HOOK ---
    // If connecting to a live postal API, uncomment and adapt:
    // return this.getPostalDataFromAPI(cleanPin);

    // Default: Lookup against Demo Postal Dataset
    return this.localRecords.filter(rec => rec.pincode === cleanPin);
  }

  /**
   * Search postal records by locality, city, or post office name keywords
   */
  async searchByLocality(query: string, city?: string, state?: string): Promise<PostalOfficeRecord[]> {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return [];

    const queryWords = cleanQuery.split(/[\s,]+/).filter(w => w.length > 2);

    return this.localRecords.filter(rec => {
      const officeMatch = rec.officeName.toLowerCase().includes(cleanQuery);
      const talukMatch = rec.taluk.toLowerCase().includes(cleanQuery);
      const districtMatch = rec.district.toLowerCase().includes(cleanQuery);
      
      const localityMatch = rec.matchedLocalities?.some(loc => {
        const locLower = loc.toLowerCase();
        return locLower.includes(cleanQuery) || queryWords.some(w => locLower.includes(w));
      });

      let matches = officeMatch || talukMatch || districtMatch || !!localityMatch;

      if (matches && city) {
        const cityLower = city.toLowerCase();
        const cityMatches = rec.district.toLowerCase().includes(cityLower) ||
                            rec.division.toLowerCase().includes(cityLower) ||
                            rec.region.toLowerCase().includes(cityLower);
        if (!cityMatches) {
          // Soft check: allow if locality match is very high
        }
      }

      if (matches && state) {
        const stateLower = state.toLowerCase();
        if (rec.state.toLowerCase() !== stateLower && !rec.circle.toLowerCase().includes(stateLower)) {
          // If state explicitly disagrees, flag or lower priority
        }
      }

      return matches;
    });
  }

  /**
   * Find candidate post offices for an address given both PIN and locality info
   */
  async resolvePostOffices(pin: string, locality: string, city?: string, state?: string): Promise<{
    pinMatchedOffices: PostalOfficeRecord[];
    localityMatchedOffices: PostalOfficeRecord[];
  }> {
    const [pinMatchedOffices, localityMatchedOffices] = await Promise.all([
      this.getByPincode(pin),
      this.searchByLocality(locality, city, state)
    ]);

    return {
      pinMatchedOffices,
      localityMatchedOffices
    };
  }

  /**
   * Identify best delivery post office from a list of records
   * Prefers 'Delivery' status and 'S.O' or 'H.O'
   */
  selectPrimaryDeliveryOffice(records: PostalOfficeRecord[]): PostalOfficeRecord | undefined {
    if (!records || records.length === 0) return undefined;
    
    // First priority: Delivery S.O
    const deliverySO = records.find(r => r.deliveryStatus === 'Delivery' && (r.officeType === 'S.O' || r.officeType === 'H.O'));
    if (deliverySO) return deliverySO;

    // Second priority: Any Delivery office
    const anyDelivery = records.find(r => r.deliveryStatus === 'Delivery');
    if (anyDelivery) return anyDelivery;

    // Fallback: First record
    return records[0];
  }

  /**
   * Example placeholder for real-time external postal API
   * Replace DEMO mode by pointing this to your API gateway or data.gov.in
   */
  async getPostalDataFromAPI(pincode: string): Promise<PostalOfficeRecord[]> {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      if (!response.ok) throw new Error('Postal API network error');
      const data = await response.json();
      
      if (Array.isArray(data) && data[0]?.Status === 'Success') {
        const postOffices = data[0].PostOffice || [];
        return postOffices.map((po: any) => ({
          officeName: `${po.Name} ${po.BranchType}`,
          pincode: po.Pincode,
          officeType: (po.BranchType?.includes('Sub') ? 'S.O' : po.BranchType?.includes('Head') ? 'H.O' : 'B.O') as any,
          deliveryStatus: po.DeliveryStatus === 'Delivery' ? 'Delivery' : 'Non-Delivery',
          division: po.Division,
          region: po.Region,
          circle: po.Circle,
          taluk: po.Block || po.Taluk || '',
          district: po.District,
          state: po.State,
          matchedLocalities: [po.Name]
        }));
      }
      return [];
    } catch {
      return [];
    }
  }

  /**
   * Returns count of demo records
   */
  getRecordCount(): number {
    return this.localRecords.length;
  }
}

export const postalService = new PostalService();
