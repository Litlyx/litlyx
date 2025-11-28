
declare module '#auth-utils' {

    interface User {
        email: string,
        name: string
    }

    interface UserSession {
        v: string
    }

    interface SecureSessionData {
        user_id: string
    }
}

export { }