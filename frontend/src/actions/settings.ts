"use server";

import {z} from "zod";
import {saveSettings} from "@/actions/settigns-data";
import {auth} from "@/auth";

export async function settingsAction(prevState: any, formData: FormData) {

    const session = await auth();
    const token:string = session?.user?.accessToken ? session?.user?.accessToken : "";

    console.log("Settings Action", formData);
    const validatedFields = settingsValidations.safeParse({
        id: formData.get("id"),
        source: formData.get("source"),
        searchkey: formData.get("searchkey"),
        tags: formData.get("tags"),
    });
    if (!validatedFields.success) {
        return {
            ...prevState,
            zodErrors: validatedFields.error.flatten().fieldErrors,
            apiErrors: null,
            message: "Save Error.",
        };
    }

    const responseData = await saveSettings(token, validatedFields.data);
    console.log('Settings save response: ', responseData);
    if (!responseData) {
        return {
            ...prevState,
            apiErrors: null,
            zodErrors: null,
            message: "Save Error.",
        };
    }

    if (responseData.error) {
        return {
            ...prevState,
            apiErrors: responseData.error,
            zodErrors: null,
            message: "Save Error.",
        };
    }

    if (responseData.code === 200 || responseData.code === 201 ) {
        console.log("#############");
        console.log("User Settings Saved Successfully", responseData);
        console.log("#############");
    }else {
        console.log(responseData);
        return {
            ...prevState,
            apiErrors: {status: responseData.code, message: "Save Error"},
            zodErrors: null,
            message: "Save Error",
        };
    }
}

const settingsValidations = z.object({
    id: z.string(),
    source: z.string(),
    searchkey: z.string(),
    tags: z.string(),
});