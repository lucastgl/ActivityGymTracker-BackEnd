/**
 * HttpExceptionFilter - Filtro global de excepciones
 *
 * Traduce errores del dominio y de NestJS a respuestas HTTP consistentes.
 *
 * Mapa de errores:
 *   NotFoundError      → 404
 *   ConflictError      → 409
 *   ValidationError    → 422
 *   DomainError (base) → 400
 *   HttpException      → código propio de NestJS
 *   Error inesperado   → 500
 *
 * Formato de respuesta:
 *   { statusCode, error, message, timestamp, path }
 */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  DomainError,
  NotFoundError,
  ConflictError,
  ValidationError,
} from '../errors';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, message } = this.resolve(exception);

    if (statusCode >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} → ${statusCode}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(statusCode).json({
      statusCode,
      error: HttpStatus[statusCode] ?? 'UNKNOWN',
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private resolve(exception: unknown): { statusCode: number; message: string } {
    if (exception instanceof NotFoundError) {
      return { statusCode: HttpStatus.NOT_FOUND, message: exception.message };
    }

    if (exception instanceof ConflictError) {
      return { statusCode: HttpStatus.CONFLICT, message: exception.message };
    }

    if (exception instanceof ValidationError) {
      return {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: exception.message,
      };
    }

    if (exception instanceof DomainError) {
      return { statusCode: HttpStatus.BAD_REQUEST, message: exception.message };
    }

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      const message =
        typeof res === 'string'
          ? res
          : (res as { message?: string | string[] }).message
              ?.toString()
              .trim() ?? exception.message;
      return { statusCode: exception.getStatus(), message };
    }

    if (exception instanceof Error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor',
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error inesperado',
    };
  }
}
