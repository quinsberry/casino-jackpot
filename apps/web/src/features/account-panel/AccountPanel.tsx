'use client';

import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { FunctionComponent } from 'react';
import { LoginDialog } from './LoginDialog';
import { PiggyBank } from 'lucide-react';
import { usePlayer } from '@/entities/player';
import { useGame } from '@/entities/game';

export const AccountPanel: FunctionComponent = () => {
    const { player, logout, isLoading } = usePlayer();
    const { currentGame } = useGame();
    console.log('player', player);

    return (
        <Card className="w-full max-w-md p-6 bg-background">
            <div className="text-center flex justify-between items-center">
                <div className="flex items-center justify-center gap-2 text-xl font-bold">
                    <PiggyBank className="text-yellow-500" size={28} />
                    <span>{player ? (currentGame ? 'Playing...' : player?.balance) : '???'}</span>
                </div>
                {player ? (
                    <Button variant="outline" onClick={logout} disabled={isLoading || !!currentGame}>
                        Logout
                    </Button>
                ) : (
                    <LoginDialog />
                )}
            </div>
        </Card>
    );
};
