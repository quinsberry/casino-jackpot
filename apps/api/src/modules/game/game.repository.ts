import { Injectable } from '@nestjs/common';

@Injectable()
export class GameRepository {
    remove(id: number) {
        return `This action removes a #${id} player`;
    }
}
