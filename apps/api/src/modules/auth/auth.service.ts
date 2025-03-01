import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    remove(id: number) {
        return `This action removes a #${id} auth`;
    }
}
