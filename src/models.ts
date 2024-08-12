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
     * The payload to include in a post request.
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
     * Set to true to route requests through our ISP proxies.
     * Note this may incur additional API credit usage.
     */
    use_isp_proxy?: boolean;

    /**
     * Set to true to route requests through our residential proxies.
     * Note this may incur additional API credit usage.
     */
    use_residential_proxy?: boolean;

    /**
     * Set to true to route requests through our mobile proxies.
     * Note this may incur additional API credit usage.
     */
    use_mobile_proxy?: boolean;

    /**
     * If you'd like to use your own proxy server for this request, include the url here.
     * If necessary include any authentication inforamtion in the format:
     * `http://${user}:${password}@${proxyUrl}:${proxyPort}`
     */
    use_own_proxy?: string;

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
     * Whether to render javascript or not
     * Default false
     */
    render_js: boolean;

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
     *  intercepted_url_regex: '\/api\/some_endpoint',
     *  return_json: true,
     * }
     * to directly return the json response from that endpoint.
     * 
     * Only valid when render_js is true.
     */
    intercept_request?: InterceptRequestParams;

    /**
     * Configuration for the programmable browser
     * With this defined you can define a set of actions to be performed depending on the javascript that is 
     * loaded on the page. See https://docs.getscraping.com for more details.
     */
    programmable_browser?: ProgrammableBrowserOptions;
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
    intercepted_url_regex: string;

    /**
     * The method of the request to intercept. 
     * Default to 'GET'
     */
    intercepted_url_method?: 'GET' | 'POST' | 'PUT';

    /**
     * If the url regex will match multiple requests when loading a page, define the request number
     * to return the correct response. 
     * defaults to 1, returning the first request.
     */
    request_number?: number;

    /**
     * True if the response should be parsed and returned as JSON.
     * Defaults to false.
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
     * default: [200-302]
     */
    success_status_codes?: Array<number>;

    /**
     * A css selector that needs to be present for a request to be considered successful
     * If both success_status_codes and success_selector are defined - both will need to pass for the request
     * to succeed.
     */
    success_selector?: string;
}

/**
 * ProgrammableBrowserOptions define a set of actions to be performed on a page.
 * They are defined in the order they should be performed. The actions are performed once any of the
 * wait conditions are met (wait_for_selector, wait_millis, wait_for_request from the JavascriptRenderingOptions).
 * The actions are only performed if the selector matches, otherwise the next action with a matching selector will be executed.
 */
export type ProgrammableBrowserOptions = {
    /**
     * The actions to perform on the page
     */
    actions: Array<ProgrammableBrowserAction>;
}

export type ProgrammableBrowserAction = {
    /**
     * The type of action to perform
     */
    type: 'click' | 'hover' | 'wait_for_selector' | 'wait_millis' | 'scroll' | 'execute_js';

    /**
     * The selector that triggers the action, and the target of the action if the type is click, hover, or scroll
     */
    selector?: string;

    /**
     * The javascript to execute.
     * example:
     * `javascript: "console.log('YEET')`
     */
    javascript?: string;

    /**
     * The amount of time to wait for the action to complete
     */
    wait_millis?: number;
}