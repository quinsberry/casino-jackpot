import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { AuthGuard } from '@/modules/auth/auth.utils';
import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('GameController', () => {
    let controller: GameController;
    let gameService: GameService;

    const mockGameService = {
        createGame: jest.fn() as jest.Mock<() => ReturnType<GameService['createGame']>>,
        roll: jest.fn() as jest.Mock<() => ReturnType<GameService['roll']>>,
        getCurrentGame: jest.fn() as jest.Mock<() => ReturnType<GameService['getCurrentGame']>>,
        closeAndCashout: jest.fn() as jest.Mock<() => ReturnType<GameService['closeAndCashout']>>,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GameController],
            providers: [
                {
                    provide: GameService,
                    useValue: mockGameService,
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<GameController>(GameController);
        gameService = module.get<GameService>(GameService);
    });

    describe('cashout', () => {
        const mockAuth = { id: 1, username: 'testuser' };
        const mockGameId = '123';
        const mockPlayer = {
            id: 1,
            username: 'testuser',
            balance: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        describe('successful scenarios', () => {
            it('should successfully cashout and return updated player', async () => {
                mockGameService.closeAndCashout.mockResolvedValue(mockPlayer);

                const result = await controller.cashout(mockGameId, mockAuth);

                expect(result.data).toEqual(mockPlayer);
                expect(result.description).toBe('Cashout successful');
                expect(gameService.closeAndCashout).toHaveBeenCalledWith(Number(mockGameId), mockAuth.id);
            });
        });

        describe('authorization', () => {
            it('should reject cashout for game owned by different player', async () => {
                const differentPlayerAuth = { id: 2, username: 'otheruser' };
                mockGameService.closeAndCashout.mockRejectedValue(new NotFoundException('Game not found'));

                await expect(controller.cashout(mockGameId, differentPlayerAuth)).rejects.toThrow(NotFoundException);
            });
        });

        describe('error handling', () => {
            it('should handle database transaction failures', async () => {
                mockGameService.closeAndCashout.mockRejectedValue(new Error('Database transaction failed'));

                await expect(controller.cashout(mockGameId, mockAuth)).rejects.toThrow('Database transaction failed');
            });
        });

        describe('performance', () => {
            it('should complete within acceptable time', async () => {
                mockGameService.closeAndCashout.mockResolvedValue(mockPlayer);

                const start = Date.now();
                await controller.cashout(mockGameId, mockAuth);
                const duration = Date.now() - start;

                expect(duration).toBeLessThan(1000); // Should complete within 1 second
            });
        });
    });
});
