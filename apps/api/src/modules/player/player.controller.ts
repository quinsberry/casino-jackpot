import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlayerRepository } from './player.repository';

@Controller('player')
export class PlayerController {
    constructor(private readonly playerRepository: PlayerRepository) {}

    @Get(':id')
    findOne(@Param('id') id: string) {}

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePlayerDto: any) {}

    @Delete(':id')
    remove(@Param('id') id: string) {}
}
