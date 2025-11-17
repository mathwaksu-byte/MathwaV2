import type { EntryContext } from "@remix-run/cloudflare";
import { RemixServer } from "@remix-run/react";
import * as isbotModule from "isbot";

// Import from the browser build which includes renderToReadableStream
import { renderToReadableStream } from "react-dom/server";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  try {
    const body = await renderToReadableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onError(error: unknown) {
          console.error(error);
          responseStatusCode = 500;
        },
      }
    );

    if (isBotRequest(request.headers.get("user-agent"))) {
      await body.allReady;
    }

    responseHeaders.set("Content-Type", "text/html");
    return new Response(body, {
      headers: responseHeaders,
      status: responseStatusCode,
    });
  } catch (e: any) {
    const message = e && typeof e === "object" && "message" in e ? String(e.message) : String(e);
    const stack = e && typeof e === "object" && "stack" in e ? String(e.stack) : "";
    return new Response(`SSR Error: ${message}\n${stack}`, { status: 500, headers: { "Content-Type": "text/plain" } });
  }
}

function isBotRequest(userAgent: string | null) {
  if (!userAgent) {
    return false;
  }

  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }

  if ("default" in isbotModule) {
    const maybeDefault: any = (isbotModule as any).default;
    if (typeof maybeDefault === "function") {
      return maybeDefault(userAgent);
    }
  }

  return false;
}
