'use client';

import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Coins } from 'lucide-react';
import { FunctionComponent, useEffect } from 'react';
import { useSlotMachineStore } from './useSlotMachineStore';
import { GameSymbols } from '@/entities/game';

interface SlotMachineProps {
    isAuth: boolean;
    updateBalance: (balance: number) => void;
}
const BET_AMOUNT = 1;

export const GameSymbolsIcons = {
    [GameSymbols.CHERRY]: '🍒',
    [GameSymbols.LEMON]: '🍋',
    [GameSymbols.ORANGE]: '🍊',
    [GameSymbols.WATERMELON]: '🍉',
};
export const SlotMachine: FunctionComponent<SlotMachineProps> = ({ isAuth, updateBalance }) => {
    const { game, slots, isSlotsSpinning, isGameClosing, startGame, roll, closeGame } = useSlotMachineStore({
        updateBalance,
        initialSlots: ['WATERMELON', 'WATERMELON', 'WATERMELON'],
    });

    useEffect(() => {
        if (isAuth) {
            startGame();
        }
    }, [isAuth]);

    return (
        <Card className="w-full max-w-md p-6 bg-background">
            <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 text-xl font-bold">
                    {/* @ts-ignore */}
                    <Coins className="text-yellow-500" />
                    <span>{game?.credits ?? '???'}</span>
                </div>
                <div className="text-sm text-secondary-foreground">Bet Amount: {BET_AMOUNT}</div>
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
                <Button
                    className="w-full h-12 text-lg"
                    disabled={isSlotsSpinning || !game || game.credits === 0}
                    onClick={roll}
                >
                    Roll
                </Button>

                <Button
                    variant="default"
                    className="w-full"
                    disabled={isGameClosing || !game || isSlotsSpinning}
                    onClick={closeGame}
                >
                    Cashout
                </Button>
            </div>
        </Card>
    );
};
