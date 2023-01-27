import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class GatewayResponder {
  constructor(@Inject(I18nService) private i18n: I18nService) {}

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
