# GetScraping Node.js Client

This is the official Node.js client library for [GetScraping.com](https://getscraping.com), a powerful web scraping API service.

## Installation

You can install the GetScraping client library using npm, yarn, or pnpm:

```bash
# Using npm
npm install get-scraping

# Using yarn
yarn add get-scraping

# Using pnpm
pnpm add get-scraping
```

## Usage

To use the GetScraping client, you'll need an API key from [GetScraping.com](https://getscraping.com). Once you have your API key, you can start using the client as follows:

```javascript
import { GetScrapingClient } from 'get-scraping';

const client = new GetScrapingClient('YOUR_API_KEY');

async function scrapeWebsite() {
  const result = await client.scrape({
    url: 'https://example.com',
    method: 'GET'
  });

  const html = await result.text();
  console.log(html);
}

scrapeWebsite();
```

## Features

The GetScraping client supports a wide range of features, including:

- Basic web scraping
- JavaScript rendering
- Custom headers and cookies
- Proxy support (ISP, residential, and mobile)
- Retrying requests
- Programmable browser actions

## API Reference

### `GetScrapingClient`

The main class for interacting with the GetScraping API.

```typescript
const client = new GetScrapingClient(api_key: string);
```

### `scrape(params: GetScrapingParams)`

The primary method for scraping websites.

```typescript
const result = await client.scrape(params);
```

#### `GetScrapingParams`

The `GetScrapingParams` object supports the following options:

```typescript
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
    use_isp_proxy?: boolean
}
```

For more detailed information on these parameters, please refer to the [GetScraping documentation](https://docs.getscraping.com).

## Examples

### Basic Scraping

```javascript
const result = await client.scrape({
  url: 'https://example.com',
  method: 'GET'
});

const html = await result.text();
console.log(html);
```

### Scraping with JavaScript Rendering

```javascript
const result = await client.scrape({
  url: 'https://example.com',
  method: 'GET',
  js_rendering_options: {
    render_js: true,
    wait_millis: 5000
  }
});

const html = await result.text();
console.log(html);
```

### Using Proxies

```javascript
const result = await client.scrape({
  url: 'https://example.com',
  method: 'GET',
  use_residential_proxy: true
});

const html = await result.text();
console.log(html);
```

### Retrying Requests

```javascript
const result = await client.scrape({
  url: 'https://example.com',
  method: 'GET',
  retry_config: {
    num_retries: 3,
    success_status_codes: [200]
  }
});

const html = await result.text();
console.log(html);
```

## Advanced Usage

For more advanced usage, including programmable browser actions and intercepting requests, please refer to the [GetScraping documentation](https://docs.getscraping.com).

## Support

If you encounter any issues or have questions, please visit our [support page](https://getscraping.com/support) or open an issue in the [GitHub repository](https://github.com/GetScraping/get-scraping-node/issues).

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.