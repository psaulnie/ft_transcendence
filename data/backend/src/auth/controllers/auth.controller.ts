import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  /**
   * HINT: Ideally, instead of using the
   * Record<string, any> type,
   * we should use a DTO class
   * to define the shape of the request body.
   * See the validation chapter <https://docs.nestjs.com/techniques/validation> for more information.
   */
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}
