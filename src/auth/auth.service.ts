import { ValidationError } from "src/common/utils/errors/ValidationError";
import { CreateUserDto } from "./dtos/CreateUserDto";
import LoggedInDto from "./dtos/LoggedInDto";
import LoginDto from "./dtos/LoginDto";
import { UserDto } from "./dtos/UserDto";
import UserInfoDto from "./dtos/UserInfoDto";
import IAuthRepository from "./interfaces/IAuthRepository";
import IEncryptor from "./interfaces/IEncryptor";
import IRefreshTokensTransaction from "./interfaces/IRefreshTokensTransaction";
import ITokenProvider from "./interfaces/ITokenProvider";
import { randomUUID } from "crypto";
import TokenDto from "./dtos/TokenDto";
import RefreshedTokensDto from "./dtos/RefreshedTokensDto";
import TokenPayloadDto from "./dtos/TokenPayloadDto";


class AuthService {
    public constructor({
        repository,
        tokenProvider,
        encryptor,
        refreshTokensTransaction
    }: {
        repository: IAuthRepository,
        tokenProvider: ITokenProvider,
        encryptor: IEncryptor
        refreshTokensTransaction: IRefreshTokensTransaction
    }) {
        this.repository = repository;
        this.tokenProvider = tokenProvider;
        this.encryptor = encryptor
        this.refreshTokensTransaction = refreshTokensTransaction;
    }

    public async register(user: CreateUserDto): Promise<UserDto> {
        try {
            const hash: string = await this.encryptor.encrypt(user.password);
            const userCreated: UserDto = await this.repository.createUser({ email: user.email, password: hash });
            return userCreated;
        } catch (error) {
            throw error;
        }
    }

    public async login(user: LoginDto): Promise<LoggedInDto> {
        try {
            //Verifying credentials
            const isVerified = await this.verifyCredentials(user.email, user.password);
            if (!isVerified) throw new ValidationError("Password don't match");

            //getting info for payload
            const userInfo = await this.repository.readUserByEmail(user.email) as UserInfoDto;
            const refreshUUID: string = randomUUID();
            const accessUUID: string = randomUUID();

            //building tokens
            let refreshToken: string = await this.tokenProvider.generateToken({
                userId: userInfo.id,
                email: userInfo.email,
                uuid: refreshUUID
            }, String(process.env.SECRET_REFRESH_KEY), 302400);

            let accessToken: string = await this.tokenProvider.generateToken({
                userId: userInfo.id,
                email: userInfo.email,
                uuid: accessUUID
            }, String(process.env.SECRET_ACCESS_KEY), 3600);

            //saving tokens in db
            await this.repository.createManyTokens([
                {
                    uuid: refreshUUID,
                    userId: userInfo.id,
                    token: refreshToken,
                    type: "refresh"
                },
                {
                    uuid: accessUUID,
                    userId: userInfo.id,
                    token: accessToken,
                    type: "access"
                }
            ]);

            return { refreshToken, accessToken, userInfo };
        } catch (error) {
            throw error;
        }
    };

    public async logout(id: number): Promise<void> {
        try {
            await this.repository.deleteAllToken41User(id);
        } catch (error) {
            throw error;
        }
    };

    public async refreshTokens(refreshToken: string): Promise<RefreshedTokensDto> {
        try {
            await this.repository.readToken(refreshToken); //throws an error if it does not exist
            const decoded = await this.tokenProvider.verifyToken(refreshToken, String(process.env.SECRET_REFRESH_KEY)) as TokenPayloadDto;

            //building new tokens
            const refreshUUID: string = randomUUID();
            const accessUUID: string = randomUUID();

            let newRefreshToken: string = await this.tokenProvider.generateToken({
                userId: decoded.userId,
                email: decoded.email,
                uuid: refreshUUID
            }, String(process.env.SECRET_REFRESH_KEY), 30240);

            let newAccessToken: string = await this.tokenProvider.generateToken({
                userId: decoded.userId,
                email: decoded.email,
                uuid: accessUUID
            }, String(process.env.SECRET_ACCESS_KEY), 3600);

            //executing transaction
            await this.refreshTokensTransaction.execute(decoded.userId, [
                {
                    uuid: refreshUUID,
                    userId: decoded.userId,
                    token: newRefreshToken,
                    type: "refresh"
                },
                {
                    uuid: accessUUID,
                    userId: decoded.userId,
                    token: newAccessToken,
                    type: "access"
                }
            ]);

            return { refreshToken: newRefreshToken, accessToken: newAccessToken };
        } catch (error) {
            throw error;
        }
    };

    public async validateToken(token: string): Promise<TokenPayloadDto> {
        try {
            const decoded = await this.tokenProvider.verifyToken(token, String(process.env.SECRET_REFRESH_KEY)) as TokenPayloadDto;
            return decoded;
        } catch (error) {
            throw error;
        }
    }

    private async verifyCredentials(email: string, password: string): Promise<boolean> {
        try {
            const user = await this.repository.readUserByEmail(email) as UserInfoDto;
            if (!user) throw new Error("User is not registered")

            const hash: string = user.password;
            const isEqual: boolean = await this.encryptor.compare(hash, password);
            return isEqual;
        } catch (error) {
            throw error;
        }
    }

    private encryptor: IEncryptor;
    private tokenProvider: ITokenProvider;
    private repository: IAuthRepository;
    private refreshTokensTransaction: IRefreshTokensTransaction
}

export default AuthService;