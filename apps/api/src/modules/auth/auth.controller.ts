import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    register(@Body() createAuthDto: any) {}

    @Post('/login')
    login(@Body() createAuthDto: any) {}

    @Get('/logout')
    logout() {}
}
