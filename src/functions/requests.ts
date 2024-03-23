import { Status } from "../models";
import { delay } from "./common";

let cooldownTimer: Promise<unknown> | null = null;
let cooldownCount: number = 0;

export const fetchRequest = async (url: string, type: "search" | "request" = "request") : Promise<Response> => {
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

    const resetTime = new Date(Date.now());
    resetTime.setSeconds(resetTime.getSeconds() + Number(response.headers.get(`x-ratelimit-requests-reset`)!));

    const data = {
        requestsRemaining: response.headers.get(`x-ratelimit-requests-remaining`),
        requestsResetTime: resetTime,
        searchesRemaining: response.headers.get(`x-ratelimit-searches-remaining`),
        searchesResetTime: resetTime,
    }
    
    await Status.findOne({}).then(
        async (status) => {
            if (status) {
                await status.update(data);
            } else {
                await Status.create(data);
            }
            console.log("remaining requests: " + response.headers.get("x-ratelimit-requests-remaining"));
        }
    )
    
    return response;
}