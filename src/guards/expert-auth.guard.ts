import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ExpertsService } from '../modules/chats/services/experts.service';
import { I18nContext } from 'nestjs-i18n';
import * as moment from 'moment';
import { TOKEN_EXPIRED_TIME } from '../modules/chats/enums/experts.enum';
import { RequestInterface } from '../core/request/request.interface';

export class ExpertAuthGuard implements CanActivate {
  constructor(
    @Inject(ExpertsService) private readonly exportsService: ExpertsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestInterface>();
    const token = request.headers.authorization || '';
    const i18n = I18nContext.current();

    // Check empty token
    if (!token) {
      throw new UnauthorizedException(
        i18n.t('auth-error-messages.TOKEN_EMPTY'),
      );
    }

    const authExpert = await this.exportsService.findByToken(token);

    // Check empty expert
    if (!authExpert) {
      throw new UnauthorizedException(
        i18n.t('auth-error-messages.TOKEN_WRONG'),
      );
    }

    // Check token expired
    const expiredTime = moment(authExpert.created_token).add(
      TOKEN_EXPIRED_TIME.SECONDS,
      'seconds',
    );
    const diffTime = moment().diff(expiredTime, 'seconds');
    if (!authExpert.created_token || diffTime > 0) {
      throw new UnauthorizedException(
        i18n.t('auth-error-messages.TOKEN_EXPIRED'),
      );
    }

    // Assign global auth expert
    request.authExpert = authExpert;

    return true;
  }
}
