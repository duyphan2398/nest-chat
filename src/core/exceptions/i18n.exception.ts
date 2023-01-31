import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nValidationException } from 'nestjs-i18n';
import { I18nService } from 'nestjs-i18n';

@Catch(I18nValidationException)
export class I18nException implements ExceptionFilter {
  constructor(@Inject(I18nService) private i18n: I18nService) {}

  async catch(exception: I18nValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const responseException = exception.getResponse();
    const message = exception.message;

    let firstError = exception.errors.shift();
    let errorMessage = Object.values(firstError.constraints).shift();

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
