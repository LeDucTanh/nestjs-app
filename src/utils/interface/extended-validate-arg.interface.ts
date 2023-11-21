import { ValidationArguments } from 'class-validator';
import { requestContext } from 'src/common/interceptor/inject-user.interceptor';

export interface ExtendedValidationArguments extends ValidationArguments {
  object: {
    [requestContext]: {
      user: any;
    };
  };
}
