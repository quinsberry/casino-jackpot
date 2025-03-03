'use client';

import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { FunctionComponent, useEffect, useState } from 'react';
import { GameSymbol, GameSymbols, useGame } from '@/entities/game';
import { usePlayer } from '@/entities/player';

export const GameSymbolsIcons = {
    [GameSymbols.CHERRY]: '🍒',
    [GameSymbols.LEMON]: '🍋',
    [GameSymbols.ORANGE]: '🍊',
    [GameSymbols.WATERMELON]: '🍉',
    ['LOADING']: '🔄',
};

export const SlotMachine: FunctionComponent = () => {
    const { player } = usePlayer();
    const { currentGame, slots, isSlotsSpinning, isGameClosing, checkGame, startGame, roll, closeGame } = useGame();
    const [visibleSlots, setVisibleSlots] = useState<[GameSymbol, GameSymbol, GameSymbol]>([
        'WATERMELON',
        'WATERMELON',
        'WATERMELON',
    ]);

    useEffect(() => {
        checkGame();
    }, []);

    useEffect(() => {
        if (isSlotsSpinning) {
            setVisibleSlots(['LOADING', 'LOADING', 'LOADING'] as unknown as [GameSymbol, GameSymbol, GameSymbol]);

            // Show first slot after 1s
            setTimeout(() => {
                setVisibleSlots((prev) => [slots[0], prev[1], prev[2]]);
            }, 1000);

            // Show second slot after 2s
            setTimeout(() => {
                setVisibleSlots((prev) => [prev[0], slots[1], prev[2]]);
            }, 2000);

            // Show third slot after 3s
            setTimeout(() => {
                setVisibleSlots(slots);
            }, 3000);
        }
    }, [isSlotsSpinning, slots]);

    return (
        <Card className="w-full max-w-md p-6 bg-background">
            <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 text-xl font-bold">
                    <span>{currentGame ? currentGame.credits : 'Start to play'}</span>
                </div>
                <div className="text-sm text-secondary-foreground">Bet Amount: 1</div>
            </div>

            <div className="flex justify-center gap-4 mb-8">
                {visibleSlots.map((symbol, index) => (
                    <div key={index} className="relative w-20 h-20 bg-zinc-700 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-4xl">
                            {GameSymbolsIcons[symbol]}
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                {!currentGame ? (
                    <Button
                        className="w-full h-12 text-lg"
                        onClick={startGame}
                        disabled={isSlotsSpinning || isGameClosing || !player}
                    >
                        Start Game
                    </Button>
                ) : (
                    <>
                        <Button
                            className="w-full h-12 text-lg"
                            disabled={isSlotsSpinning || currentGame.credits === 0}
                            onClick={roll}
                        >
                            Roll
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full"
                            disabled={isGameClosing || isSlotsSpinning}
                            onClick={closeGame}
                        >
                            Cashout
                        </Button>
                    </>
                )}
            </div>
        </Card>
    );
};
