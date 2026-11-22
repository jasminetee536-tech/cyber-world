import { onRequestGet } from './functions/api/feed.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/feed' && request.method === 'GET') {
      return onRequestGet();
    }
    return env.ASSETS.fetch(request);
  }
};
