"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRates = getRates;
async function getRates(symbol) {
    const res = await fetch(`${process.env.MARKET_URL}?symbol=in.(${symbol})`, {
        headers: {
            apikey: process.env.MARKET_KEY,
            Authorization: `Bearer ${process.env.MARKET_KEY}`,
        },
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch market data: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
}
