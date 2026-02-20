/**
 * DomainError - Error base del dominio
 *
 * Todas las excepciones de negocio extienden de esta clase.
 * El HttpExceptionFilter la detecta y la traduce al HTTP code apropiado.
 */
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
