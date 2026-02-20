import { DomainError } from './domain-error';

/**
 * NotFoundError - El recurso solicitado no existe.
 * Se traduce a HTTP 404.
 */
export class NotFoundError extends DomainError {
  constructor(resource: string, id?: string) {
    const msg = id
      ? `${resource} con id "${id}" no encontrado`
      : `${resource} no encontrado`;
    super(msg, 'NOT_FOUND');
  }
}
