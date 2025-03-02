import { Controller, Get, Post, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard, CurrentAuthPayload, AuthPayload } from '@/modules/auth/auth.utils';
import { ResponseSingle } from '@/shared/responses/ResponseSingle';
import { GameService } from './game.service';
@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @UseGuards(AuthGuard)
    @Post()
    async create(@CurrentAuthPayload() auth: AuthPayload) {
        const newGame = await this.gameService.createGame(auth.id);
        return new ResponseSingle(newGame);
    }

    @UseGuards(AuthGuard)
    @Post(':gameId/roll')
    async roll(@Param('gameId') gameId: string, @CurrentAuthPayload() auth: AuthPayload) {
        const { credits, result } = await this.gameService.roll(Number(gameId), auth.id);
        return new ResponseSingle({
            credits,
            result,
        });
    }

    @UseGuards(AuthGuard)
    @Get('/current')
    async findOne(@CurrentAuthPayload() auth: AuthPayload) {
        const game = await this.gameService.getCurrentGame(auth.id);
        return new ResponseSingle(game ?? null);
    }

    @UseGuards(AuthGuard)
    @Delete(':gameId/cashout')
    async cashout(@Param('gameId') gameId: string, @CurrentAuthPayload() auth: AuthPayload) {
        const player = await this.gameService.closeAndCashout(Number(gameId), auth.id);
        return new ResponseSingle(player, 'Cashout successful');
    }
}
