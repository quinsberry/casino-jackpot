import { PrismaService } from '@/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';

@Injectable()
export class PlayerRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findOneById(id: number) {
        const player = await this.prisma.player.findUnique({
            where: {
                id,
            },
        });
        return player;
    }

    async findOneByUsername(username: string) {
        const player = await this.prisma.player.findUnique({
            where: {
                username,
            },
        });
        return player;
    }

    async updateById1(id: number, data: Partial<Player>) {
        const player = await this.prisma.player.update({
            where: { id },
            data,
        });
        return player;
    }

    async updateById(id: number, data: Partial<Player>, tx?: Prisma.TransactionClient) {
        const client = tx || this.prisma;
        const player = await client.player.update({
            where: { id },
            data,
        });
        return player;
    }

    async create(data: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>) {
        const player = await this.prisma.player.create({
            data: data,
        });
        return player;
    }
}
