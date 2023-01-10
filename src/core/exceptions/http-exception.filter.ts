import {ExceptionFilter, Catch, ArgumentsHost, HttpException} from '@nestjs/common';
import {Request, Response} from 'express';
import {isObject, isString} from "@nestjs/common/utils/shared.utils";


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const responseException = exception.getResponse();
        const message = exception.message;

        response
            .status(200)
            .json({
                code: status,
                status: false,
                message: message || responseException
            });
    }
}
