import { Controller, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '@repo/api/auth.dto';
import { ResponseSingle } from '@/shared/responses/ResponseSingle';
import { ResponseOK } from '@/shared/responses/ResponseOK';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post('/register')
    async register(@Body() registerDto: RegisterDto) {
        await this.authService.register(registerDto.username, registerDto.password);
        return new ResponseOK('Player registered successfully');
    }

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const user = await this.authService.login(loginDto.username, loginDto.password, res);
        return new ResponseSingle(user);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('/logout')
    logout(@Res({ passthrough: true }) res: Response) {
        this.authService.logout(res);
    }
}
