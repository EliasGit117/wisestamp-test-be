import { SignatureDtoFactory } from '@src/modules/signatures/services/signature.dto-factory';
import { SignatureGeneratorService } from '@src/modules/signatures/services/signature-generator.service';

export const signaturesServiceProviders = [
  // Factories
  SignatureDtoFactory,

  // Services
  SignatureGeneratorService
];
