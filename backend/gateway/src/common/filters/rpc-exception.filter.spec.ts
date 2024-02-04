import { RpcExceptionFilter } from './rpc-exception.filter';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

describe('RpcExceptionFilter', () => {
  let filter: RpcExceptionFilter;
  let host: ArgumentsHost;
  let responseMock: {
    status: jest.Mock;
    json: jest.Mock;
  };

  beforeEach(() => {
    filter = new RpcExceptionFilter();
    responseMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    host = {
      switchToHttp: () => ({
        getResponse: () => responseMock,
      }),
    } as any;
  });

  it('should handle SQLITE_CONSTRAINT error', () => {
    const error = new RpcException({ code: 'SQLITE_CONSTRAINT' });

    filter.catch(error, host);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message: 'User already exists',
    });
  });

  it('should handle "Could not find any entity of type "User" error', () => {
    const error = new RpcException({
      message: 'Could not find any entity of type "User"',
    });

    filter.catch(error, host);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'User not found',
    });
  });

  it('should handle UnauthorizedException', () => {
    const error = new RpcException({ name: 'UnauthorizedException' });

    filter.catch(error, host);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Unauthorized',
    });
  });

  it('should handle other errors with status 500', () => {
    const error = new RpcException('Some other error');

    filter.catch(error, host);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `Internal server error: Some other error`,
    });
  });
});
