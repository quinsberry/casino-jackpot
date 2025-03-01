import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

@Controller('game')
export class GameController {
    constructor() {}

    @Post()
    create(@Body() createGameDto: any) {}

    @Post(':gameId/roll')
    roll(@Param('gameId') gameId: string, @Body() createGameDto: any) {}

    @Get('/current')
    findOne(@Param('id') id: string) {}

    @Delete(':gameId/cashout')
    cashout(@Param('gameId') gameId: string) {}
}
