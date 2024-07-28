import {News} from "@/app/(news)/feeds/columns";

const baseUrl=process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4001';

export async function getNewsFeed(token: string):Promise<News[]> {
    const url = new URL('/news/feeds/', baseUrl);
    try {
        const res = await fetch(url, {
            headers: { Authorization: "Bearer " + token },
        });
        const data = await res.json();
        if (data.code) {
            if (data.code === 200 || data.code === 201) {
                return await mapping(data);
            } else {
                console.error('news feed get err: ',data)
                return [];
            }
        }
        //console.log("news data", data);
        return await mapping(data);
    }catch (err:any) {
        console.error("news feed service error:", err);
        return [];
    }
}

export async function getNewsSources(token: string):Promise<string[]> {
    const url = new URL('/news/sources', baseUrl);
    try {
        const res = await fetch(url, {
            headers: { Authorization: "Bearer " + token },
        });
        const data = await res.json();
        if (data.code) {
            if (data.code === 200 || data.code === 201) {
                return data;
            } else {
                console.error('news sources get err: ',data)
                return [];
            }
        }
        //console.log("news data", data);
        return data;
    }catch (err:any) {
        console.error("news source service error:", err);
        return [];
    }
}

export async function searchNews(token: string, searchKey: string, source: string):Promise<News[]> {
    const url = new URL(`/news/search?searchKey=${searchKey}&source=${source}`, baseUrl);
    try {
        const res = await fetch(url, {
            headers: { Authorization: "Bearer " + token },
        });
        const data = await res.json();
        if (data.code) {
            if (data.code === 200 || data.code === 201) {
                return await mapping(data);
            } else {
                console.error('news search err: ',data)
                return [];
            }
        }
        //console.log("news data", data);
        return await mapping(data);
    }catch (err:any) {
        console.error("news search service error:", err);
        return [];
    }
}

async function mapping(data: any[]) : Promise<News[]>{
    const newsFeed: News[] = [];
    let index = 0;
    data.forEach((item) => {
        newsFeed.push({
            id: ++index+'',
            source: item.source,
            heading: item.title,
            publishedAt: item.publishedAt,
            author: item.tags,
            url: item.webUrl,
        });
    });
    return newsFeed;
}