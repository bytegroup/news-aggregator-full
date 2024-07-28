interface RegisterUserProps {
    name: string;
    email: string;
    password: string;
}

interface LoginUserProps {
    email: string;
    password: string;
}

const baseUrl=process.env.NEXT_PUBLIC_BASE_URL;

export async function registerUser(userData: RegisterUserProps) {
    const url = new URL("/users/create" , baseUrl);
    console.log("submit form: ", userData);
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({...userData}),
            cache: "no-cache",
        });
        return await response.json();
    } catch (err:any) {
        console.error("Registration Service Error:", err);
        return {error: err.statusText};
    }
}

export async function loginUser(userData: LoginUserProps) {
    const url = new URL("/auth/login" , baseUrl);
    console.log("submit form: ", userData);
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({...userData}),
            cache: "no-cache",
        });
        return await response.json();
    } catch (err:any) {
        console.error("Login Service Error:", err);
        return {error: err.statusText};
    }
}