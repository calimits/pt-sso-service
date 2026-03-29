import AppError from "./AppError";

class EmailError extends AppError {
    constructor(message: string) {
        super(message, "Email Error", 500);
    }
}

export {EmailError};