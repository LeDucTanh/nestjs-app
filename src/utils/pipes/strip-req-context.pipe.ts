import { omit } from 'lodash';

import { Injectable, PipeTransform } from '@nestjs/common';
import { requestContext } from 'src/common/interceptor/inject-user.interceptor';

@Injectable()
export class StripRequestContextPipe implements PipeTransform {
  transform(value: any) {
    return omit(value, requestContext);
  }
}
