import { ApiClient } from '@/shared/api';
import { LoginDto, RegisterDto } from '@repo/api/auth.dto';
import { Player } from '@repo/api/models';

export const getPlayerProfile = () => {
    return ApiClient.get<{ data: Player }>('/players/profile');
};

export const login = (dto: LoginDto) => {
    return ApiClient.post<{ data: Player }>('/auth/login', {
        body: dto,
    });
};

export const register = (dto: RegisterDto) => {
    return ApiClient.post<{ data: Player }>('/auth/register', {
        body: dto,
    });
};

export const logout = () => {
    return ApiClient.post<void>('/auth/logout');
};
