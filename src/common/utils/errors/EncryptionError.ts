import AppError from "./AppError";


class EncryptionError extends AppError {
    constructor(message: string) {
        super(message, "Encryption Error", 500);
    }
}

export {EncryptionError};