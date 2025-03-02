import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PlayerRepository } from '@/modules/player/player.repository';
import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { deleteCookieToken, setCookieToken } from '@/shared/utils/auth-cookie';

const scryptAsync = promisify(scrypt);
@Injectable()
export class AuthService {
    constructor(
        private readonly playerRepository: PlayerRepository,
        private readonly jwtService: JwtService,
    ) {}


    async register(username: string, password: string) {
        const user = await this.playerRepository.findOneByName(username);
        if (user) {
            throw new UnauthorizedException('Player with this username already exists');
        }
        const passwordHash = await AuthService.hashPassword(password);
        return this.playerRepository.create({
            name: username,
            passwordHash,
            balance: 0,
        });
    }

    async login(username: string, password: string, res: Response) {
        const user = await this.playerRepository.findOneByName(username);
        if (!user) {
            throw new UnauthorizedException('Invalid username or password');
        }
        const passwordCheckPass = await AuthService.comparePassword(user.passwordHash, password);
        if (!passwordCheckPass) {
            throw new UnauthorizedException('Invalid username or password');
        }
        const { passwordHash, ...result } = user;
        const payload = { id: user.id, username: user.name };
        const token = await this.jwtService.signAsync(payload);
        setCookieToken(res, token);
        return result;
    }

    logout(res: Response): void {
        deleteCookieToken(res);
    }

    static async comparePassword(storedPassword: string, suppliedPassword: string): Promise<boolean> {
        const [hashedPassword, salt] = storedPassword.split('.');
        const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex');
        const suppliedPasswordBuf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
        return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
    }

    static async hashPassword(password: string): Promise<string> {
        const salt = randomBytes(16).toString('hex');
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;
        return `${buf.toString('hex')}.${salt}`;
    }
}
