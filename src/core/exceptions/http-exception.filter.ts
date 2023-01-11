import {ExceptionFilter, Catch, ArgumentsHost, HttpException} from '@nestjs/common';
import {Response} from 'express';
import {HttpStatus} from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const responseException = exception.getResponse();
        const message = exception.message;

        response
            .status(HttpStatus.OK)
            .json({
                code: status,
                status: false,
                message: message || responseException
            });
    }
}
