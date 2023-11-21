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

export class RegisterUserDto {
  @Matches(/^[a-zA-Z]{2,19}$/, {
    message: i18nValidationMessage('validations.INVALID_USERNAME'),
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @MaxLength(11)
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

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
}

export class UpdateUserDto extends PartialType(RegisterUserDto) {
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  long: number;
}
