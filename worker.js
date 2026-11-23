import { onRequestGet } from './functions/api/feed.js';
import { onRequestGet as futureGet } from './functions/api/future.js';
import {shadowGet,buildDaily} from './functions/api/shadow.js';

export default {
  async scheduled(event, env, ctx) { ctx.waitUntil(buildDaily(env)); },
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/feed' && request.method === 'GET') {
      return onRequestGet();
    }
    if (url.pathname === '/api/future' && request.method === 'GET') return futureGet();
    if (url.pathname === '/api/shadow' && request.method === 'GET') return shadowGet(request,env);
    return env.ASSETS.fetch(request);
  }
};
