import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const now = Date.now();

    if (req && req.method && req.url) {
      const { method, url } = req;

      return call$.pipe(
        tap(() =>
          Logger.log(
            `${method} ${url} ${Date.now() - now}ms`,
            context.getClass().name,
          ),
        ),
      );
    } else {
      const ctx: any = GqlExecutionContext.create(context);
      const resolverName = ctx.constructorRef.name;
      const { parentType, fieldName } = ctx.getInfo();

      return call$.pipe(
        tap(() =>
          Logger.log(
            `${parentType}: ${fieldName} ${Date.now() - now}ms`,
            resolverName,
          ),
        ),
      );
    }
  }
}
