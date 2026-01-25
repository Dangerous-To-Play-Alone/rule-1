# CORS Solution

## Problem

When the web app runs in a browser, it cannot directly access the Moxfield and Archidekt APIs due to CORS (Cross-Origin Resource Sharing) restrictions. Browsers block requests to external APIs that don't explicitly allow cross-origin requests.

## Solution: Dependency Injection

Instead of creating separate use cases or adapters for different platforms, we use **dependency injection** to inject platform-specific HTTP clients:

```
┌─────────────────────────────────────┐
│   FetchDeckBracketUseCase           │
│   (Business Logic - Platform Agnostic)│
└──────────────┬──────────────────────┘
               │ depends on
               ▼
┌─────────────────────────────────────┐
│        HttpClient Interface         │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌────────────┐   ┌──────────────────┐
│ HttpClient │   │CorsProxyHttpClient│
│ (Direct)   │   │ (Proxy Fallback) │
└────────────┘   └──────────────────┘
     │                    │
     │                    │
     ▼                    ▼
Discord Bot          Web Browser
```

## Implementation

### 1. HttpClient Abstraction

Created a base `HttpClient` class that wraps axios:

```javascript
export class HttpClient {
  async get(url, options = {}) {
    const response = await axios.get(url, options);
    return response.data;
  }
}
```

### 2. CorsProxyHttpClient

Extended `HttpClient` to handle CORS issues in browsers:

```javascript
export class CorsProxyHttpClient extends HttpClient {
  constructor(corsProxy = 'https://corsproxy.io/?') {
    super();
    this.corsProxy = corsProxy;
  }

  async get(url, options = {}) {
    try {
      // Try direct request first
      return await super.get(url, options);
    } catch (error) {
      // If CORS error, use proxy
      if (error.message.includes('Network Error')) {
        const proxiedUrl = `${this.corsProxy}${encodeURIComponent(url)}`;
        return await super.get(proxiedUrl, options);
      }
      throw error;
    }
  }
}
```

### 3. Adapter Updates

Updated adapters to accept injected HTTP client:

```javascript
export class MoxfieldRepository {
  constructor(httpClient = null) {
    this.httpClient = httpClient || new HttpClient();
  }
  
  async fetchDeck(url) {
    const data = await this.httpClient.get(apiUrl);
    return this.mapToDomain(data);
  }
}
```

### 4. Use Case Updates

Updated use case to accept HTTP client dependency:

```javascript
export class FetchDeckBracketUseCase {
  constructor(httpClient = null) {
    const client = httpClient || new HttpClient();
    this.moxfieldAdapter = new MoxfieldRepository(client);
    this.archidektAdapter = new ArchidektRepository(client);
    this.bracketAnalyzer = new BracketAnalyzer();
  }
}
```

## Usage

### Discord Bot (Node.js)

No changes needed - uses default `HttpClient`:

```javascript
const deckService = require('./services/deckService');

// Uses default HttpClient (no CORS issues in Node.js)
const result = await deckService.fetchAndAnalyzeDeck(url);
```

### Web App (Browser)

Inject `CorsProxyHttpClient`:

```javascript
import { FetchDeckBracketUseCase, CorsProxyHttpClient } from '@rulezero/core';

const httpClient = new CorsProxyHttpClient();
const useCase = new FetchDeckBracketUseCase(httpClient);
```

## Benefits

1. **Single Source of Truth**: Business logic remains unified
2. **Platform-Specific Handling**: Each platform gets appropriate HTTP handling
3. **Testability**: Easy to inject mock HTTP clients for testing
4. **Flexibility**: Can swap in different CORS proxies or strategies
5. **Clean Architecture**: Dependencies point inward (infrastructure depends on use case interface)

## CORS Proxy

By default, uses `https://corsproxy.io/?` which is a free, public CORS proxy service.

### Custom Proxy

You can specify a custom proxy:

```javascript
const httpClient = new CorsProxyHttpClient('https://your-proxy.com/?url=');
const useCase = new FetchDeckBracketUseCase(httpClient);
```

### Self-Hosted Proxy

For production, consider running your own CORS proxy:
- [CORS Anywhere](https://github.com/Rob--W/cors-anywhere)
- [cors-proxy](https://www.npmjs.com/package/cors-proxy)
- Or use a serverless function (Vercel, Netlify, etc.)

## How It Works

1. Web app creates `CorsProxyHttpClient` instance
2. Injects it into `FetchDeckBracketUseCase`
3. Use case passes it to adapters (MoxfieldRepository, ArchidektRepository)
4. Adapters use the client to make HTTP requests
5. If direct request fails with CORS error, proxy is used automatically

## Graceful Degradation

The `CorsProxyHttpClient` tries direct requests first:
- If successful → uses direct connection (faster)
- If CORS error → falls back to proxy (slower but works)

This ensures best performance when possible while maintaining compatibility.

## Future Enhancements

1. **Caching**: Cache deck data to reduce API calls
2. **Retry Logic**: Automatic retries with exponential backoff
3. **Rate Limiting**: Respect API rate limits
4. **Multiple Proxies**: Fallback to multiple proxy services
5. **Server-Side Option**: Add optional backend API for web app
