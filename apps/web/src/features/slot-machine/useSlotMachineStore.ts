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
                setIsSlotsSpinning(true);
                let currGameResponse = await apiGetCurrentGame();
                if (!currGameResponse.data) {
                    currGameResponse = await apiCreateGame();
                }
                setGame(currGameResponse.data);
            } catch (error: unknown) {
                console.error(error);
            } finally {
                setIsSlotsSpinning(false);
            }
        }
    };

    const checkGame = async () => {
        if (!game) {
            try {
                let currGameResponse = await apiGetCurrentGame();
                setGame(currGameResponse.data);
            } catch (error: unknown) {
                console.error(error);
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
            const rollResponse = await apiRoll(game.id).finally(() => setIsSlotsSpinning(false));
            setGame({ ...game, credits: rollResponse.data.credits });
            setSlots(rollResponse.data.result);
        }
    };

    return {
        game,
        slots,
        isSlotsSpinning,
        isGameClosing,
        checkGame,
        startGame,
        closeGame,
        roll,
    };
};
