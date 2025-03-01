import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerRepository } from './player.repository';

@Module({
    controllers: [PlayerController],
    providers: [PlayerRepository],
})
export class PlayerModule {}
