import CreateTokenDto from "../dtos/CreateTokenDto";


interface IRefreshTokensTransaction {
    execute(userId: number, tokens: Array<CreateTokenDto>): Promise<void>;
}

export {IRefreshTokensTransaction};