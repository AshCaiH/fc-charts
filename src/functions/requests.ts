import { Status } from "../models";
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

    const resetTime = new Date(Date.now());
    resetTime.setSeconds(resetTime.getSeconds() + Number(response.headers.get(`x-ratelimit-requests-reset`)!));
    
    const [status, exists] = await Status.findOrCreate({where: {}});

    if (response.headers.get(`x-ratelimit-requests-remaining`)) {
        status!.requestsRemaining = Number(response.headers.get(`x-ratelimit-requests-remaining`))}
    if (response.headers.get(`x-ratelimit-requests-reset`)) {
        status!.requestsResetTime = resetTime;
        status!.searchesResetTime = resetTime;}
    if (response.headers.get(`x-ratelimit-searches-remaining`)) {
        status!.searchesRemaining = Number(response.headers.get(`x-ratelimit-searches-remaining`))}

    await status!.save();
    
    return response;
}