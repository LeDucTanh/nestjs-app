import * as Joi from 'joi';

export const EnvValidation =
  Joi.object({
    NODE_ENV: Joi.string().valid('development', 'staging', 'production').default('development'),
    PORT: Joi.number().required().default(3000),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().integer().required(),
    DATABASE_DATABASE: Joi.string().required(),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().integer().required(),
    JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().required()
  })
