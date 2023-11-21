import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Connection } from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class ColumnUniqueValidator implements ValidatorConstraintInterface {
  constructor(
    //@Inject('DbConnectionToken') private readonly connection: Connection
    private readonly _connection: Connection
  ) { }

  async validate(value: any, args: ValidationArguments) {
    const { constraints } = args;
    if (constraints.length === 0) {
      throw new BadRequestException(`Failed validating ${value} exists.`);
    }
    const cond = {};
    cond[constraints[1]] = value;

    return (await this._connection.getRepository(constraints[0]).findOne({ where: cond })) ? false : true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property}: '${args.value}' already exists. Please choose another`;
  }
}

export function IsColumUnique(
  entity: any[],
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: entity,
      validator: ColumnUniqueValidator,
    });
  };
}
