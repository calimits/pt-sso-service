import AppError from "./AppError";

class CacheError extends AppError {
    constructor(message: string) {
        super(message, "Cache Error", 500);
    }
}

export {CacheError};