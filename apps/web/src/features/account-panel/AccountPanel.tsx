'use client';

import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { FunctionComponent, useEffect } from 'react';
import { LoginDialog } from './LoginDialog';
import { PiggyBank } from 'lucide-react';
import { useAccountPanelStore } from './useAccountPanelStore';

interface AccountPanelProps {
    balance: number | null;
    updateBalance: (balance: number) => void;
}

export const AccountPanel: FunctionComponent<AccountPanelProps> = ({ balance, updateBalance }) => {
    const { player, login, logout, fetchPlayer } = useAccountPanelStore();

    useEffect(() => {
        fetchPlayer().then((player) => {
            if (player) {
                updateBalance(player.balance);
            }
        });
    }, []);

    return (
        <Card className="w-full max-w-md p-6 bg-background">
            <div className="text-center flex justify-between items-center">
                <div className="flex items-center justify-center gap-2 text-xl font-bold">
                    {/* @ts-ignore */}
                    <PiggyBank className="text-yellow-500" size={28} />
                    <span>{balance ?? '???'}</span>
                </div>
                {balance !== null ? (
                    <Button variant="outline" onClick={logout}>
                        Logout
                    </Button>
                ) : (
                    <LoginDialog onSubmit={login} />
                )}
            </div>
        </Card>
    );
};
