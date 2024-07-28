import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu, NavigationMenuContent,
    NavigationMenuItem, NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import {auth, signOut} from "@/auth";

interface HeaderProps {
    data: {
        logoText: string,
        ctaButton: {url:string, text:string},
        footerText: string,
    }
}

export async function Header() {
    const session = await auth();
    const isAuthenticated = !!session?.user;
    //const isAuthenticated = false;
    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md dark:bg-gray-800">
            <Link href='/'><span>NewsAggregator</span></Link>

            <div className='flex items-start space-x-4'>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger><Link href='/settings'>Settings</Link></NavigationMenuTrigger>
                            <NavigationMenuTrigger><Link href='/feeds'>News Feeds</Link></NavigationMenuTrigger>
                            <NavigationMenuTrigger><Link href='/search'>Search</Link></NavigationMenuTrigger>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            <div className="flex items-center gap-4">
                {
                    isAuthenticated ?
                        <form action={
                            async () => {
                                'use server';
                                await signOut();
                            }}
                        >
                            <span className="pr-10"><b>User:</b> {session?.user?.name}</span>
                            <Button type='submit'>Logout</Button>
                        </form>
                        :
                        <Link href='/login'><Button>Login</Button></Link>
                }
                {
                    !isAuthenticated ?
                            <Link href='/register'><Button>Register</Button></Link>
                        :
                        <div className=""></div>
                }
            </div>
        </div>
    );
}