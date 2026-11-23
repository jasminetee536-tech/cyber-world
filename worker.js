import { onRequestGet } from './functions/api/feed.js';
import { onRequestGet as futureGet } from './functions/api/future.js';
import {shadowGet,buildDaily} from './functions/api/shadow.js';
import {cwriGet,historyGet,persistCWRI,reviewCWRI,reviewsGet} from './functions/api/cwri.js';
import {incidentQueueGet,incidentAssessmentPost,incidentAssessmentsGet} from './functions/api/incident-review.js';

export default {
  async scheduled(event, env, ctx) { ctx.waitUntil(Promise.allSettled([buildDaily(env),persistCWRI(env).then(()=>reviewCWRI(env))])); },
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/feed' && request.method === 'GET') {
      return onRequestGet();
    }
    if (url.pathname === '/api/future' && request.method === 'GET') return futureGet();
    if (url.pathname === '/api/incidents/queue' && request.method === 'GET') return incidentQueueGet(request,env);
    if (url.pathname === '/api/incidents/assessments' && request.method === 'GET') return incidentAssessmentsGet(request,env);
    if (url.pathname === '/api/incidents/assessments' && request.method === 'POST') return incidentAssessmentPost(request,env);
    if (url.pathname === '/api/cwri' && request.method === 'GET') return cwriGet();
    if (url.pathname === '/api/cwri/reviews' && request.method === 'GET') return reviewsGet(request,env);
    if (url.pathname === '/api/cwri/history' && request.method === 'GET') return historyGet(request,env);
    if (url.pathname === '/api/shadow' && request.method === 'GET') return shadowGet(request,env);
    return env.ASSETS.fetch(request);
  }
};
