import {
    createGame as apiCreateGame,
    roll as apiRoll,
    GameSymbol,
    getCurrentGame as apiGetCurrentGame,
    cashout as apiCashout,
} from '@/entities/game';
import { ResponseError } from '@/shared/api';
import { Game } from '@repo/api/models';
import { useState } from 'react';

interface UseSlotMachineStoreConfig {
    updateBalance: (balance: number) => void;
    initialSlots: [GameSymbol, GameSymbol, GameSymbol];
}
export const useSlotMachineStore = ({ updateBalance, initialSlots }: UseSlotMachineStoreConfig) => {
    const [game, setGame] = useState<Game | null>(null);
    const [isSlotsSpinning, setIsSlotsSpinning] = useState(true);
    const [isGameClosing, setIsGameClosing] = useState(false);
    const [slots, setSlots] = useState<[GameSymbol, GameSymbol, GameSymbol]>(initialSlots);

    const startGame = async () => {
        if (!game) {
            try {
                const { data: game } = await apiGetCurrentGame();
                if (game) {
                    setGame(game);
                }
            } catch (error: unknown) {
                if (error instanceof ResponseError && error.statusCode === 404) {
                    const { data: game } = await apiCreateGame();
                    setGame(game);
                }
            } finally {
                setIsSlotsSpinning(false);
            }
        }
    };

    const closeGame = async () => {
        if (game) {
            setIsGameClosing(true);
            const { data: player } = await apiCashout(game.id).finally(() => setIsGameClosing(false));
            setGame(null);
            updateBalance(player.balance);
        }
    };

    const roll = async () => {
        if (game) {
            setIsSlotsSpinning(true);
            const data = await apiRoll(game.id).finally(() => setIsSlotsSpinning(false));
            setGame({ ...game, credits: data.credits });
            setSlots(data.result);
        }
    };

    return {
        game,
        slots,
        isSlotsSpinning,
        isGameClosing,
        startGame,
        closeGame,
        roll,
    };
};
