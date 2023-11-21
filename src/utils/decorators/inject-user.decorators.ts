import { applyDecorators, UseInterceptors, UsePipes } from '@nestjs/common';
import { InjectUserInterceptor } from 'src/common/interceptor/inject-user.interceptor';
import { StripRequestContextPipe } from '../pipes/strip-req-context.pipe';

export function InjectUserToBody() {
  return applyDecorators(InjectUserTo('body'));
}

export function InjectUserTo(context: 'query' | 'body' | 'params') {
  return applyDecorators(
    UseInterceptors(new InjectUserInterceptor(context)),
    UsePipes(StripRequestContextPipe),
  );
}
