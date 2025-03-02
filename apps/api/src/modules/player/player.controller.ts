import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PlayerRepository } from './player.repository';
import { AuthGuard } from '../auth/auth.guard';
import { ResponseSingle } from '@/shared/responses/ResponseSingle';

@Controller('player')
export class PlayerController {
    constructor(private readonly playerRepository: PlayerRepository) {}

    @UseGuards(AuthGuard)
    @Get('profile')
    async findProfile(@Request() req) {
        const { passwordHash, ...user } = await this.playerRepository.findOneById(req.player.id);
        return new ResponseSingle(user);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {}

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePlayerDto: any) {}

    @Delete(':id')
    remove(@Param('id') id: string) {}
}
