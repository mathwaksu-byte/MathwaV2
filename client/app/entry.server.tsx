import type { EntryContext } from "@remix-run/cloudflare";
import { RemixServer } from "@remix-run/react";
import * as isbotModule from "isbot";
import * as server from "react-dom/server";

const ABORT_DELAY = 5000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const isBot = isBotRequest(request.headers.get("user-agent"));
  if (typeof (server as any).renderToReadableStream === "function") {
    return await handleReadable(request, responseStatusCode, responseHeaders, remixContext, isBot);
  }
  return await handlePipeable(request, responseStatusCode, responseHeaders, remixContext, isBot);
}

function isBotRequest(userAgent: string | null) {
  if (!userAgent) return false;
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

async function handleReadable(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  isBot: boolean
) {
  const body: any = await (server as any).renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      onError() {
        responseStatusCode = 500;
      }
    }
  );
  if (isBot && body?.allReady) {
    await body.allReady;
  }
  responseHeaders.set("Content-Type", "text/html");
  return new Response(body, { headers: responseHeaders, status: responseStatusCode });
}

async function handlePipeable(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  isBot: boolean
) {
  const { renderToPipeableStream } = server as any;
  const nodeStream: any = await import("node:stream");
  const remixNode: any = await import("@remix-run/node");
  return await new Promise<Response>((resolve, reject) => {
    let didError = false;
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onAllReady() {
          if (!isBot) return;
          const body = new nodeStream.PassThrough();
          const stream = remixNode.createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(new Response(stream, { headers: responseHeaders, status: didError ? 500 : responseStatusCode }));
          pipe(body);
        },
        onShellReady() {
          if (isBot) return;
          const body = new nodeStream.PassThrough();
          const stream = remixNode.createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(new Response(stream, { headers: responseHeaders, status: didError ? 500 : responseStatusCode }));
          pipe(body);
        },
        onShellError(error: any) {
          reject(error);
        },
        onError(error: any) {
          didError = true;
          console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
