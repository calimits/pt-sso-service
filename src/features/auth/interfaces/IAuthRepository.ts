import CreateTokenDto from "../dtos/CreateTokenDto";
import { CreateUserDto } from "../dtos/CreateUserDto";
import TokenDto from "../dtos/TokenDto";
import UpdateTokenDto from "../dtos/UpdateTokenDto";
import { UserDto } from "../dtos/UserDto";
import UserInfoDto from "../dtos/UserInfoDto";

interface IAuthRepository {
    createUser(user: CreateUserDto): Promise<UserDto>,
    readUserByEmail(email: string): Promise<UserInfoDto | null>,
    createToken(token: CreateTokenDto): Promise<TokenDto>,
    createManyTokens(tokens: Array<CreateTokenDto>): Promise<Array<TokenDto>>,
    readToken(token: string): Promise<TokenDto>,
    readTokenById(uuid: string): Promise<TokenDto>,
    readAllTokensFrom1User(userId: number): Promise<Array<TokenDto>>
    updateToken(token: UpdateTokenDto): Promise<TokenDto>,
    deleteToken(uuid: string): Promise<TokenDto>,
    deleteAllToken41User(userId: number): Promise<void>
}

export {IAuthRepository};