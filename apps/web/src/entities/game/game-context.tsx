import { GameSymbol, GameSymbols } from '@/entities/game';
import { createGame, getCurrentGame, roll as apiRoll, cashout } from '@/entities/game/api';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePlayer } from '@/entities/player';

interface GameContextType {
    currentGame: {
        id: number;
        credits: number;
    } | null;
    slots: [GameSymbol, GameSymbol, GameSymbol];
    isSlotsSpinning: boolean;
    isGameClosing: boolean;
    checkGame: () => Promise<void>;
    startGame: () => Promise<void>;
    roll: () => Promise<void>;
    closeGame: () => Promise<void>;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
    const { player, updatePlayerBalance } = usePlayer();
    const [currentGame, setCurrentGame] = useState<{ id: number; credits: number } | null>(null);
    const [slots, setSlots] = useState<[GameSymbol, GameSymbol, GameSymbol]>([
        'WATERMELON',
        'WATERMELON',
        'WATERMELON',
    ]);
    const [isSlotsSpinning, setIsSlotsSpinning] = useState(false);
    const [isGameClosing, setIsGameClosing] = useState(false);

    const startGame = useCallback(async () => {
        if (!player) return;
        try {
            const response = await createGame();
            setCurrentGame(response.data);
        } catch (error) {}
    }, [player]);

    const checkGame = useCallback(async () => {
        try {
            const response = await getCurrentGame();
            setCurrentGame(response.data);
        } catch (error) {}
    }, []);

    const roll = useCallback(async () => {
        if (!currentGame) return;
        setIsSlotsSpinning(true);
        try {
            const response = await apiRoll(currentGame.id);
            setSlots(response.data.result);
            setTimeout(() => {
                setCurrentGame((prev) => (prev ? { ...prev, credits: response.data.credits } : null));
                setIsSlotsSpinning(false);
            }, 3000);
        } catch (error) {
            setIsSlotsSpinning(false);
        }
    }, [currentGame]);

    const closeGame = useCallback(async () => {
        if (!currentGame) return;
        setIsGameClosing(true);
        try {
            const response = await cashout(currentGame.id);
            setCurrentGame(null);
            setSlots(['WATERMELON', 'WATERMELON', 'WATERMELON']);
            updatePlayerBalance(response.data.balance);
        } catch (error) {
        } finally {
            setIsGameClosing(false);
        }
    }, [currentGame]);

    return (
        <GameContext.Provider
            value={{ currentGame, slots, isSlotsSpinning, isGameClosing, checkGame, startGame, roll, closeGame }}
        >
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
