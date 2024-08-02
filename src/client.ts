import fetch, { Response, RequestInit, RequestInfo } from 'node-fetch';
import { GetScrapingParams, RetryConfig } from './models';

const RETRY_DELAY_MS = 200;

/**
 * Use the GetScrapingClient to make requests to your GetScraping Deployment.
 * Usage:
 * const client = new GetScrapingClient('YOUR_API_URL', 'YOUR_API_KEY');
 * const result = await client.scrape({
 *  url: 'https://example.com',
 *  render_js: true,
 *  wait_for_request: '.*api\.example\.com.*data'
 * });
 * // Load the html with cheerio
 * const $ = cheerio.load(result.body);
 * // Fetch the headers returned from the scraped url
 * const headers = result.headers;
 * // Grab the returned cookies and use them in subsequent requests
 * const cookies = r.headers["set-cookie"];
 * const resultWithCookies = await client.scrape({
 *  url: 'https://example.com/some_path',
 *  render_js: true,
 *  cookies: cookies,
 * })
 */
export class GetScrapingClient {
    /**
     * The api_url for your GetScraping Deployment
     * You can find this at https://getscraping.com/dashboard
     */
    readonly api_url: string;
    /**
     * The api_key for your GetScraping Deployment
     * You can find this at https://getscraping.com/dashboard
     */
    readonly api_key: string;

    /**
     * 
     * @param api_url The api_url for your GetScraping Deployment. You can find this at https://getscraping.com/dashboard
     * @param api_key The api_key for your GetScraping Deployment. You can find this at https://getscraping.com/dashboard
     */
    constructor(api_url: string, api_key: string) {
        this.api_url = api_url;
        this.api_key = api_key;
    }

    private async request(url: string, params: GetScrapingParams): Promise<Response> {
        if (params?.retry_config != null) {
            return fetchRetry(url, params?.retry_config, {
                method: 'POST',
                headers: {
                    'X-API-Key': this.api_key,
                },
                body: JSON.stringify(params),
            })
        }
        return fetch(url, {
            method: 'POST',
            headers: {
                'X-API-Key': this.api_key,
            },
            body: JSON.stringify(params),
        })

    }

    /**
     * scrape will make a request through your GetScraping deployed API.
     * @param params GetScrapingParams
     * @returns 
     */
    public scrape(params: GetScrapingParams) {
        if (params.js_rendering_options != null) {
            return this.request(`${this.api_url}/scrape_with_js`, params);
        }
        return this.request(`${this.api_url}/scrape`, params);
    }
}

async function fetchRetry(input: RequestInfo | URL, retry_config?: RetryConfig, init?: RequestInit | undefined) {
    let retriesRemaining = Math.max(retry_config.num_retries, 1);
    while (retriesRemaining > 0) {
        try {
            const res = await fetch(input, init);
            if (retry_config.success_status_codes) {
                if (retry_config.success_status_codes.includes[res.status]) {
                    return res;
                } else {
                    await sleep(RETRY_DELAY_MS)
                    if (retriesRemaining <= 1) {
                        return res;
                    };
                }
            }
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
}

function sleep(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}