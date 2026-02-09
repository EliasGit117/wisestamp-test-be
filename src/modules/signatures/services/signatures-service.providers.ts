import { SignatureDtoFactory } from '@src/modules/signatures/services/signature.dto-factory';
import { SignatureGeneratorService } from '@src/modules/signatures/services/signature-generator.service';
import {
  GeneratedSignatureResultDtoCacheService
} from '@src/modules/signatures/services/generated-signature-result-dto-cache.service';
import { SignatureGenerationJobService } from '@src/modules/signatures/services/signature-generation-job.service';


export const signaturesServiceProviders = [
  // Factories
  SignatureDtoFactory,

  // Services
  SignatureGeneratorService,
  GeneratedSignatureResultDtoCacheService,
  SignatureGenerationJobService
];
