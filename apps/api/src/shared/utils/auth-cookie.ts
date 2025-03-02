import { Response, Request } from 'express';

const authCookieName = 'auth_token';

export const setCookieToken = (res: Response, token: string) => {
    res.cookie(authCookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: parseInt(process.env.AUTH_EXPIRATION),
        path: '/',
    });
};

export const deleteCookieToken = (res: Response) => {
    res.clearCookie(authCookieName);
};

export const getCookieToken = (req: Request) => {
    return req.cookies[authCookieName];
};
