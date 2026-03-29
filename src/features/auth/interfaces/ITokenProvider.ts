


interface ITokenProvider {
    generateToken(payload: object, secret: string, expiresIn: number): Promise<string>,
    verifyToken(token: string, secret: string): Promise<object>
}

export type {ITokenProvider};