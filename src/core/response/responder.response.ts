import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class Responder {
  constructor(@Inject(I18nService) private i18n: I18nService) {}

  /**
   * Response: ok 200
   *
   * @param data
   * @param message
   * @param code
   */
  httpOK(
    data: object | object[] | null,
    message = this.i18n.t('http-messages.OK'),
    code: number = HttpStatus.OK,
  ) {
    return {
      code,
      status: true,
      message,
      data,
    };
  }

  /**
   * Response: created 201
   *
   * @param data
   * @param message
   * @param code
   */
  httpCreated(
    data: object | object[] | null,
    message: string = this.i18n.t('http-messages.CREATED'),
    code: number = HttpStatus.CREATED,
  ) {
    return {
      code,
      status: true,
      message,
      data,
    };
  }

  /**
   * Response: no content 204
   *
   * @param message
   * @param code
   */
  httpNoContent(
    message: string = this.i18n.t('http-messages.NO_CONTENT'),
    code: number = HttpStatus.NO_CONTENT,
  ) {
    return {
      code: 204,
      status: true,
      message,
    };
  }

  /**
   * Response: not found 404
   *
   * @param message
   * @param code
   */
  httpNotFound(
    message: string = this.i18n.t('http-messages.NOT_FOUND'),
    code: number = HttpStatus.NOT_FOUND,
  ) {
    return {
      code: 404,
      status: false,
      message,
    };
  }

  /**
   * Response: bad request 400
   *
   * @param message
   * @param code
   */
  httpBadRequest(
    message: string = this.i18n.t('http-messages.BAD_REQUEST'),
    code: number = HttpStatus.BAD_REQUEST,
  ) {
    return {
      code,
      status: false,
      message,
    };
  }
}
