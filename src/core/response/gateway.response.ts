import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class GatewayResponder {
  constructor(@Inject(I18nService) private i18n: I18nService) {}

  /**
   * Response: ok 200
   *
   * @param data
   * @param message
   * @param code
   */
  ok(
      data: object | object[] | null,
      message = this.i18n.t('gateway-messages.OK'),
      code: number = HttpStatus.OK,
  ) {
    return {
      code,
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
  created(
      data: object | object[] | null,
      message: string = this.i18n.t('gateway-messages.CREATED'),
      code: number = HttpStatus.CREATED,
  ) {
    return {
      code,
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
  noContent(
      message: string = this.i18n.t('gateway-messages.NO_CONTENT'),
      code: number = HttpStatus.NO_CONTENT,
  ) {
    return {
      code: 204,
      message,
    };
  }

  /**
   * Response: not found 404
   *
   * @param message
   * @param code
   */
  notFound(
      message: string = this.i18n.t('gateway-messages.NOT_FOUND'),
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
  badRequest(
      message: string = this.i18n.t('http-messages.BAD_REQUEST'),
      code: number = HttpStatus.BAD_REQUEST,
  ) {
    return {
      code,
      message,
    };
  }

  /**
   * Response: ok 401
   *
   * @param message
   * @param code
   */
  unauthenticated(
      message = this.i18n.t('gateway-messages.UNAUTHENTICATED'),
      code: number = HttpStatus.UNAUTHORIZED,
  ) {
    return {
      code,
      message,
    };
  }
}
