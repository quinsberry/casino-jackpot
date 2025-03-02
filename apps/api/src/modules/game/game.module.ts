import { Module } from '@nestjs/common';
import { GameRepository } from './game.repository';
import { GameController } from './game.controller';
import { PlayerRepository } from '@/modules/player/player.repository';
import { GameService } from './game.service';
@Module({
    controllers: [GameController],
    providers: [GameRepository, PlayerRepository, GameService],
})
export class GameModule {}
