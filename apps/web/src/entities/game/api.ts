import { ApiClient } from '@/shared/api';
import { Game, Player } from '@repo/api/models';
import { GameSymbol } from './model';

export const getCurrentGame = () => {
    return ApiClient.get<{ data: Game }>('/games/current');
};

export const createGame = () => {
    return ApiClient.post<{ data: Game }>('/games');
};

export const roll = (gameId: number) => {
    return ApiClient.post<{ data: { credits: number; result: [GameSymbol, GameSymbol, GameSymbol] } }>(
        `/games/${gameId}/roll`,
    );
};

export const cashout = (gameId: number) => {
    return ApiClient.delete<{ data: Player }>(`/games/${gameId}/cashout`);
};
