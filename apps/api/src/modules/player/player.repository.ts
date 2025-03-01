import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayerRepository {
    remove(id: number) {
        return `This action removes a #${id} player`;
    }
}
