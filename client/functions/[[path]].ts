import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";

export const onRequest = async (context: any) => {
  const p = "../build/index.js";
  const build = (await import(p)) as any;
  const handle = createPagesFunctionHandler({
    build,
    mode: process.env.NODE_ENV,
  });
  return handle(context);
};
