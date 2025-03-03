import { Player } from '@repo/api/models';
import { login as apiLogin, logout as apiLogout, getPlayerProfile } from './api';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface PlayerContextType {
    player: Player | null;
    isLoading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<Player | null>;
    logout: () => Promise<void>;
    updatePlayerBalance: (balance: number) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
    const [player, setPlayer] = useState<Player | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPlayer = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getPlayerProfile();
            setPlayer(response.data);
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlayer();
    }, [fetchPlayer]);

    const updatePlayerBalance = useCallback((balance: number) => {
        setPlayer((prev) => (prev ? { ...prev, balance } : null));
    }, []);

    const login = useCallback(async (username: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiLogin({ username, password });
            setPlayer(response.data);
            return response.data;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Login failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await apiLogout();
            setPlayer(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Logout failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <PlayerContext.Provider value={{ player, isLoading, error, login, logout, updatePlayerBalance }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};
