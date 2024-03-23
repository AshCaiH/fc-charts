import { delay } from "./common";

let cooldownTimer: Promise<unknown> | null = null;
let cooldownCount: number = 0;

export const fetchRequest = async (url: string) : Promise<Response> => {
    const headers : HeadersInit = {
        'X-RapidAPI-Key': process.env.OC_APIKEY!,
        'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com'
    }

    const options : RequestInit = {
        method: 'GET',
        headers: headers,
    };    

    if (cooldownCount == 4) await cooldownTimer;
    const response = await fetch(url, options);
    cooldownTimer = delay(1000);
    cooldownCount++;

    console.log("remaining requests: " + response.headers.get("x-ratelimit-requests-remaining"));
    
    return response;
}