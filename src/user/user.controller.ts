import { SignupPasswordValidationPipe } from 'src/common/pipe/signup.pipe';
import { SigninDtoUser } from 'src/auth/dto/create-auto.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateDtoUser } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  signup(@Body(SignupPasswordValidationPipe) body: CreateDtoUser): object {
    return this.userService.signup(body);
  }

  @Post('/signin')
  signin(@Body() body: SigninDtoUser): object {
    return this.authService.signin(body);
  }
}
