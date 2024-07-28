"use server";

import {z} from "zod";
import {registerUser} from "@/actions/register-data";
import {redirect} from "next/navigation";

export async function registerUserAction(prevState: any, formData: FormData) {
    console.log("Hello From Register User Action");

    const validatedFields = registerValidations.safeParse({
        name: formData.get("name"),
        password: formData.get("password"),
        email: formData.get("email"),
    });
    if (!validatedFields.success) {
        return {
            ...prevState,
            zodErrors: validatedFields.error.flatten().fieldErrors,
            apiErrors: null,
            message: "Failed to Register.",
        };
    }

    console.log("Validated fields: ", validatedFields);
    const responseData = await registerUser(validatedFields.data);
    if (!responseData) {
        return {
            ...prevState,
            apiErrors: null,
            zodErrors: null,
            message: "Registration Failed.",
        };
    }

    if (responseData.error) {
        return {
            ...prevState,
            apiErrors: responseData.error,
            zodErrors: null,
            message: "Failed to Register.",
        };
    }

    if (responseData.code === 200 || responseData.code === 201 ) {
        console.log("#############");
        console.log("User Registered Successfully", responseData);
        console.log("#############");
        redirect('/login');
    }else {
        console.log(responseData);
        return {
            ...prevState,
            apiErrors: {status: responseData.code, message: "Failed to Register"},
            zodErrors: null,
            message: "Failed to Register.",
        };
    }
}

const registerValidations = z.object({
    name: z.string().min(1, {
        message: "Name should not be empty",
    }),
    password: z.string().min(4).max(100, {
        message: "Password must be between 6 and 100 characters",
    }),
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
});