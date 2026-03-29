import { Module } from '@nestjs/common';
import PostgreAuthRepository from './repository/auth.repository';
import JWTProvider from './providers/token.provider';
import BCrypt from './providers/bcrypt.encryptor';
import RefreshTokensTransaction from './providers/refreshTokens.transaction';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../../config/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    {
      provide: "AUTH_REPOSITORY",
      useClass: PostgreAuthRepository
    }, 
    {
      provide: "TOKEN_PROVIDER",
      useClass: JWTProvider
    }, 

    {
      provide: "ENCRYPTOR",
      useClass: BCrypt
    }, 

    {
      provide: "REFRESH_TOKENS_TRANSACTION",
      useClass: RefreshTokensTransaction
    }, 
    AuthService]
})

export class AuthModule {}