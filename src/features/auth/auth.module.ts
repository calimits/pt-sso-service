import { Module } from '@nestjs/common';
import PostgreAuthRepository from './auth.repository';
import JWTProvider from './token.provider';
import BCrypt from './bcrypt.encryptor';
import RefreshTokensTransaction from './refreshTokens.transaction';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import AppDataSource from 'src/config/data-source';
import { IAuthRepository } from './interfaces/IAuthRepository';

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [
    {
      provide: "DATA_SOURCE",
      useValue: AppDataSource
    },
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