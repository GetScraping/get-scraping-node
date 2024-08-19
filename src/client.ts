import fetch, { Response, RequestInit } from 'node-fetch';
import * as cheerio from 'cheerio';
import { GetScrapingParams, RetryConfig } from './models';

const RETRY_DELAY_MS = 200;

/**
 * Use the GetScrapingClient to make requests to GetScraping.com's API.
 * Usage:
 * const client = new GetScrapingClient('YOUR_API_KEY');
 * const result = await client.scrape({
 *  url: 'https://example.com',
 *  wait_for_request: '.*api\.example\.com.*data'
 * });
 * // Load the html with cheerio
 * const $ = cheerio.load(await result.text());
 * // Fetch the headers returned from the scraped url
 * const headers = result.headers;
 * // Grab the returned cookies and use them in subsequent requests
 * const cookies = r.headers["set-cookie"];
 * const resultWithCookies = await client.scrape({
 *  url: 'https://example.com/some_path',
 *  cookies: cookies,
 * })
 */
export class GetScrapingClient {
    private api_url: string = 'https://api.getscraping.io';
    private api_key: string;

    /**
     * 
     * @param api_key The api_key for your GetScraping subscription. You can find this at https://getscraping.com/dashboard
     */
    constructor(api_key: string) {
        this.api_key = api_key;
    }

    private async request(url: string, params: GetScrapingParams): Promise<Response> {
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                'X-API-Key': this.api_key,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
            compress: false,
        }
        if (params?.retry_config != null) {
            return fetchRetry(url, params?.retry_config, requestOptions)
        }
        return fetch(url, requestOptions)

    }

    /**
     * @param params GetScrapingParams
     * @returns Promise<Response>
     */
    public scrape(params: GetScrapingParams) {
        if (params.js_rendering_options?.render_js) {
            return this.request(`${this.api_url}/scrape_with_js`, params);
        }
        return this.request(`${this.api_url}/scrape`, params);
    }
}

async function fetchRetry(url: string, retry_config?: RetryConfig, init?: RequestInit | undefined): Promise<Response> {
    let retriesRemaining = Math.max(retry_config?.num_retries ?? 1, 1);
    while (retriesRemaining > 0) {
        try {
            const res = await fetch(url, init);
            if (retry_config.success_status_codes) {
                if (!retry_config.success_status_codes.includes(res.status)) {
                    await sleep(RETRY_DELAY_MS)
                    if (retriesRemaining <= 1) {
                        return res;
                    };
                    continue;
                }
            } else {
                if (res.status < 200 || res.status > 399) {
                    await sleep(RETRY_DELAY_MS)
                    if (retriesRemaining <= 1) {
                        return res;
                    };
                    continue;
                }
            }
            if (retry_config.success_selector && retry_config.success_selector != '') {
                const $ = cheerio.load(await res.text());
                const maybeSuccess = $().find(retry_config.success_selector);
                if (maybeSuccess.length === 0) {
                    await sleep(RETRY_DELAY_MS)
                    if (retriesRemaining <= 1) {
                        return res;
                    };
                    continue;
                }
            }
            return res;
        }
        catch (err) {
            await sleep(RETRY_DELAY_MS)
            if (retriesRemaining <= 1) {
                throw err;
            }
        }
        finally {
            retriesRemaining -= 1;
        }
    }
    throw new Error(`GET_SCRAPING: UNABLE TO FETCH URL`)
}

function sleep(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}