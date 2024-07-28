import {SessionProvider} from "next-auth/react";
import {auth} from "@/auth";
import {Settings} from "@/components/news/settings";

export default async function SettingPage(){
    const session = await auth();

    return (
        <SessionProvider session={session}>
            <Settings/>
        </SessionProvider>
    );
}