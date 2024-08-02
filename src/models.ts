export type GetScrapingParams = {
    /**
     * The url to scrape - should include http:// or https://
     */
    url: string;

    /**
     * The method to use when requesting this url
     * Can be GET or POST
     */
    method: 'GET' | 'POST';

    /**
     * The the payload to include in a post request.
     * Only used when method = 'POST'
     */
    body?: string;

    /**
     * When defined, your GetScraping deployment will route the request through a browser
     * with the ability to render javascript and do certain actions on the webpage. 
     */
    js_rendering_options?: JavascriptRenderingOptions;

    /**
     * Define any cookies you need included in your request.
     * ex: `cookies: ['SID=1234', 'SUBID=abcd', 'otherCookie=5678']`
     */
    cookies?: Array<string>;

    /**
     * The headers to attach to the scrape request. We fill in missing/common headers
     * by default — if you want only the headers defined below to be part of the request
     * set 'omit_default_headers' to true.
     */
    headers?: Record<string, string>;

    /**
     * omit_default_headers will pass only the headers you define in the scrape request
     * Defaults to false.
     */
    omit_default_headers?: boolean;

    /**
     * If you've configured your GetScraping deployment to use an external proxy 
     * (either through us or another provider) setting this to true will
     * use that proxy pool rather than the default proxies in the GetScraping deployment.
     */
    use_external_proxy?: boolean;

    /**
     * Configuration for when and how to retry a request
     */
    retry_config?: RetryConfig;

    /**
     * How long to wait for the request to complete in milliseconds before returning a timeout error. 
     */
    timeout_millis?: number;
}

export type JavascriptRenderingOptions = {
    /**
    * Whether to capture a screenshot
    * The URL of the screenshot in s3 will be returned in the SCREENSHOT_LOCATION header in addition to the HTML.
    * Only valid when render_js is true.
    */
    screenshot?: boolean;

    /**
     * The time in milliseconds to wait before returning the result.
     * Only valid when render_js is true.
     */
    wait_millis?: number;

    /**
     * The URL (or regex matching the URL) that needs to be requested on page load before returning
     * the response
     * Only valid when render_js is true.
     */
    wait_for_request?: string;

    /**
     * CSS or XPATH selector that needs to be present before returning the response
     * Only valid when render_js is true.
     */
    wait_for_selector?: string;

    /**
     * intercept_request will cause the api to return the response from the specified request regex.
     * ie if you see that when https://example.com is loading it makes a request to https://example.com/api/some_endpoint/...
     * And for some reason you're not able to make that request directly, you can define:
     * intercept_request: {
     *  url_regex: '\/api\/some_endpoint',
     *  return_json: true,
     * }
     * to directly return the json response from that endpoint.
     * 
     * Only valid when render_js is true.
     */
    intercept_request?: InterceptRequestParams;
}

/**
 * InterceptRequestParams define how the api will return the response from a specified request.
 * ie if you see that when https://example.com is loading it makes a request to https://example.com/api/some_endpoint/...
 * And for some reason you're not able to make that request directly, you can define:
 * intercept_request: {
 *  url_regex: '\/api\/some_endpoint',
 *  return_json: true,
 * }
 * to directly return the json response from that endpoint.
 * 
 * Only valid when render_js is true.
 */
export type InterceptRequestParams = {
    /**
     * The regex matching the url to be intercepted - be as specific as possible, if the regex matches
     * multiple requests, the first will be returned unless request number is also defined.
     */
    url_regex: string;

    /**
     * If the url regex will match multiple requests when loading a page, define the request number
     * to return the correct response. 
     * defaults to 1, returning the first request.
     */
    request_number?: number;

    /**
     * True if the response should be parsed and returned as JSON
     */
    return_json?: boolean;
}

export type RetryConfig = {
    /**
     * How many times to retry unsuccessful requests.
     * Default is 0 (only attempt the request once with no retries)
     */
    num_retries: number;

    /**
     * The status codes that will render the request successful
     * default: [200,203]
     */
    success_status_codes?: Array<number>;

    /**
     * A css selector that needs to be present for a request to be considered successful
     * If both success_status_codes and success_selector are defined - both will need to pass for the request
     * to succeed.
     */
    success_selector?: string;
}

