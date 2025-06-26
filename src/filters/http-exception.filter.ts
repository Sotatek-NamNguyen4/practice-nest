import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = exception.getStatus();

    const errorResponse = this.buildErrorResponse(exception, request, statusCode);

    response.status(statusCode).json(errorResponse);
  }

  private buildErrorResponse(exception: any, request: any, statusCode: any) {
    const exceptionResponse = exception.getResponse();
    if (exception instanceof HttpException) {

      return {
        statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message: typeof exceptionResponse === 'string' ? 
          exceptionResponse : (exceptionResponse as any).message || exception.message,
        ...(typeof exceptionResponse === 'object' && (exceptionResponse as any).details && {
          details: (exceptionResponse as any).details
        }),
      }
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: 'Internal server error',
      ...(typeof exceptionResponse === 'object' && (exceptionResponse as any).details && {
        details: (exceptionResponse as any).details
      }),
    }
  }
}