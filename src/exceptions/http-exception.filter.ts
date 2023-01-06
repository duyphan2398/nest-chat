import {ExceptionFilter, Catch, ArgumentsHost, HttpException} from '@nestjs/common';
import {Request, Response} from 'express';
import { I18nContext } from "nestjs-i18n";


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const i18n = I18nContext.current(host);
        console.log(i18n.t('exception-messages.SERVER_ERROR'))


        response
            .status(status)
            .json({
                code: status,
                status: false,
                message: '',
            });
    }
}
