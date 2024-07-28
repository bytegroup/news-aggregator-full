"use client"

import {useSession} from "next-auth/react";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

export function HomePage() {
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user) {
            router.push("/feeds");
        }
    }, [router, session?.user]);

    return (
        <header className="relative h-[600px] overflow-hidden">
            <div
                className="relative z-10 flex flex-col items-center justify-center h-full text-center bg-black
                bg-opacity-20 pl-10 pr-10">
                <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
                    News Aggregator
                </h1>
                <p className="mt-4 text-lg md:text-xl lg:text-2xl">
                    Please login to get into dive
                </p>
            </div>
        </header>
    )
}