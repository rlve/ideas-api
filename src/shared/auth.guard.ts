import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger('AuthGuard');

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    let result: boolean;
    if (request) {
      result = await this.doValidation(request);
    } else {
      const ctx: any = GqlExecutionContext.create(context);
      result = await this.doValidation(ctx);
    }

    return result;
  }

  async doValidation(requestOrGqlContext: any) {
    const { authorization } = requestOrGqlContext.headers;

    if (!authorization) {
      return false;
    }

    requestOrGqlContext.user = await this.validateToken(authorization);

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
