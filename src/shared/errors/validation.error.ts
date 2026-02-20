import { DomainError } from './domain-error';

/**
 * ValidationError - Datos inválidos a nivel de dominio.
 * Se traduce a HTTP 422.
 */
export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
  }
}
