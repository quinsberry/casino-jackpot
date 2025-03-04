import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { GameRepository } from './game.repository';
import { PlayerRepository } from '@/modules/player/player.repository';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Player } from '@prisma/client';
import { Game } from '@prisma/client';

describe('GameService', () => {
    let service: GameService;
    let gameRepository: GameRepository;
    let playerRepository: PlayerRepository;
    let prismaService: PrismaService;

    const mockGameRepository = {
        findOneById: jest.fn() as jest.Mock<() => ReturnType<GameRepository['findOneById']>>,
        findOneByPlayerId: jest.fn() as jest.Mock<() => ReturnType<GameRepository['findOneByPlayerId']>>,
        create: jest.fn() as jest.Mock<() => ReturnType<GameRepository['create']>>,
        updateById: jest.fn() as jest.Mock<() => ReturnType<GameRepository['updateById']>>,
        deleteById: jest.fn() as jest.Mock<() => ReturnType<GameRepository['deleteById']>>,
    };

    const mockPlayerRepository = {
        findOneById: jest.fn() as jest.Mock<() => ReturnType<PlayerRepository['findOneById']>>,
        findOneByUsername: jest.fn() as jest.Mock<() => ReturnType<PlayerRepository['findOneByUsername']>>,
        updateById: jest.fn() as jest.Mock<() => ReturnType<PlayerRepository['updateById']>>,
        create: jest.fn() as jest.Mock<() => ReturnType<PlayerRepository['create']>>,
    };

    type MockTransactionClient = {
        game: {
            delete: jest.Mock<() => Promise<Game & { player: Player }>>;
        };
        player: {
            update: jest.Mock<() => Promise<Player>>;
        };
    };

    const mockPrismaService = {
        $transaction: jest.fn() as jest.Mock<<T>(callback: (tx: MockTransactionClient) => Promise<T>) => Promise<T>>,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GameService,
                {
                    provide: GameRepository,
                    useValue: mockGameRepository,
                },
                {
                    provide: PlayerRepository,
                    useValue: mockPlayerRepository,
                },
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<GameService>(GameService);
        gameRepository = module.get<GameRepository>(GameRepository);
        playerRepository = module.get<PlayerRepository>(PlayerRepository);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('closeAndCashout', () => {
        const mockGameId = 123;
        const mockPlayerId = 1;
        const mockGameDB = {
            id: mockGameId,
            playerId: mockPlayerId,
            credits: 100,
            player: {
                id: mockPlayerId,
                username: 'testuser',
                balance: 0,
                passwordHash: 'password',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const mockUpdatedPlayerDB = {
            id: mockPlayerId,
            username: 'testuser',
            balance: 100,
            passwordHash: 'password',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        describe('successful scenarios', () => {
            it('should successfully close game and update player balance', async () => {
                mockGameRepository.findOneById.mockResolvedValue(mockGameDB);
                mockPrismaService.$transaction.mockImplementation(async (callback) => {
                    const mockTx: MockTransactionClient = {
                        game: {
                            delete: jest.fn(() => Promise.resolve(mockGameDB)),
                        },
                        player: {
                            update: jest.fn(() => Promise.resolve(mockUpdatedPlayerDB)),
                        },
                    };
                    return callback(mockTx);
                });

                const result = await service.closeAndCashout(mockGameId, mockPlayerId);

                const { passwordHash, ...mockUpdatedPlayer } = mockUpdatedPlayerDB;
                expect(result).toEqual(mockUpdatedPlayer);
                expect(gameRepository.findOneById).toHaveBeenCalledWith(mockGameId);
                expect(mockPrismaService.$transaction).toHaveBeenCalled();
            });

            it('should correctly transfer game credits to player balance', async () => {
                const gameWithCredits = {
                    ...mockGameDB,
                    credits: 50,
                    player: {
                        ...mockGameDB.player,
                        balance: 100,
                    },
                };

                const expectedPlayerBalance = 150; // 100 + 50

                mockGameRepository.findOneById.mockResolvedValue(gameWithCredits);
                mockPrismaService.$transaction.mockImplementation(async (callback) => {
                    const mockTx: MockTransactionClient = {
                        game: {
                            delete: jest.fn(() => Promise.resolve(gameWithCredits)),
                        },
                        player: {
                            update: jest.fn(() =>
                                Promise.resolve({
                                    ...mockUpdatedPlayerDB,
                                    balance: expectedPlayerBalance,
                                }),
                            ),
                        },
                    };
                    return callback(mockTx);
                });

                const result = await service.closeAndCashout(mockGameId, mockPlayerId);
                const { passwordHash, ...expectedPlayer } = mockUpdatedPlayerDB;
                expect(result).toEqual({
                    ...expectedPlayer,
                    balance: expectedPlayerBalance,
                });
            });
        });

        describe('error handling', () => {
            it('should throw NotFoundException when game is not found', async () => {
                mockGameRepository.findOneById.mockResolvedValue(null);

                await expect(service.closeAndCashout(mockGameId, mockPlayerId)).rejects.toThrow(NotFoundException);
            });

            it('should throw NotFoundException when game belongs to different player', async () => {
                mockGameRepository.findOneById.mockResolvedValue({
                    ...mockGameDB,
                    playerId: 999, // Different player id
                });

                await expect(service.closeAndCashout(mockGameId, mockPlayerId)).rejects.toThrow(NotFoundException);
            });

            it('should handle transaction rollback on error', async () => {
                mockGameRepository.findOneById.mockResolvedValue(mockGameDB);
                mockPrismaService.$transaction.mockImplementation(async (callback) => {
                    const mockTx: MockTransactionClient = {
                        game: {
                            delete: jest.fn(() => Promise.reject(new Error('Database error'))),
                        },
                        player: {
                            update: jest.fn(() => Promise.resolve(mockUpdatedPlayerDB)),
                        },
                    };
                    return callback(mockTx);
                });

                await expect(service.closeAndCashout(mockGameId, mockPlayerId)).rejects.toThrow('Database error');
            });
        });
    });
});
