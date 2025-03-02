import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { Game } from '@prisma/client';

@Injectable()
export class GameRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>) {
        const game = await this.prisma.game.create({
            data: data,
            include: {
                player: {
                    select: {
                        id: true,
                        username: true,
                        balance: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
        return game;
    }

    async findOneById(id: number) {
        const game = await this.prisma.game.findUnique({
            where: { id },
            include: {
                player: {
                    select: {
                        id: true,
                        username: true,
                        balance: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
        return game;
    }

    async findOneByPlayerId(playerId: number) {
        const game = await this.prisma.game.findUnique({
            where: { playerId },
            include: {
                player: {
                    select: {
                        id: true,
                        username: true,
                        balance: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
        return game;
    }

    async updateById(id: number, data: Partial<Game>) {
        return this.prisma.game.update({
            where: { id },
            data,
            include: {
                player: {
                    select: {
                        id: true,
                        username: true,
                        balance: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
    }

    async deleteById(id: number) {
        await this.prisma.game.delete({
            where: { id },
        });
    }
}
