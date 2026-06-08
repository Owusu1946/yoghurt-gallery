"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

export function UploadThingSSR() {
  return (
    <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
  );
}
