import { onRequestGet } from './functions/api/feed.js';
import { onRequestGet as futureGet } from './functions/api/future.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/feed' && request.method === 'GET') {
      return onRequestGet();
    }
    if (url.pathname === '/api/future' && request.method === 'GET') return futureGet();
    return env.ASSETS.fetch(request);
  }
};
