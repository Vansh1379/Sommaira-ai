"use client";
import React, { use } from "react";
import UploadFormInput from "./upload-form-input";
import { refine, z } from "zod";
import { useUploadThing } from "../../utils/uploadthing";
import { generatePdfSummary } from "@/actions/upload-actions";

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
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: async (res) => {
      console.log("=== CLIENT UPLOAD COMPLETE ===");
      console.log(
        "Upload completed successfully:",
        JSON.stringify(res, null, 2)
      );

      // Process the upload response here
      if (res && res.length > 0) {
        console.log("=== PROCESSING UPLOAD RESPONSE ===");
        console.log("Number of files:", res.length);

        // Log each file in the response
        res.forEach((file, index) => {
          console.log(`=== FILE ${index + 1} ===`);
          console.log("File name:", file.name);
          console.log("File size:", file.size);
          console.log("File type:", file.type);
          console.log("File URL:", file.url);
          console.log("File UFS URL:", file.ufsUrl);
          console.log("Server data:", file.serverData);
          console.log("All file properties:", Object.keys(file));
        });

        // Transform the response to match the expected type for generatePdfSummary
        const transformedResponse = res.map((file) => ({
          serverData: {
            userId: file.serverData?.userId || "",
            file: {
              url: file.ufsUrl || file.url,
              name: file.name,
            },
          },
        }));

        console.log("=== TRANSFORMED RESPONSE FOR SUMMARY ===");
        console.log(
          "Transformed response:",
          JSON.stringify(transformedResponse, null, 2)
        );

        // Call generatePdfSummary
        console.log("=== CALLING generatePdfSummary ===");
        console.log("About to call with:", transformedResponse[0]);

        try {
          const summary = await generatePdfSummary([transformedResponse[0]]);
          console.log("=== PDF SUMMARY GENERATED ===");
          console.log("PDF summary generated:", summary);
          console.log("Summary success:", summary?.success);
          console.log("Summary data:", summary?.data);

          // Log the extracted text in browser console
          if (summary.success && summary.data) {
            console.log("=== EXTRACTED PDF TEXT (BROWSER CONSOLE) ===");
            console.log("Text length:", summary.data.textLength);
            console.log("File name:", summary.data.fileName);
            console.log("User ID:", summary.data.userId);

            // Log text in chunks for better readability
            const text = summary.data.text;
            const chunkSize = 1000; // Log in chunks of 1000 characters

            console.log("=== FULL EXTRACTED TEXT (in chunks) ===");
            for (let i = 0; i < text.length; i += chunkSize) {
              const chunk = text.substring(i, i + chunkSize);
              console.log(`Chunk ${Math.floor(i / chunkSize) + 1}:`, chunk);
            }
            console.log("=== END EXTRACTED TEXT ===");

            // Also log the full text as one block
            console.log("=== COMPLETE TEXT (single block) ===");
            console.log(text);
            console.log("=== END COMPLETE TEXT ===");
          } else {
            console.error("=== PDF EXTRACTION FAILED ===");
            console.error("Error:", summary.message);
          }
        } catch (error) {
          console.error("=== ERROR IN PDF PROCESSING ===");
          console.error("Error:", error);
        }
      }

      alert("File uploaded successfully!");
    },
    onUploadError: (error) => {
      console.error("=== UPLOAD ERROR ===");
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message || "Unknown error"}`);
    },
    onUploadBegin: (file) => {
      console.log("=== CLIENT UPLOAD BEGIN ===");
      console.log("Upload started for file:", file);
    },
  });

  const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("=== FORM SUBMITTED ===");
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    // Check if file exists
    if (!file) {
      console.error("No file selected");
      alert("Please select a file");
      return;
    }

    // Validate file
    const validatedFields = schema.safeParse({ file });
    if (!validatedFields.success) {
      const errorMessage =
        validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid File";
      console.error("Validation error:", errorMessage);
      alert(errorMessage);
      return;
    }

    console.log("=== STARTING UPLOAD ===");
    console.log("File to upload:", file.name, file.size, file.type);

    // Start the upload - the processing will happen in the callback
    await startUpload([file]);
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handelSubmit} />
    </div>
  );
}
