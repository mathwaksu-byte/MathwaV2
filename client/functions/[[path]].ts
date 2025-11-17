import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
// eslint-disable-next-line @typescript-eslint/no-var-requires
// @ts-ignore
import * as build from "../build/index.js";

export const onRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
});
