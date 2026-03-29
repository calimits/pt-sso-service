

class AppError extends Error {
    public name: string;
    public code: number;
    
    public constructor(message: string = "An error ocurred", name: string = "default error" , code: number = 500) {
        super(message);
        this.name = name;
        this.code = code;
    }
}

export default AppError;