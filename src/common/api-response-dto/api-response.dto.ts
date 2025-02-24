export class ApiResponseDto<T> {
    success: boolean;
    statusCode?: number;
    message?: string;
    data?: T;
    error?: string;

    constructor(success: boolean, statusCode?: number, message?: string, data?: T, error?: string) {
        this.success = success;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.error = error;
    }
}