import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger('AuthGuard');

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization) {
      return false;
    }

    request.user = await this.validateToken(authorization);

    return true;
  }

  async validateToken(auth: string) {
    const [bearer, token] = auth.split(' ');
    if (bearer !== 'Bearer') {
      throw new HttpException('Invalid token format', HttpStatus.FORBIDDEN);
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      return decoded;
    } catch (err) {
      const message = `Token error: ${err.message || err.name}`;
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
