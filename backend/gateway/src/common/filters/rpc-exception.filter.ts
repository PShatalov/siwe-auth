import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const error = exception.getError();

    if (error['code']?.includes('SQLITE_CONSTRAINT')) {
      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: 'User already exists',
      });
    } else if (
      error['message']?.includes('Could not find any entity of type "User"')
    ) {
      response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    } else if (error['name'] === 'UnauthorizedException') {
      response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    } else {
      response.status(500).json({
        statusCode: 500,
        message: `Internal server error: ${exception.message}`,
      });
    }
  }
}
