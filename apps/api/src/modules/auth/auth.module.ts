import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PlayerModule } from '@/modules/player/player.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        PlayerModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: parseInt(process.env.AUTH_EXPIRATION) },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
