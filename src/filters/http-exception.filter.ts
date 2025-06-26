import { Catch, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { HttpException } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof exceptionResponse === 'string' ? 
        exceptionResponse : (exceptionResponse as any).message || exception.message,
      ...(typeof exceptionResponse === 'object' && (exceptionResponse as any).details && {
        details: (exceptionResponse as any).details
      }),
    };

    response.status(statusCode).json(errorResponse);
  }
}