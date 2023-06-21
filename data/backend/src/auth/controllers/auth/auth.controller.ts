import { Body, Controller, Post, HttpCode, HttpStatus, Get, Res } from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth/auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

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

    // /**
    //  * GET /api/auth/login
    //  * This is the route the user will visit to authenticate
    //  */
    // @Get('login')
    // login() {
    //     return "coucou\n";
    // }

    // /**
    //  * GET /api/auth/redirect
    //  * This is the redirect URL the OAuth2 provider will call
    //  */
    // @Get('redirect')
    // redirect(@Res() res: Response) {
    //     // TODO ? Don't work
    //     // res.send(200);
    // }

    // /**
    //  * GET /api/auth/status
    //  * Retrieve the auth status
    //  */
    // @Get('status')
    // status() { }

    // /**
    //  * GET /api/auth/logout
    //  * Logging the user out
    //  */
    // @Get('logout')
    // logout() { }
}
