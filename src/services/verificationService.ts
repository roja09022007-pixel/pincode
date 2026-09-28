import { AddressInput, ConfidenceLevel, ParsedAddress, PostalOfficeRecord, VerificationResult, VerificationStatus, VerificationStep } from '../types/postal';
import { parseAddress } from './addressParser';
import { postalService } from './postalService';

export const VERIFICATION_STAGES: Array<{ step: number; title: string; description: string }> = [
  { step: 1, title: 'Parsing address', description: 'Deconstructing address into semantic tokens (house, street, locality, city, state, pin).' },
  { step: 2, title: 'Identifying locality', description: 'Detecting urban or rural delivery sector and normalized geographic entities.' },
  { step: 3, title: 'Checking PIN information', description: 'Querying postal records for postal circle, division, and office jurisdiction.' },
  { step: 4, title: 'Identifying delivery post office', description: 'Matching delivery office hierarchy (G.P.O, H.O, S.O, B.O) for locality.' },
  { step: 5, title: 'Comparing address and postal data', description: 'Cross-referencing entered PIN against locality post office jurisdiction.' },
  { step: 6, title: 'Generating verification result', description: 'Formulating human-readable validation summary and confidence metric.' }
];

export interface VerifyProgressCallback {
  (step: number, title: string, detail?: string): void;
}

class VerificationEngine {
  /**
   * Executes the 6-stage progressive verification workflow.
   * If onProgress is provided, yields each stage with a realistic cadence.
   */
  async verifyAddress(
    input: AddressInput,
    onProgress?: VerifyProgressCallback,
    stepDelayMs: number = 320
  ): Promise<VerificationResult> {
    const startTime = performance.now();

    // STAGE 1: Parsing address
    onProgress?.(1, 'Parsing address', 'Deconstructing house number, street, city, district, state, and PIN');
    if (stepDelayMs > 0) await new Promise(r => setTimeout(r, stepDelayMs));
    const parsed: ParsedAddress = parseAddress(input);

    // STAGE 2: Identifying locality
    onProgress?.(2, 'Identifying locality', `Targeting locality: "${parsed.streetLocality}", City: "${parsed.city}"`);
    if (stepDelayMs > 0) await new Promise(r => setTimeout(r, stepDelayMs));

    // STAGE 3: Checking PIN information
    onProgress?.(3, 'Checking PIN information', `Querying records for PIN: ${parsed.pinCode || 'None'}`);
    if (stepDelayMs > 0) await new Promise(r => setTimeout(r, stepDelayMs));
    const pinOffices = parsed.pinCode ? await postalService.getByPincode(parsed.pinCode) : [];

    // STAGE 4: Identifying delivery post office
    onProgress?.(4, 'Identifying delivery post office', 'Searching candidate delivery post offices for locality');
    if (stepDelayMs > 0) await new Promise(r => setTimeout(r, stepDelayMs));
    const localityOffices = await postalService.searchByLocality(parsed.streetLocality, parsed.city, parsed.state);

    // STAGE 5: Comparing address and postal data
    onProgress?.(5, 'Comparing address and postal data', 'Evaluating jurisdiction, district boundaries, and PIN consistency');
    if (stepDelayMs > 0) await new Promise(r => setTimeout(r, stepDelayMs));

    // STAGE 6: Generating verification result
    onProgress?.(6, 'Generating verification result', 'Synthesizing verdict, confidence level, and actionable explanation');
    if (stepDelayMs > 0) await new Promise(r => setTimeout(r, stepDelayMs));

    const result = this.evaluateRules(input, parsed, pinOffices, localityOffices, startTime);
    return result;
  }

  /**
   * Rule Evaluation Engine
   * Separates factual postal data lookup from business reasoning rules.
   */
  private evaluateRules(
    input: AddressInput,
    parsed: ParsedAddress,
    pinOffices: PostalOfficeRecord[],
    localityOffices: PostalOfficeRecord[],
    startTime: number
  ): VerificationResult {
    const id = `VER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const enteredPin = (parsed.pinCode || '').trim();
    const hasValidPinFormat = /^[1-9][0-9]{5}$/.test(enteredPin);

    // 1. PIN Format Validation
    if (!hasValidPinFormat) {
      return {
        id,
        timestamp: new Date().toISOString(),
        status: 'MISMATCH',
        confidence: 'Low',
        confidenceReason: 'Verification confidence is low because the entered PIN code does not match the standard 6-digit Indian Postal Code format.',
        input,
        parsedAddress: parsed,
        enteredPin,
        mismatchType: 'PIN_NOT_FOUND',
        explanation: {
          summary: 'Invalid PIN Code format provided.',
          details: [
            'Indian PIN codes must consist of exactly 6 digits beginning with a non-zero number (1–9).',
            `Entered value: "${enteredPin || 'Empty'}".`,
            'Postal verification cannot proceed without a valid PIN code.'
          ],
          recommendation: 'Please enter a valid 6-digit PIN code corresponding to the delivery address.',
          postalMatchReason: 'Format validation failed prior to database lookup.'
        },
        source: 'DEMO_DATASET',
        processingTimeMs: Math.round(performance.now() - startTime),
        stagesCompleted: 6
      };
    }

    // 2. Direct Match Evaluation:
    // Check if the entered PIN matches a post office that also covers this locality
    const directMatch = pinOffices.find(po => {
      const localityLower = parsed.streetLocality.toLowerCase();
      const officeNameLower = po.officeName.toLowerCase();
      if (officeNameLower.includes(localityLower) || localityLower.includes(officeNameLower.replace(/\s+(s\.o|h\.o|b\.o|g\.p\.o)/i, ''))) {
        return true;
      }
      return po.matchedLocalities?.some(loc => {
        const lLower = loc.toLowerCase();
        return localityLower.includes(lLower) || lLower.includes(localityLower);
      });
    });

    if (directMatch) {
      // Validate district / state consistency
      const districtMatch = !parsed.district || parsed.district.toLowerCase() === 'not specified' ||
        directMatch.district.toLowerCase().includes(parsed.district.toLowerCase()) ||
        parsed.district.toLowerCase().includes(directMatch.district.toLowerCase());

      const stateMatch = !parsed.state || parsed.state.toLowerCase() === 'not specified' ||
        directMatch.state.toLowerCase() === parsed.state.toLowerCase();

      if (districtMatch && stateMatch) {
        return {
          id,
          timestamp: new Date().toISOString(),
          status: 'VERIFIED',
          confidence: 'High',
          confidenceReason: 'High confidence means the available postal information provides a strong match across locality, PIN, district, and postal circle.',
          input,
          parsedAddress: parsed,
          matchedPostOffice: directMatch,
          alternativePostOffices: pinOffices.filter(po => po.officeName !== directMatch.officeName),
          enteredPin,
          explanation: {
            summary: 'The supplied address components are consistent with the available postal information.',
            details: [
              `Locality "${parsed.streetLocality}" is directly served by ${directMatch.officeName} (${directMatch.officeType}).`,
              `Entered PIN ${enteredPin} correctly maps to ${directMatch.taluk || directMatch.division} division, ${directMatch.district} District.`,
              `State jurisdiction (${directMatch.state}) conforms to Indian Postal Circle records.`
            ],
            recommendation: 'Address is validated for postal delivery and automated sorting.',
            postalMatchReason: 'Locality and PIN code have a verified one-to-one correspondence in the postal dataset.'
          },
          source: 'DEMO_DATASET',
          processingTimeMs: Math.round(performance.now() - startTime),
          stagesCompleted: 6
        };
      }
    }

    // 3. Mismatch Detection:
    // If locality matches a known post office with a DIFFERENT PIN than the one entered!
    if (localityOffices.length > 0) {
      const correctLocalityOffice = postalService.selectPrimaryDeliveryOffice(localityOffices);
      if (correctLocalityOffice && correctLocalityOffice.pincode !== enteredPin) {
        const enteredPinOffice = pinOffices[0];

        return {
          id,
          timestamp: new Date().toISOString(),
          status: 'MISMATCH',
          confidence: 'High',
          confidenceReason: 'High confidence means the postal dataset explicitly maps this locality to a different delivery post office and PIN.',
          input,
          parsedAddress: parsed,
          matchedPostOffice: enteredPinOffice,
          enteredPin,
          suggestedPin: correctLocalityOffice.pincode,
          suggestedPostOffice: correctLocalityOffice.officeName,
          mismatchType: 'PIN_LOCALITY_MISMATCH',
          explanation: {
            summary: 'The supplied PIN does not appear to correspond to the specified locality according to the available postal dataset.',
            details: [
              `Entered PIN ${enteredPin} corresponds to: ${enteredPinOffice ? `${enteredPinOffice.officeName} (${enteredPinOffice.district})` : 'another postal area'}.`,
              `However, locality "${parsed.streetLocality}" in ${parsed.city} is served by ${correctLocalityOffice.officeName} under PIN ${correctLocalityOffice.pincode}.`,
              `Discrepancy: ${enteredPin} (Entered) vs ${correctLocalityOffice.pincode} (Matched delivery office).`
            ],
            recommendation: `Update PIN code from ${enteredPin} to ${correctLocalityOffice.pincode} (${correctLocalityOffice.officeName}) to prevent delivery delays or misrouting.`,
            postalMatchReason: 'Locality belongs to a different postal delivery jurisdiction than the entered PIN code.'
          },
          source: 'DEMO_DATASET',
          processingTimeMs: Math.round(performance.now() - startTime),
          stagesCompleted: 6
        };
      }
    }

    // 4. District / State Mismatch Check
    if (pinOffices.length > 0) {
      const primaryPinOffice = pinOffices[0];
      const stateConflict = parsed.state && parsed.state.toLowerCase() !== 'not specified' &&
        primaryPinOffice.state.toLowerCase() !== parsed.state.toLowerCase();
      
      if (stateConflict) {
        return {
          id,
          timestamp: new Date().toISOString(),
          status: 'MISMATCH',
          confidence: 'High',
          confidenceReason: 'High confidence means the state in the address directly conflicts with the official Postal Circle for this PIN.',
          input,
          parsedAddress: parsed,
          matchedPostOffice: primaryPinOffice,
          enteredPin,
          mismatchType: 'STATE_MISMATCH',
          explanation: {
            summary: `PIN ${enteredPin} belongs to ${primaryPinOffice.state}, not ${parsed.state}.`,
            details: [
              `PIN ${enteredPin} is located in ${primaryPinOffice.division} division, ${primaryPinOffice.state}.`,
              `The entered address specifies state "${parsed.state}".`,
              'Postal circles are strictly delineated along state and territorial boundaries.'
            ],
            recommendation: `Verify whether the delivery state is ${primaryPinOffice.state} or re-check the entered PIN code.`,
            postalMatchReason: 'Postal Circle geographic conflict detected.'
          },
          source: 'DEMO_DATASET',
          processingTimeMs: Math.round(performance.now() - startTime),
          stagesCompleted: 6
        };
      }

      // If PIN is valid for district/city, but locality was not specifically identified in demo data
      return {
        id,
        timestamp: new Date().toISOString(),
        status: 'NEEDS_REVIEW',
        confidence: 'Medium',
        confidenceReason: 'Medium confidence means the PIN code exists in the correct district, but specific sub-locality records require human review.',
        input,
        parsedAddress: parsed,
        matchedPostOffice: primaryPinOffice,
        alternativePostOffices: pinOffices.slice(1),
        enteredPin,
        explanation: {
          summary: 'Locality details require review against local post office sub-sectors.',
          details: [
            `PIN ${enteredPin} is registered to ${primaryPinOffice.officeName} (${primaryPinOffice.district}, ${primaryPinOffice.state}).`,
            `The specific street/locality "${parsed.streetLocality}" is not explicitly listed in the sub-office database for this PIN.`,
            `Multiple post offices or delivery beats may service adjacent sub-wards.`
          ],
          recommendation: 'Check whether the street name is fully specified and matches the delivery beat of this post office.',
          postalMatchReason: 'PIN code verified at taluk/district level, but granular street beat requires manual review.'
        },
        source: 'DEMO_DATASET',
        processingTimeMs: Math.round(performance.now() - startTime),
        stagesCompleted: 6
      };
    }

    // 5. Unrecognized / Ambiguous PIN in Demo Data
    return {
      id,
      timestamp: new Date().toISOString(),
      status: 'NEEDS_REVIEW',
      confidence: 'Low',
      confidenceReason: 'Low confidence means the entered PIN or locality is not present in the local demo dataset.',
      input,
      parsedAddress: parsed,
      enteredPin,
      mismatchType: 'INCOMPLETE_DATA',
      explanation: {
        summary: 'Address components could not be conclusively verified against the demo postal dataset.',
        details: [
          `No registered post office in the demo dataset matches PIN ${enteredPin}.`,
          'Locality information could not be cross-referenced with a single distinct delivery office.',
          'Demo Data Mode contains a curated subset of major Indian postal circles.'
        ],
        recommendation: 'Try using one of the preset workshop demo addresses (e.g. MVP Colony 530017 or Indiranagar 560038) or connect an external postal API / n8n workflow.',
        postalMatchReason: 'Record not found in offline demo dataset.'
      },
      source: 'DEMO_DATASET',
      processingTimeMs: Math.round(performance.now() - startTime),
      stagesCompleted: 6
    };
  }
}

export const verificationEngine = new VerificationEngine();
