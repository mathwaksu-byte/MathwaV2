import type { EntryContext } from "@remix-run/cloudflare";
import { RemixServer } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToReadableStream } from "react-dom/server";

export default async function handleRequest(
  request: Request,
  status: number,
  headers: Headers,
  context: EntryContext
) {
  const ua = request.headers.get("user-agent");
  let isBot = false;
  if (ua) {
    if ((isbotModule as any).isbot) isBot = (isbotModule as any).isbot(ua);
    else if ((isbotModule as any).default) isBot = (isbotModule as any).default(ua);
  }

  const body = await renderToReadableStream(<RemixServer context={context} url={request.url} />, {
    onError() {
      status = 500;
    }
  });

  if (isBot && (body as any).allReady) {
    await (body as any).allReady;
  }

  headers.set("Content-Type", "text/html");
  return new Response(body, { headers, status });
}
