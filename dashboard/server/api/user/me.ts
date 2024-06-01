import { AuthContext } from "~/server/middleware/01-authorization";

export default defineEventHandler(async event => {
    const userData: AuthContext = getRequestUser(event) as any;
    return userData;
});