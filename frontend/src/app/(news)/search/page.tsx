import {auth} from "@/auth";
import {SessionProvider} from "next-auth/react";
import {NewsSearch} from "@/components/news/NewsSearch";

export default async function SearchPage(){
    const session = await auth();
    /*console.log("session", session);*/
    return (
        <div className="container mx-auto py-5">
            <SessionProvider session={session}>
                <NewsSearch />
            </SessionProvider>
        </div>
    );
}