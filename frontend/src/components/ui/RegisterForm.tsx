"use client";

import Link from "next/link";
import {
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    CardFooter,
    Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {useState} from "react";
import {registerUserAction} from "@/actions/register";
import { useFormState } from "react-dom";
import {ZodErrors} from "@/components/common/ValidationErr";
import {SubmitButton} from "@/components/ui/SubmitButton";
import {ApiErr} from "@/components/common/ApiErr";

const INIT_STATE = {
    data: null,
    zodErrors: null,
    message: null,
};

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [formState, formAction] = useFormState(
        registerUserAction,
        INIT_STATE
    );

    return (
        <div className="w-full max-w-md">
            <form action={formAction} className="pt-4 pb-6 min-w-96">
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl font-bold">Register</CardTitle>
                        <CardDescription>
                            Please register yourself to create login credentials
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Full Name"
                            />
                            <ZodErrors error={formState?.zodErrors?.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                            />
                            <ZodErrors error={formState?.zodErrors?.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="password"
                            />
                            <ZodErrors error={formState?.zodErrors?.password} />
                        </div>
                        <div className="space-y-2">
                            {/*<Checkbox
                                id="password"
                                placeholder="password"
                            />*/}
                            <label onClick={() => setShowPassword(!showPassword)}
                                   className="items-center bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer "
                                   htmlFor="password">{showPassword ? 'Hide Password' : 'Show Password'}</label>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <SubmitButton
                            className="w-full"
                            text="Register"
                            loadingText="Loading"
                        />
                        <ApiErr error={formState?.apiErrors} />
                    </CardFooter>
                </Card>
                <div className="mt-4 text-center text-sm">
                    Have an account?
                    <Link className="underline ml-2" href="login">
                        Sing In
                    </Link>
                </div>
            </form>
        </div>
    );
}