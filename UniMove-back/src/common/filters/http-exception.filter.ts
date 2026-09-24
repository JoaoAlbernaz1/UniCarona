import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload = exception instanceof HttpException ? exception.getResponse() : undefined;
    const body = typeof payload === 'object' && payload ? (payload as Record<string, unknown>) : {};
    const message =
      status === 500
        ? 'Erro interno do servidor.'
        : (body.message ?? payload ?? 'Erro na requisição.');
    response.status(status).json({
      statusCode: status,
      code: body.code ?? `HTTP_${status}`,
      message,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    });
  }
}
