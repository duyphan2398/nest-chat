import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    BadRequestException,
} from '@nestjs/common';
import {Response} from 'express';
import {HttpStatus} from '@nestjs/common';
import {I18nValidationException} from "nestjs-i18n";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const responseException = exception.getResponse();
        const message = exception.message;

        const returnData = {
            code: status,
            status: false,
            message: message || responseException,
        };

        this.addErrorForeachException(returnData, exception);

        response.status(HttpStatus.OK).json(returnData);
    }

    addErrorForeachException(returnData, exception) {
        switch (exception.constructor) {
            case BadRequestException:
                returnData.errors = exception.getResponse().message;
                return;
            default:
                return;
        }
    }
}
