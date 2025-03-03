import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GameRepository } from './game.repository';
import { PlayerRepository } from '@/modules/player/player.repository';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { JackpotEngine } from '@/shared/engines/jackpot.engine';

@Injectable()
export class GameService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly gameRepository: GameRepository,
        private readonly playerRepository: PlayerRepository,
    ) {}

    private readonly INITIAL_CREDITS = 10;
    private readonly LOOSE_BET_AMOUNT = -1;

    private readonly jackpotEngine = new JackpotEngine();

    async createGame(playerId: number) {
        const game = await this.gameRepository.findOneByPlayerId(playerId);
        if (game) {
            return game;
        }
        const player = await this.playerRepository.findOneById(playerId);
        const credits = player.balance > 0 ? player.balance : this.INITIAL_CREDITS;
        return this.gameRepository.create({
            playerId,
            credits,
        });
    }

    getCurrentGame(playerId: number) {
        return this.gameRepository.findOneByPlayerId(playerId);
    }

    async roll(gameId: number, playerId: number) {
        const game = await this.gameRepository.findOneById(gameId);
        if (!game || game.playerId !== playerId) {
            throw new NotFoundException('Game not found');
        }
        if (game.credits <= 0) {
            throw new BadRequestException('Game credits are not enough');
        }
        const gameResult = this.jackpotEngine.roll(game.credits);
        const credits = this.jackpotEngine.convertToCredits(gameResult);

        const updatedGame = await this.gameRepository.updateById(game.id, {
            credits: game.credits + (credits === 0 ? this.LOOSE_BET_AMOUNT : credits),
        });

        return {
            credits: updatedGame.credits,
            result: gameResult,
        };
    }

    async closeAndCashout(gameId: number, playerId: number) {
        const game = await this.gameRepository.findOneById(Number(gameId));
        if (!game || game.playerId !== playerId) {
            throw new NotFoundException('Game not found');
        }
        return this.prisma.$transaction(async (tx) => {
            const game = await tx.game.delete({
                where: { id: gameId },
                include: {
                    player: true,
                },
            });
            const { passwordHash, ...player } = await tx.player.update({
                where: { id: game.playerId },
                data: {
                    balance: game.credits,
                },
            });
            return player;
        });
    }
}
