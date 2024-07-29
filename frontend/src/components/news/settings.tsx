"use client"

import {useFormState} from "react-dom";
import {settingsAction} from "@/actions/settings";
import React, {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {ZodErrors} from "@/components/common/ValidationErr";
import {SubmitButton} from "@/components/ui/SubmitButton";
import {ApiErr} from "@/components/common/ApiErr";
import {useSession} from "next-auth/react";
import {getSettings} from "@/actions/settigns-data";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {getNewsSources} from "@/actions/news-data";
import {sourceLabel} from "@/lib/utils";

const INIT_STATE = {
    data: null,
    zodErrors: null,
    message: null,
};

export function Settings() {
    const {data: session} = useSession();
    const [formState, formAction] = useFormState(
        settingsAction,
        INIT_STATE
    );
    const [id, setId] = useState<string>();
    const [source, setSource] = useState<string>();
    const [sources, setSources] = useState<string[]>([]);
    const [searchkey, setSearchkey] = useState<string>();
    const [tags, setTags] = useState<string>();
    const token = session?.user?.accessToken ? session?.user?.accessToken : '';
    //console.log('setting page: token: ', token);

    const fetchSettings = async () => {
        const data = await getSettings(token);
        console.log("data", data);
        setId(data?.id ? data.id : '0');
        setSource(data?.source ? data.source : "");
        setSearchkey(data?.searchkey ? data.searchkey : "");
        setTags(data?.tags ? data.tags : "");
    }
    const fetchNewsSources = async () => {
        const newsSources = await getNewsSources(token);
        setSources(newsSources);
    }
    useEffect(() => {
        fetchNewsSources();
        fetchSettings();
    }, []);

    return (
        <div className="w-full max-w-md">
            <form action={formAction} className="pt-4 pb-6 min-w-96">
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl font-bold">Settings</CardTitle>
                        <CardDescription>
                            Set your news preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <input type='hidden'
                                   id='id'
                                   name='id'
                                   value={id}
                            />
                            <Label htmlFor="source">Source</Label>
                            <Select name='source' defaultValue='ALL' value={source} onValueChange={(e) => setSource(e.valueOf())}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Source" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='ALL' key='ALL'>ALL SOURCES</SelectItem>
                                    {sources.map((source) => (
                                        <SelectItem value={source} key={source}>{sourceLabel(source)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <ZodErrors error={formState?.zodErrors?.source}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="searchkey">Search Key</Label>
                            <Input
                                id="searchkey"
                                name="searchkey"
                                type="text"
                                placeholder="search key"
                                value={searchkey}
                                onChange={(e) => setSearchkey(e.target.value)}
                            />
                            <ZodErrors error={formState?.zodErrors?.searchkey}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                name="tags"
                                type="text"
                                placeholder="tags"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                            <ZodErrors error={formState?.zodErrors?.tags}/>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <SubmitButton
                            className="w-full"
                            text="Save"
                            loadingText="Loading"
                        />
                        <ApiErr error={{message: formState?.message, status: formState?.status}}/>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}