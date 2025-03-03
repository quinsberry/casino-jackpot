'use client';

import { SlotMachine } from '@/features/slot-machine';

const RootPage = () => {
    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
            <SlotMachine isAuth={false} updateBalance={() => {}} />
        </div>
    );
};

export default RootPage;
