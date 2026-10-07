import { createHash } from 'node:crypto';

export interface UploadedDocument {
  accountId: number;
  documentType: 'national_id' | 'passport' | 'drivers_license';
  mimeType: string;
  bytes: Buffer;
}

export interface StoredDocument {
  accountId: number;
  documentType: string;
  sha256: string;
  sizeBytes: number;
}

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'application/pdf']);
const MAX_SIZE = 5 * 1024 * 1024;

export class DocumentUpload {
  validate(input: UploadedDocument): void {
    if (!ALLOWED_MIME.has(input.mimeType)) {
      throw new Error('unsupported_document_mime');
    }
    if (input.bytes.length > MAX_SIZE) {
      throw new Error('document_too_large');
    }
    if (input.bytes.length === 0) {
      throw new Error('empty_document');
    }
  }

  fingerprint(input: UploadedDocument): StoredDocument {
    this.validate(input);
    return {
      accountId: input.accountId,
      documentType: input.documentType,
      sha256: createHash('sha256').update(input.bytes).digest('hex'),
      sizeBytes: input.bytes.length,
    };
  }
}
