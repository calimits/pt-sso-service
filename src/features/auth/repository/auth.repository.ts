import { DataSource, Repository } from "typeorm";
import CreateTokenDto from "../dtos/CreateTokenDto";
import TokenDto from "../dtos/TokenDto";
import UpdateTokenDto from "../dtos/UpdateTokenDto";
import { DBError } from "../../../common/utils/errors/DBError";
import { IAuthRepository } from "../interfaces/IAuthRepository";
import Token from "../entities/Token";
import { UserDto } from "../dtos/UserDto";
import { CreateUserDto } from "../dtos/CreateUserDto";
import User from "../entities/User";
import UserInfoDto from "../dtos/UserInfoDto";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
class PostgreAuthRepository implements IAuthRepository {
    public constructor(@Inject("DATA_SOURCE") dataSource: DataSource) {
        this.tokenRepository = dataSource.getRepository(Token);
        this.userRepository = dataSource.getRepository(User);
    }

    public async createUser(user: CreateUserDto): Promise<UserDto> {
        try {
            const newUser = new User();
            newUser.email = user.email;
            newUser.password = user.password

            const savedUser = await this.userRepository.save(newUser);
            return savedUser;
        } catch (error) {
            let err = error as Error;
            throw new DBError(err.message);
        }
    }

    public async readUserByEmail(email: string): Promise<UserInfoDto | null> {
        try {
            const user = await this.userRepository.findOneBy({email: email}) as UserInfoDto;
            return user;
        } catch (error) {
            let err = error as Error;
            throw new DBError(err.message);
        }
    }

    public async createToken(token: CreateTokenDto): Promise<TokenDto> {
        try {
            const newToken = new Token();
            newToken.token = token.token;
            newToken.type = token.type;
            newToken.uuid = token.uuid;
            newToken.userId = token.userId;
            const savedToken: TokenDto = await this.tokenRepository.save(newToken);
            return savedToken;
        } catch (error) {
            let err = error as Error;
            throw new DBError(err.message);
        }
    }

    public async createManyTokens(tokens: Array<CreateTokenDto>): Promise<Array<TokenDto>> {
        try {
            const newTokens: Array<CreateTokenDto> = []; 

            tokens.forEach(token => {
                const newToken = new Token();
                newToken.token = token.token;
                newToken.type = token.type;
                newToken.uuid = token.uuid;
                newToken.userId = token.userId;

                newTokens.push(newToken);
            });

            const savedTokens: Array<TokenDto> = await this.tokenRepository.save(newTokens);
            return savedTokens;
        } catch (error) {
            let err = error as Error;
            throw new DBError(err.message);
        }
    }

    public async readAllTokensFrom1User(userId: number): Promise<Array<TokenDto>> {
        try {
            const tokens: TokenDto[] = await this.tokenRepository.find({where: {userId: userId}});
            if (tokens === null) throw new DBError("Token does not exist.")
            return tokens;
        } catch (error) {
            let err = error as Error;
            throw new DBError(err.message);
        }
    }

    public async readTokenById(uuid: string): Promise<TokenDto> {
        try {
            const token = await this.tokenRepository.findOneBy({uuid: uuid});
            if (token === null) throw new DBError("Token does not exist.")
            return token;
        } catch (error) {
            let err = error as Error;
            throw new DBError(err.message);
        }
    }

    public async readToken(token: string): Promise<TokenDto> {
        try {
            const readToken = await this.tokenRepository.findOneBy({token: token});
            if (readToken === null) throw new DBError("Token does not exist.")
            return readToken;
        } catch (error) {
            let err = error as Error;
            throw new DBError(err.message);
        }
    }

    public async updateToken(token: UpdateTokenDto): Promise<TokenDto> {
        try {
            const token2Update = await this.tokenRepository.findOneBy({uuid: token.uuid});
            if (token2Update === null) throw new DBError("Token does not exist.")
            token2Update.token = token.token;
            const updatedToken = await this.tokenRepository.save(token2Update);
            return updatedToken;
        } catch (error) {
            let err = error as Error;
            throw new DBError(err.message);
        }
    }

    public async deleteToken(uuid: string): Promise<TokenDto> {
        try {
            const token2Delete = await this.tokenRepository.findOneBy({uuid: uuid});
            if (token2Delete === null) throw new DBError("Token does not exist.")
            await this.tokenRepository.remove(token2Delete);
            return token2Delete;
        } catch (error) {
            let err = error as Error;
            throw new DBError(err.message);
        }
    }

    public async deleteAllToken41User(userId: number): Promise<void> {
        try {
            await this.tokenRepository.createQueryBuilder()
                .delete()
                .from(Token)
                .where("userId = :userId", { userId: userId })
                .execute();
        } catch (error) {
            let err = error as Error;
            throw new DBError(err.message);
        }
    }

    private tokenRepository: Repository<Token>;
    private userRepository: Repository<User>
}

export default PostgreAuthRepository;