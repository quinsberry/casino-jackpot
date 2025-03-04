import { config } from '@repo/jest-config/nest';

export default {
    ...config,
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
};
