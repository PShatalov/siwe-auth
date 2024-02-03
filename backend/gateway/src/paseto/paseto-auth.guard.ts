import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PasetoService } from './paseto.service';

@Injectable()
export class PasetoAuthGuard implements CanActivate {
  constructor(private readonly pasetoService: PasetoService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) return false;

    return this.pasetoService
      .verifyToken(token)
      .then(() => true)
      .catch(() => false);
  }
}
