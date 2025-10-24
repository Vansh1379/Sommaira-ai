"use client";
import React from "react";
import UploadFormInput from "./upload-form-input";
import { refine, z } from "zod";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid File" })
    .refine(
      (file) => file.size <= 24 * 1024 * 1024,
      "File size must be less than 24MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

export default function UploadForm() {
  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    const validatedFeilds = schema.safeParse({ file });
    if (!validatedFeilds.success) {
      console.log(
        validatedFeilds.error.flatten().fieldErrors.file?.[0] ?? "Invalid File"
      );
    }
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handelSubmit} />
    </div>
  );
}
