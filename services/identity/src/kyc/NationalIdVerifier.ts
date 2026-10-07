export interface NationalIdInput {
  number: string;
  fullName: string;
  dateOfBirth: string;
}

export interface VerificationResult {
  verified: boolean;
  reason?: string;
}

const KENYAN_ID_PATTERN = /^\d{7,9}$/;

export class NationalIdVerifier {
  async verify(input: NationalIdInput): Promise<VerificationResult> {
    if (!KENYAN_ID_PATTERN.test(input.number)) {
      return { verified: false, reason: 'invalid_national_id_format' };
    }

    const dob = new Date(input.dateOfBirth);
    if (Number.isNaN(dob.getTime())) {
      return { verified: false, reason: 'invalid_date_of_birth' };
    }

    const ageMs = Date.now() - dob.getTime();
    const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1000);
    if (ageYears < 16) {
      return { verified: false, reason: 'under_minimum_age' };
    }

    if (input.fullName.trim().length < 3) {
      return { verified: false, reason: 'invalid_full_name' };
    }

    return { verified: true };
  }
}
