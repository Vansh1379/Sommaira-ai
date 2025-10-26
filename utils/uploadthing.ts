import type { OurFileRouter } from "../app/api/uploadThing/core";
import { generateReactHelpers } from "@uploadthing/react";

export const { useUploadThing } = generateReactHelpers<OurFileRouter>({
  url: "/api/uploadThing",
});
