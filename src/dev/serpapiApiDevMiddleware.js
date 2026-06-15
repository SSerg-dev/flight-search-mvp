export function createSerpApiDevMiddleware({ handler }) {
  return async function serpApiDevMiddleware(request, response, next) {
    if (request.url !== '/api/serpapi-flights') {
      next();
      return;
    }

    const body = await readRequestBody(request);
    const result = await handler({
      method: request.method,
      body,
    });

    response.statusCode = result.status;

    Object.entries(result.headers ?? {}).forEach(([name, value]) => {
      response.setHeader(name, value);
    });

    response.end(result.body);
  };
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    request.on('data', (chunk) => {
      chunks.push(chunk);
    });
    request.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
    request.on('error', reject);
  });
}
