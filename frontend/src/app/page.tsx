import {HomePage} from "@/components/home/HomePage";
import {auth} from "@/auth";
import {SessionProvider} from "next-auth/react";

export default async function Home() {
    const session = await auth();
  return (
      <SessionProvider session={session}>
          <main className="container mx-auto p-20">
              {/*<Button>Our Cool Button</Button>*/}
              {/*<h1 className="text-5xl font-bold">Today`s News</h1>
              <p className="text-xl mt-4">{status}</p>
              <p className="text-xl mt-4">{totalResults}</p>*/}
              <div className="flex flex-wrap items-center justify-center pl-3 pr-3">
                  <HomePage></HomePage>
              </div>
          </main>
      </SessionProvider>
  );
}
