"use server";

export interface UserSettingsProps {
    id: string | null;
    source: string | null;
    searchkey: string | null;
    tags: string | null;
}

const baseUrl=process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4001';

export async function saveSettings(token:string, settings: UserSettingsProps) {
    const url = new URL("/news/settings" , baseUrl);
    console.log("submit form: ", settings);
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(settings),
            cache: "no-cache",
        });
        return await response.json();
    } catch (err:any) {
        console.error("settings service Error:", err);
        return {error: err.statusText};
    }
}

export async function getSettings(token:string):Promise<UserSettingsProps> {
    const url = new URL('/news/settings/', baseUrl);
    try {
        const res = await fetch(url, {
            headers: { Authorization: "Bearer " + token },
        });
        const data = await res.json();
        console.log("settings data", data);
        return {id:data.data.id, searchkey: data.data.searchkey, tags: data.data.tags, source:data.data.source};
    }catch (err:any) {
        console.error("settings service error:", err);
        return {id: null, searchkey: "", source: "", tags: ""};
    }

}