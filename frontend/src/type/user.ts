interface UserType {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    expiresIn?: number;
}

type UserResponseType = {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    user: any;
};

export type { UserType, UserResponseType };