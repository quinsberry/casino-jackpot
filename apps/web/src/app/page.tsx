'use client';

import { AccountPanel } from '@/features/account-panel';
import { SlotMachine } from '@/features/slot-machine';
import { PlayerProvider } from '@/entities/player';
import { GameProvider } from '@/entities/game';

const RootPage = () => {
    return (
        <PlayerProvider>
            <GameProvider>
                <div className="min-h-screen bg-secondary flex flex-col gap-4 items-center justify-center p-4">
                    <AccountPanel />
                    <SlotMachine />
                </div>
            </GameProvider>
        </PlayerProvider>
    );
};

export default RootPage;
