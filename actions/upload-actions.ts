"use server";

import { fetchAndExtractPdftext } from "@/lib/pdf-extractor";

export async function generatePdfSummary(
  uploadResponse: [
    {
      serverData: {
        userId: string;
        file: {
          url: string;
          name: string;
        };
      };
    }
  ]
) {
  console.log("=== generatePdfSummary CALLED ===");
  console.log(
    "Upload response received:",
    JSON.stringify(uploadResponse, null, 2)
  );

  if (!uploadResponse) {
    console.log("No upload response provided");
    return {
      success: false,
      message: "File Upload Failed!",
      data: null,
    };
  }

  const {
    serverData: {
      userId,
      file: { url: pdfUrl, name: pdfName },
    },
  } = uploadResponse[0];

  if (!pdfUrl) {
    return {
      success: false,
      message: "File Upload Failed!",
      data: null,
    };
  }

  try {
    console.log("=== STARTING PDF TEXT EXTRACTION ===");
    console.log("PDF URL:", pdfUrl);
    console.log("PDF Name:", pdfName);

    const pdftext = await fetchAndExtractPdftext(pdfUrl);

    console.log("=== PDF TEXT EXTRACTED ===");
    console.log("Text length:", pdftext.length);
    console.log("First 500 characters:", pdftext.substring(0, 500));
    console.log(
      "Last 500 characters:",
      pdftext.substring(pdftext.length - 500)
    );

    return {
      success: true,
      message: "PDF text extracted successfully!",
      data: {
        text: pdftext,
        textLength: pdftext.length,
        fileName: pdfName,
        userId: userId,
      },
    };
  } catch (error) {
    console.error("=== PDF TEXT EXTRACTION ERROR ===");
    console.error("Error:", error);
    return {
      success: false,
      message: "Error generating PDF summary.",
      data: null,
    };
  }
}
