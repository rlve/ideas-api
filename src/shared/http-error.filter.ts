import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status =
      typeof exception.getStatus === 'function'
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      code: status,
      timestamp: new Date().toLocaleString(),
      path: request.url,
      method: request.method,
      message: exception.message.error || exception.message || null,
    };

    Logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
      'ExceptionFilter',
    );

    response.status(status).json(errorResponse);
  }
}
