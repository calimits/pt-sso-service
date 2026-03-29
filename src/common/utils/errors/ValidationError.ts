import AppError from "./AppError";


class ValidationError extends AppError {
    constructor(message: string) {
        super(message, "Validation Error", 500);
    }
}

export {ValidationError};