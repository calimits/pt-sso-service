import { Body, Controller, Get, InternalServerErrorException, Post, UnauthorizedException, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/CreateUserDto';
import { UserDto } from './dtos/UserDto';
import UserDtoValidationPipe from './pipes/validateUserPipe';
import LoginDto from './dtos/LoginDto';
import LoggedInDto from './dtos/LoggedInDto';

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Get("login")
  @UsePipes(UserDtoValidationPipe)
  async login(@Body() user: LoginDto): Promise<LoggedInDto> {
    try {
      const res = await this.authService.login(user);
      return res;
    } catch (error) {
      let err = error as Error;
      if (err.message === "Password don't match") throw new UnauthorizedException({message: "Password don't match"});
      throw new InternalServerErrorException({
        message: err.message
      });
    }
  }
}
