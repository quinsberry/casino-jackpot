import { ApiClient } from '@/shared/api';
import { Game, Player } from '@repo/api/models';
import { GameSymbol } from './model';

export const getCurrentGame = () => {
    return ApiClient.get<{ data: Game }>('/game');
};

export const createGame = () => {
    return ApiClient.post<{ data: Game }>('/game');
};

export const roll = (gameId: number) => {
    return ApiClient.post<{ credits: number; result: [GameSymbol, GameSymbol, GameSymbol] }>(`/game/${gameId}/roll`);
};

export const cashout = (gameId: number) => {
    return ApiClient.post<{ data: Player }>(`/game/${gameId}/cashout`);
};
