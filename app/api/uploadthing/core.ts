import { createUploadthing, type FileRouter } from "uploadthing/next";
const f = createUploadthing();

export const ourFileRouter = {
  customDesign: f({
    image: { maxFileSize: "64MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      return { scope: "customizer" as const };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),

  catalogImage: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      return { scope: "catalog" as const };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
