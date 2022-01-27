import { PipeTransform, Injectable, ArgumentMetadata, HttpException } from '@nestjs/common';

@Injectable()
export class SignupPasswordValidationPipe implements PipeTransform {
  transform(value: { password: string }, metadata: ArgumentMetadata) {
    const reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const signupPassword = value.password;

    if (!reg.test(signupPassword))
      throw new HttpException(
        '비밀번호는 8자 이상이어야 하며, 숫자/대문자/소문자/특수문자를 모두 포함해야 합니다.',
        401,
      );

    return value;
  }
}
