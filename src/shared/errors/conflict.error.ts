import { DomainError } from './domain-error';

/**
 * ConflictError - El recurso ya existe o viola una restricción de unicidad.
 * Se traduce a HTTP 409.
 */
export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, 'CONFLICT');
  }
}
