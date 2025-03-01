import { Module } from '@nestjs/common';
import { GameRepository } from './game.repository';
import { GameController } from './game.controller';

@Module({
    controllers: [GameController],
    providers: [GameRepository],
})
export class GameModule {}
