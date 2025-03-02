import { PrismaService } from '@/shared/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Player } from '@prisma/client';

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

    async findOneByName(name: string) {
        const player = await this.prisma.player.findUnique({
            where: {
                name,
            },
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
