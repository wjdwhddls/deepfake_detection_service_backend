import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(UnauthorizedExceptionFilter.name);

    catch(exception: UnauthorizedException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        this.logger.warn('Unauthorized access attempt detected');

        response.status(status).json({
            statusCode: status,
            message: exception.message,
        });
    }
}