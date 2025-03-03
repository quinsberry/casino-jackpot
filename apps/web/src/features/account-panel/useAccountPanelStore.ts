'use client';

import { login as apiLogin, logout as apiLogout, getPlayerProfile } from '@/entities/player';
import { Player } from '@repo/api/models';
import { useState } from 'react';

export const useAccountPanelStore = () => {
    const [player, setPlayer] = useState<Player | null>(null);
    const login = async (username: string, password: string) => {
        return apiLogin({ username, password }).then((response) => {
            setPlayer(response.data);
            return response.data;
        });
    };

    const logout = async () => {
        try {
            await apiLogout();
            setPlayer(null);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPlayer = async () => {
        try {
            const player = await getPlayerProfile();
            setPlayer(player.data);
            return player.data;
        } catch (error) {
            console.error(error);
        }
    };

    return {
        player,
        fetchPlayer,
        login,
        logout,
    };
};
