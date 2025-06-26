import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ExceptionInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, user } = request;

        this.logger.error(`Exception occurred: ${error.message}`, 
          {
            method,
            url,
            body,
            stack: error.stack,
            userId: user?.id,
            timestamp: new Date().toISOString(),
          }
        );


        
        return throwError(() => ({
          statusCode: 500,
          message: 'Internal server error',
          error: error.message,
          timestamp: new Date().toISOString(),
          path: url,
        }));
      })
    );
  }
}