import { I18nService } from 'nestjs-i18n';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly i18n?: I18nService) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(async (value) => {
        return {
          data: value,
          message: 'success',
        };
      }),
    );
  }
}
