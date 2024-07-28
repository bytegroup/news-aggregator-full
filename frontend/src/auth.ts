import type {Account, NextAuthConfig, Session, User} from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {JWT} from "next-auth/jwt";
import {UserResponseType, UserType} from "@/type/user";
import {CredentialsType} from "@/type/login";
import {decodeJwt} from "jose";

// Modify NextAuth types with custom properties
declare module "next-auth" {
    interface User extends UserType {}
}

declare module "next-auth/adapters" {
    interface AdapterUser extends UserType {}
}

declare module "next-auth/jwt" {
    interface JWT extends UserType{
        access_token: string
        expires_at: number
        refresh_token: string
        error?: "RefreshAccessTokenError"
    }
}

declare module "next-auth" {
    interface Session {
        error?: "RefreshAccessTokenError"
    }
}

const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            authorize: async (credentials) => {
                console.log("credentials", credentials);
                try {
                    const user = await fetchUser(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
                        {
                            email:
                                typeof credentials.email === "string"
                                    ? credentials.email
                                    : "",
                            password:
                                typeof credentials.password === "string"
                                    ? credentials.password
                                    : "",
                        }
                    );

                    return user ? createUser(user) : null;
                } catch (error) {
                    console.error("Error during authentication", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }: { token: JWT; user: User, account: Account | null }) {
            //console.log("jwt token", token);
            //console.log("jwt user", user);
            //console.log("jwt account", account);

            if (account) {
                token.id= user.id || '';
                token.name= user.name;
                token.email= user.email;
                token.accessToken= user.accessToken;
                token.refreshToken= user.refreshToken;
                token.access_token= user.accessToken;
                token.expires_at= user.expiresIn || Date.now();
                token.refresh_token= user.refreshToken;
                token.user= user
                return token;
            } else if (Date.now() < token.expires_at * 1000) {
                return token
            } else {
                if (!token.refresh_token) throw new Error("Missing refresh token")
                //console.log("refreshing access token.... ");
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/token-refresh`, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Authorization: `Bearer ${token.refresh_token}`
                        },
                        method: "POST",
                    })

                    const responseTokens = await response.json()
                    if (!response.ok) throw responseTokens

                    token.accessToken = responseTokens.accessToken;
                    token.access_token = responseTokens.accessToken;
                    token.expires_at = decodeJwt(responseTokens.accessToken).exp || Date.now();

                    return token;
                } catch (error) {
                    console.error("Error refreshing access token", error)
                    // The error property can be used client-side to handle the refresh token error
                    token.error = "RefreshAccessTokenError" as const;
                    await signOut();
                    return token;
                }
            }
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            //console.log("old session token", session.user?.accessToken);
            //console.log("token", token.accessToken);
            //console.log("token", token.access_token);
            session.user = {
                id: token.id,
                name: token.name,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                email: token.email ? token.email : "",
            };
            session.error = token.error;
            //console.log('new session: ', session.user.accessToken);

            return session;
        },
    },
    pages: {
        signIn: "/login",
        // error: "/auth/error",
    },
    session: {
        strategy: "jwt",
    },
} satisfies NextAuthConfig;

async function fetchUser(
    url: string,
    body: CredentialsType
) {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const user = await res.json();

        if (res.ok && user) {
            return user;
        } else {
            console.error(`Failed to fetch user: ${res.status} ${res.statusText}`);
            return null;
        }
    } catch (error) {
        console.error(`Error during fetch: ${error}`);
        return null;
    }
}

function createUser(user: UserResponseType) {
    //console.log("createUser", user);
    const userObject: UserType = {
        id: user.id,
        name: user.user.name,
        email: user.user.email,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        expiresIn: decodeJwt(user.accessToken).exp,
    };

    return userObject;
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);