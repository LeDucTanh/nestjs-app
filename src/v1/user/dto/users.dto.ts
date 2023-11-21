import { PartialType } from '@nestjs/mapped-types';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Matches,
  MaxLength,
  Validate,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { requestContext } from 'src/common/interceptor/inject-user.interceptor';
import { IsHairStyleExist } from 'src/v1/hair-style/validator/validator';
import { IsMakeupStyleExist } from 'src/v1/makeup-style/validator/validator';
import { IsMakeupTypeExist } from 'src/v1/makeup-type/validator/validator';
import { IsPersonalColorExist } from 'src/v1/personal-color/validator/validator';

export class RegisterUserDto {
  @Matches(/^[a-zA-Z가-힣]{2,19}$/, {
    message: i18nValidationMessage('validations.INVALID_USERNAME'),
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsDate()
  @IsNotEmpty()
  birthDate: Date;

  @MaxLength(11)
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @Matches(/^(?=.*[a-zA-Z0-9])[a-zA-Z0-9\s]{3,11}$/, {
    message: i18nValidationMessage('validations.INVALID_ID_LOGIN'),
  })
  idLogin: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail(
    {},
    { message: i18nValidationMessage('validations.WRONG_FORMAT_EMAIL') },
  )
  email: string;

  @Matches(/^(?=.*[a-zA-Z0-9])[a-zA-Z0-9\s]{6,19}$/, {
    message: i18nValidationMessage('validations.INVALID_PASSWORD'),
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Matches(/^(?=.*[a-zA-Z0-9])[a-zA-Z0-9\s]{6,19}$/, {
    message: i18nValidationMessage('validations.INVALID_PASSWORD'),
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}

export class LoginUserDto {
  @Matches(/^(?=.*[a-zA-Z0-9])[a-zA-Z0-9\s]{3,11}$/, {
    message: i18nValidationMessage('validations.INVALID_ID_LOGIN'),
  })
  @IsString()
  @IsNotEmpty()
  idLogin: string;

  @Matches(/^(?=.*[a-zA-Z0-9])[a-zA-Z0-9\s]{6,19}$/, {
    message: i18nValidationMessage('validations.INVALID_PASSWORD'),
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto extends PartialType(RegisterUserDto) {
  @Validate(IsMakeupStyleExist)
  @IsNumber()
  @IsNotEmpty()
  makeupStyleId: number;

  @Validate(IsHairStyleExist)
  @IsNumber()
  @IsNotEmpty()
  hairStyleId: number;

  @Validate(IsMakeupTypeExist)
  @IsNumber()
  @IsNotEmpty()
  makeupTypeId: number;

  @Validate(IsPersonalColorExist)
  @IsNumber()
  @IsNotEmpty()
  personalColorId: number;

  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  long: number;
}
