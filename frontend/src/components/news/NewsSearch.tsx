"use client"

import {useSession} from "next-auth/react";
import {NewsHeadings} from "@/components/news/NewsHeading";
import {columns, News} from "@/app/(news)/feeds/columns";
import {getNewsSources, searchNews} from "@/actions/news-data";
import React, {useEffect, useState} from "react";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {SubmitButton} from "@/components/ui/SubmitButton";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useToast} from "@/components/ui/use-toast";
import {sourceLabel} from "@/lib/utils";

export function NewsSearch(){
    const baseUrl=process.env.NEXT_PUBLIC_URL || 'http://localhost:4001';
    const { toast } = useToast()
    const {data: session} = useSession();
    const token = session?.user?.accessToken ? session?.user?.accessToken : '';
    const [news, setNews] = useState<News[]>([]);
    const [searchkey, setSearchkey] = useState<string>();
    const [source, setSource] = useState<string>();
    const [sources, setSources] = useState<string[]>([]);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        //console.log('formData', formData);
        try {
            if (!source) {
                //alert('Source not selected');
                toast({
                    variant: "destructive",
                    title: "Source not selected",
                });
                return;
            }
            if (!searchkey) {
                toast({
                    variant: "destructive",
                    title: "Search key shouldn't be empty",
                });
                return;
            }
            setSearchLoading(true);
            const res = await searchNews(token, searchkey, source);
            setNews(res);
            setSearchLoading(false);
        } catch (error) {
            console.error("Error during search news", error);
            setSearchLoading(false);
            toast({
                variant: "destructive",
                title: "Error during search news",
            })
        }
    };

    const fetchNews = async () => {
        const newsSources = await getNewsSources(token);
        setSources(newsSources);
    }
    useEffect(() => {
        fetchNews();
    }, [fetchNews]);
    return (
        <div className="container mx-auto py-0">
            <form onSubmit={handleSubmit} className='flex-row'>
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl font-bold">News Search</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 py-0">
                        <div className=" flex items-center space-x-4 p-0">
                            <Input
                                className="w-1/4 flex-row"
                                id="searchkey"
                                name="searchkey"
                                type="text"
                                placeholder="search key"
                                value={searchkey}
                                onChange={(e) => setSearchkey(e.target.value)}
                            />
                            <Select name='sources' value={source} onValueChange={(e) => setSource(e.valueOf())}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Source" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sources.map((source) => (
                                        <SelectItem value={source} key={source}>{sourceLabel(source)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex-1 space-y-1">
                                <SubmitButton
                                    className='inline-flex items-center justify-end'
                                    text="Search News"
                                    loadingText="Loading"
                                    loading={searchLoading}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">

                    </CardFooter>
                </Card>
            </form>

            <NewsHeadings columns={columns} data={news}/>
        </div>
    );
}