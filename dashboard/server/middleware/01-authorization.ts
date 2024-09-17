
import { readUserJwt } from "../AuthManager";
import { UserModel } from "@schema/UserSchema";
import { ADMIN_EMAILS } from '@data/ADMINS';

import type { H3Event, EventHandlerRequest } from 'h3';

export type AuthContextLogged = {
    id: string,
    logged: true,
    user: {
        email: string,
        name: string,
        roles: string[],
        picture?: string,
    }
}

export type AuthContext = { logged: false } | AuthContextLogged;



async function authorizationMiddleware(event: H3Event<EventHandlerRequest>) {
    const authorization = event.headers.get('Authorization');

    if (!authorization) {

        event.context.auth = { logged: false }

    } else {

        const [type, token] = authorization.split(' ');
        
        const valid = readUserJwt(token);
        if (!valid) return event.context.auth = { logged: false }

        const user = await UserModel.findOne({ email: valid.email })
        if (!user) return event.context.auth = { logged: false };

        const roles: string[] = [];
        
        if (ADMIN_EMAILS.includes(user.email)) {
            roles.push('ADMIN');
        }

        const authContext: AuthContext = {
            logged: true,
            user: {
                email: user.email,
                name: user.name,
                picture: user.picture || `https://robohash.org/${user.email}?set=set4`,
                roles
            },
            id: user._id.toString()
        }
        
        event.context.auth = authContext;

    }
}

export default defineEventHandler(async (event) => {
    await authorizationMiddleware(event);
})