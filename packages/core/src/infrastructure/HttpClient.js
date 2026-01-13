import axios from 'axios';

/**
 * HttpClient
 * Abstraction for HTTP requests that can be overridden for platform-specific needs
 * (e.g., CORS proxying in browsers)
 */
export class HttpClient {
  /**
   * Perform a GET request
   * @param {string} url - URL to fetch
   * @param {Object} options - Request options
   * @returns {Promise<any>} - Response data
   */
  async get(url, options = {}) {
    const response = await axios.get(url, options);
    return response.data;
  }
}

/**
 * CorsProxyHttpClient
 * HTTP client that routes requests through a CORS proxy for browser compatibility
 */
export class CorsProxyHttpClient extends HttpClient {
  constructor(corsProxy = 'https://corsproxy.io/?') {
    super();
    this.corsProxy = corsProxy;
  }

  async get(url, options = {}) {
    // Try direct request first
    try {
      return await super.get(url, options);
    } catch (error) {
      // If it fails with network/CORS error, try with proxy
      if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
        const proxiedUrl = `${this.corsProxy}${encodeURIComponent(url)}`;
        return await super.get(proxiedUrl, options);
      }
      throw error;
    }
  }
}
