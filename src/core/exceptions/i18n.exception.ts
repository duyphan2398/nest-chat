import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nValidationException } from 'nestjs-i18n';
import { I18nService } from 'nestjs-i18n';

@Catch(I18nValidationException)
export class I18nException implements ExceptionFilter {
  constructor(@Inject(I18nService) private i18n: I18nService) {}

  async catch(exception: I18nValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const responseException = exception.getResponse();
    const message = exception.message;

    const firstError = exception.errors.shift();
    const errorMessage = Object.values(firstError.constraints).shift();

    const returnData = {
      code: HttpStatus.UNPROCESSABLE_ENTITY,
      status: false,
      message: message || responseException,
      error: await this.i18n.t(errorMessage, {
        args: { property: firstError.property },
      }),
    };

    return response.status(HttpStatus.OK).json(returnData);
  }
}
