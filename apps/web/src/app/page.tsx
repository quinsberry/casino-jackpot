'use client';

import { AccountPanel } from '@/features/account-panel';
import { SlotMachine } from '@/features/slot-machine';
import { useState } from 'react';

const RootPage = () => {
    const [balance, setBalance] = useState<number | null>(null);
    console.log('balance', balance);
    return (
        <div className="min-h-screen bg-secondary flex flex-col gap-4 items-center justify-center p-4">
            <AccountPanel balance={balance} updateBalance={setBalance} />
            <SlotMachine isAuth={!!balance} updateBalance={setBalance} />
        </div>
    );
};

export default RootPage;
