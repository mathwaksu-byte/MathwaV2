import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";

export const onRequest = async (context: any) => {
  const build = (await import("server-build")) as any;
  const handle = createPagesFunctionHandler({
    build,
    mode: process.env.NODE_ENV,
  });
  return handle(context);
};
