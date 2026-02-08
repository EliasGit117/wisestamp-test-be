import {
  GetGeneratedSignatureQueryHandler,
} from '@src/modules/signatures/cqrs/queries/get-generated.query';
import { ListSignatureQueryHandler } from '@src/modules/signatures/cqrs/queries/list-signatures.query';

export const signaturesQueryHandlers = [
  GetGeneratedSignatureQueryHandler,
  ListSignatureQueryHandler,
];
