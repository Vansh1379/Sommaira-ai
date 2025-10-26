import { currentUser } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "32MB" } })
    .middleware(async ({ req }) => {
      const user = await currentUser();
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("=== SERVER-SIDE UPLOAD COMPLETE ===");
      console.log("User ID:", metadata?.userId);
      console.log("=== FILE DATA ===");
      console.log("File name:", file.name);
      console.log("File size:", file.size);
      console.log("File type:", file.type);
      console.log("File URL:", file.ufsUrl);
      console.log("File UFS URL:", file.ufsUrl);
      console.log("File key:", file.key);
      console.log("All file properties:", Object.keys(file));
      console.log("=== END FILE DATA ===");

      return { userId: metadata?.userId, file: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
