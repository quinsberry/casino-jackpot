export class Player {
    id: number;
    username: string;
    balance: number;
    game?: Game;
    createdAt: Date;
    updatedAt: Date;
}

export class Game {
    id: number;
    playerId: number;
    player: Player;
    credits: number;
    createdAt: Date;
    updatedAt: Date;
}
