import { Body, Controller, Get, InternalServerErrorException, Param, ParseIntPipe, Post, Req, Res, UnauthorizedException, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { CreateUserDto } from './dtos/CreateUserDto';
import { UserDto } from './dtos/UserDto';
import UserDtoValidationPipe from './pipes/validateUserPipe';
import type LoginDto from './dtos/LoginDto';
import LoggedInDto from './dtos/LoggedInDto';
import LoggedResDto from './dtos/LoggedResDto';
import express from 'express';
import RefreshedTokensDto from './dtos/RefreshedTokensDto';
import TokenPayloadDto from './dtos/TokenPayloadDto';
import type ValidateTokenDto from './dtos/ValidateTokenDto';

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get("logout/:id")
  async logout(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.authService.logout(id);
    } catch (error) {
      let err = error as Error;
      throw new InternalServerErrorException({
        message: err.message
      });
    }
  }

  @Get("validate-token")
  async validateToken(@Body() tokenDto: ValidateTokenDto): Promise<TokenPayloadDto> {
    try {
      const decoded: TokenPayloadDto = await this .authService.validateToken(tokenDto.token);
      return decoded;
    } catch (error) {
      let err = error as Error;
      throw new InternalServerErrorException({
        message: err.message
      });
    }
  }

  @Post("register")
  @UsePipes(UserDtoValidationPipe)
  async register(@Body() user: CreateUserDto): Promise<UserDto> {
    try {
      const userSaved: UserDto = await this.authService.register(user);
      return userSaved;
    } catch (error) {
      let err = error as Error;
      throw new InternalServerErrorException({
        message: err.message
      });
    }
  }

  @Post("login")
  @UsePipes(UserDtoValidationPipe)
  async login(@Body() user: LoginDto, @Res({ passthrough: true }) res: express.Response): Promise<LoggedResDto> {
    try {
      const response: LoggedInDto = await this.authService.login(user);

      res.cookie('refresh_token', response.refreshToken, {
        httpOnly: true,   
        secure: true,    
        sameSite: 'strict', 
        maxAge: 302400, 
      });

      return { accessToken: response.accessToken, userInfo: response.userInfo };
    } catch (error) {
      let err = error as Error;
      if (err.message === "Password don't match") throw new UnauthorizedException({ message: "Password don't match" });
      throw new InternalServerErrorException({
        message: err.message
      });
    }
  }

  @Post("refresh-tokens")
  async refreshTokens(@Req() req: express.Request, @Res({ passthrough: true }) res: express.Response): Promise<{accessToken: string}> {
    try {
      const token = req.cookies['refresh_token'];
      const newTokens: RefreshedTokensDto = await this.authService.refreshTokens(token);

      res.cookie('refresh_token', newTokens.refreshToken, {
        httpOnly: true,   
        secure: true,    
        sameSite: 'strict', 
        maxAge: 302400, 
      });

      const accessToken = newTokens.accessToken;
      return {accessToken};
    } catch (error) {
      let err = error as Error;
      if (err.message === "Password don't match") throw new UnauthorizedException({ message: "Password don't match" });
      throw new InternalServerErrorException({
        message: err.message
      });
    }
  }




}
