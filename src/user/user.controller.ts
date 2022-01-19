import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { SigninDtoUser } from 'src/auth/dto/create-auto.dto';
import { CreateDtoUser } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  signup(@Body() body: CreateDtoUser) {
    return this.userService.signup(body);
  }

  @Post('/signin')
  signin(@Body() body: SigninDtoUser) {
    return this.authService.signin(body);
  }
}
