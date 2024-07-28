"use client";

import Link from "next/link";
import {useSearchParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {SubmitButton} from "@/components/ui/SubmitButton";
import {ApiErr} from "@/components/common/ApiErr";

export function LoginForm() {

    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password, type: "credentials"}),
            });

            if (res.ok) {
                setAuthenticated(true);
            } else {
                // handle error state here
                setError("Invalid credentials");
            }
        } catch (error) {
            // handle error state here
            console.error("Error during sign-in", error);
            setError("Internal server error");
        }
    };

    useEffect(() => {
        if (authenticated) {
            // Redirect to previous page or home page
            window.location.href = searchParams.get("next") || "/";
        }
    }, [authenticated, searchParams]);

    return (
        <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="pt-4 pb-6 min-w-96">
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl font-bold">Login</CardTitle>
                        <CardDescription>
                            Please login to get into the website.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="text"
                                placeholder="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {/*<ZodErrors error={formState?.zodErrors?.password} />*/}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <SubmitButton
                            className="w-full"
                            text="Login"
                            loadingText="Loading"
                        />
                        {/*{error && <p style={{color: "red"}}>{error}</p>}*/}
                        <ApiErr error={{message: error, status: 400}}/>
                    </CardFooter>
                </Card>
                <div className="mt-4 text-center text-sm">
                    Don`t have an account?
                    <Link className="underline ml-2" href="/register">
                        <b>Sign Up</b>
                    </Link>
                </div>
            </form>
        </div>
    );
}