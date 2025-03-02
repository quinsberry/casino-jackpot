import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PlayerRepository } from './player.repository';
import { ResponseSingle } from '@/shared/responses/ResponseSingle';
import { AuthGuard, CurrentAuthPayload, AuthPayload } from '@/modules/auth/auth.utils';

@Controller('player')
export class PlayerController {
    constructor(private readonly playerRepository: PlayerRepository) {}

    @UseGuards(AuthGuard)
    @Get('profile')
    async findProfile(@CurrentAuthPayload() auth: AuthPayload) {
        const { passwordHash, ...user } = await this.playerRepository.findOneById(auth.id);
        return new ResponseSingle(user);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {}

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePlayerDto: any) {}

    @Delete(':id')
    remove(@Param('id') id: string) {}
}
