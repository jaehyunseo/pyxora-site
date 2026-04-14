// Pages Functions middleware — blocks internal files from web access.
// Runs before static asset serving, so 404s apply regardless of what is deployed.

const BLOCKED_PATHS = [
  /^\/\.(docs|tests|env|git|gitignore|cursor|vscode|claude|agents)(\/|$)/i,
  /^\/(test|audit|gen-og|mobile-shot[^/]*)\.mjs$/i,
  /^\/package(-lock)?\.json$/i,
  /^\/wrangler\.toml$/i,
  /^\/[^/]+\.md$/i,
];

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  for (const re of BLOCKED_PATHS) {
    if (re.test(path)) {
      return new Response('Not Found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
          'Cache-Control': 'no-store',
        },
      });
    }
  }

  return context.next();
}
