import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import test from 'node:test';

import { createDuffelApiDevMiddleware } from '../src/dev/duffelApiDevMiddleware.js';

test('Duffel API dev middleware forwards POST requests to the serverless handler', async () => {
  const handlerCalls = [];
  const middleware = createDuffelApiDevMiddleware({
    handler: async (request) => {
      handlerCalls.push(request);

      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ok: true,
        }),
      };
    },
  });
  const request = createRequest({
    method: 'POST',
    url: '/api/duffel-flights',
    body: JSON.stringify({
      provider: 'duffel',
    }),
  });
  const response = createResponse();

  await middleware(request, response, () => {
    throw new Error('next should not be called for Duffel API requests');
  });

  assert.deepEqual(handlerCalls, [
    {
      method: 'POST',
      body: JSON.stringify({
        provider: 'duffel',
      }),
    },
  ]);
  assert.equal(response.statusCode, 200);
  assert.equal(response.headers['Content-Type'], 'application/json');
  assert.equal(response.body, JSON.stringify({ ok: true }));
});

test('Duffel API dev middleware ignores unrelated paths', async () => {
  const middleware = createDuffelApiDevMiddleware({
    handler: async () => {
      throw new Error('handler should not be called');
    },
  });
  const request = createRequest({
    method: 'GET',
    url: '/',
    body: '',
  });
  const response = createResponse();
  let nextCalled = false;

  await middleware(request, response, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
});

function createRequest({ method, url, body }) {
  const request = new EventEmitter();
  request.method = method;
  request.url = url;

  queueMicrotask(() => {
    request.emit('data', Buffer.from(body));
    request.emit('end');
  });

  return request;
}

function createResponse() {
  return {
    body: '',
    headers: {},
    statusCode: 200,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(body) {
      this.body = body;
    },
  };
}
