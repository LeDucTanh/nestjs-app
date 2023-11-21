import {
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch(HttpException)
export class ExceptionsLoggerFilter implements ExceptionFilter {
  constructor(private readonly i18n?: I18nService) {}
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

    const lang = 'en';

    const responseBody: any = exception.getResponse();
    let messages: any;
    let codeMsg: any[] = [];
    const errors: any[] = exception['errors'];
    const messageError: any[] = [];

    if (errors?.length > 0) {
      for (let t = 0; t < errors.length; t++) {
        const arrayMessagesDTO: any[] = [];
        const field = errors[t].property;
        const messagesDTO = errors[t].constraints;

        for (const mess in messagesDTO) {
          const value = messagesDTO[mess];
          let handleMsg = value.split('|')[0];
          const [fileTranslate, msgTranslate] = handleMsg.split('.');
          if (msgTranslate) codeMsg.push(msgTranslate);
          handleMsg = await this.i18n.translate(
            `${fileTranslate}.${msgTranslate ? msgTranslate : ''}`,
            {
              lang,
            },
          );
          arrayMessagesDTO.push(handleMsg);
        }

        const data = { field: field, msg: arrayMessagesDTO };
        messageError.push(data);
      }
      messages = messageError;
    } else {
      messages = responseBody?.message ? responseBody.message : responseBody;
      if (!Array.isArray(messages)) {
        if (messages?.toUpperCase() == messages) {
          codeMsg = messages;
          messages = await this.i18n.translate(`languages.${messages}`, {
            lang,
          });
        }
      }
    }

    const body = {
      message: Array.isArray(messages) ? messages : [messages],
      statusName: responseBody?.statusName || responseBody?.error || 'Error',
      statusCodeMsg: codeMsg,
      module: responseBody?.module || req?.route?.path,
      method: req.method || 'Unknown',
    };

    Logger.error(`[STATUS] ${status}`);
    Logger.error(`[AUTH] ${req.headers.authorization ?? 'NO AUTH'}`);
    Logger.error(
      `[BODY] [${
        typeof req?.body == 'object' ? JSON.stringify(req?.body) : ''
      }]`,
    );
    Logger.error(`[RESPONSE] ${JSON.stringify(body)}`);

    response.status(status).json(body);
  }
}
