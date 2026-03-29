import AppError from "./AppError";

class DBError extends AppError {
    constructor(message: string) {
        super(message, "DB Error", 500);
    }
}

export {DBError};