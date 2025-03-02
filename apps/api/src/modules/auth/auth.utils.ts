import { getCookieToken } from '@/shared/utils/auth-cookie';
import { CanActivate, createParamDecorator, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface AuthPayload {
    id: number;
    username: string;
}

const AUTH_PAYLOAD_KEY = 'player';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = getCookieToken(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            request[AUTH_PAYLOAD_KEY] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }
}

export const CurrentAuthPayload = createParamDecorator<
    keyof AuthPayload | undefined,
    ExecutionContext,
    AuthPayload | any
>((data: keyof AuthPayload | undefined, ctx: ExecutionContext): AuthPayload | any => {
    const request = ctx.switchToHttp().getRequest();
    const payload = request[AUTH_PAYLOAD_KEY] as AuthPayload;

    if (data) {
        return payload[data];
    }

    return payload;
});
