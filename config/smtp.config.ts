import { registerAs } from '@nestjs/config';

export default registerAs('smtp', () => ({
  port: process.env.SMTP_PORT,
  host: process.env.SMTP_HOST,
  secure: process.env.SMTP_SECURE === 'true' ?? false,
  requireTLS: process.env.SMTP_REQUIRE_TLS === 'true' ?? false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
}));