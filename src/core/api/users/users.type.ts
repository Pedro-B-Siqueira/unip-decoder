export interface Users {
    id: string,
    username: string,
    email: string,
    password: string,
    active?: boolean,
    created_at?: string,
    last_login?: string
}

export interface UsersSearchParams {
    id?: string,
    email?: string,
    username?: string
}