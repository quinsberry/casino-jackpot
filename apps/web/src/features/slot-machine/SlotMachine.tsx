'use client';

import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { FunctionComponent, useEffect } from 'react';
import { GameSymbols, useGame } from '@/entities/game';
import { usePlayer } from '@/entities/player';

export const GameSymbolsIcons = {
    [GameSymbols.CHERRY]: '🍒',
    [GameSymbols.LEMON]: '🍋',
    [GameSymbols.ORANGE]: '🍊',
    [GameSymbols.WATERMELON]: '🍉',
};

export const SlotMachine: FunctionComponent = () => {
    const { currentGame, slots, isSlotsSpinning, isGameClosing, checkGame, startGame, roll, closeGame } = useGame();

    useEffect(() => {
        checkGame();
    }, []);

    return (
        <Card className="w-full max-w-md p-6 bg-background">
            <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 text-xl font-bold">
                    <span>{currentGame ? currentGame.credits : 'Start to play'}</span>
                </div>
                <div className="text-sm text-secondary-foreground">Bet Amount: 1</div>
            </div>

            <div className="flex justify-center gap-4 mb-8">
                {slots.map((symbol, index) => (
                    <div
                        key={index}
                        className="w-20 h-20 bg-zinc-700 rounded-lg flex items-center justify-center text-4xl"
                    >
                        {GameSymbolsIcons[symbol]}
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                {!currentGame ? (
                    <Button
                        className="w-full h-12 text-lg"
                        onClick={startGame}
                        disabled={isSlotsSpinning || isGameClosing}
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
