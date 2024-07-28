import {columns, News} from "@/app/(news)/feeds/columns";
import {NewsHeadings} from "@/components/news/NewsHeading";
import {SessionProvider} from "next-auth/react";
import {auth} from "@/auth";
import {getNewsFeed} from "@/actions/news-data";

async function getData(token: string): Promise<News[]> {
    return await getNewsFeed(token);
}

export default async function FeedsPage(){
    const session = await auth();
    const token = session?.user?.accessToken ? session?.user?.accessToken : '';
    /*console.log("session", session);*/
    return (
        <div className="container mx-auto py-10">
            <SessionProvider session={session}>
                <NewsHeadings columns={columns} data={await getData(token)}/>
            </SessionProvider>
        </div>
    );
}