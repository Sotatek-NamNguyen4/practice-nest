import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    public readonly code?: string,
    public readonly details?: any[],
  ) {
    super({
      message,
      error: CustomException.getErrorName(statusCode),
      code,
      details,
      timestamp: new Date().toISOString(),
    }, statusCode);
  }

  private static getErrorName(status: HttpStatus): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'Unprocessable Entity';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'Too Many Requests';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal Server Error';
      default:
        return 'Error';
    }
  }
}

export class TaskNotFoundException extends CustomException {
  constructor(taskId: number) {
    super(`Task with ID ${taskId} not found`, HttpStatus.NOT_FOUND, 'TASK_NOT_FOUND');
  }
}