import { Module } from '@nestjs/common';

import { PlayerModule } from './modules/player/player.module';
import { GameModule } from './modules/game/game.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [PlayerModule, GameModule, AuthModule],
})
export class AppModule {}
