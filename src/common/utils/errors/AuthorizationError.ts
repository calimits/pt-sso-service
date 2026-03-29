import AppError from "./AppError";


class AuthorizationError extends AppError {
    constructor(message: string) {
        super(message, "Authorization Error", 401);
    }
}

export {AuthorizationError};