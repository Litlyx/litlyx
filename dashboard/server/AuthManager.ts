
import jwt from 'jsonwebtoken';

const { AUTH_JWT_SECRET } = useRuntimeConfig();

function createJwt(data: Object) {
    return jwt.sign(data, AUTH_JWT_SECRET, { expiresIn: '30d' });
}

function readJwt(data: string) {
    try {
        return jwt.verify(data, AUTH_JWT_SECRET);
    } catch (ex) {
        return false;
    }
}


export type TUserJwt = {
    email: string,
    name: string
}

export function readUserJwt(raw: string) {
    const data = readJwt(raw);
    return data as TUserJwt | undefined;
}

export function createUserJwt(data: TUserJwt) {
    return createJwt(data);
}