// Simple PDF text extraction using pdf-parse
// This is more reliable than LangChain's PDFLoader which has dependency issues

export async function fetchAndExtractPdftext(fileUrl: string) {
  console.log("=== PDF TEXT EXTRACTION ===");
  console.log("Fetching PDF from URL:", fileUrl);

  try {
    // Fetch the PDF file
    const response = await fetch(fileUrl);
    console.log("Fetch response status:", response.status);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch PDF: ${response.status} ${response.statusText}`
      );
    }

    const blob = await response.blob();
    console.log("Blob size:", blob.size);
    console.log("Blob type:", blob.type);

    // Validate that it's a PDF
    if (!blob.type.includes("pdf")) {
      throw new Error(`Invalid file type: ${blob.type}. Expected PDF.`);
    }

    // Convert blob to array buffer
    const arrayBuffer = await blob.arrayBuffer();
    console.log("ArrayBuffer size:", arrayBuffer.byteLength);

    // Convert to buffer for pdf-parse
    const buffer = Buffer.from(arrayBuffer);
    console.log("Buffer size:", buffer.length);

    // Try pdf-parse first
    try {
      console.log("=== TRYING PDF-PARSE ===");
      const pdfParse = require("pdf-parse");

      console.log("Starting PDF text extraction with pdf-parse...");
      const data = await pdfParse(buffer);

      console.log("PDF-Parse extraction successful:");
      console.log("Pages:", data.numpages);
      console.log("Text length:", data.text.length);
      console.log("First 200 characters:", data.text.substring(0, 200));
      console.log(
        "Last 200 characters:",
        data.text.substring(data.text.length - 200)
      );
      console.log("=== PDF EXTRACTION COMPLETE ===");

      return data.text;
    } catch (pdfParseError) {
      console.log("=== PDF-PARSE FAILED, TRYING PDFJS-DIST ===");
      console.log("PDF-Parse error:", pdfParseError);

      // Fallback to pdfjs-dist
      return await extractWithPdfJs(arrayBuffer);
    }
  } catch (error) {
    console.error("=== PDF EXTRACTION ERROR ===");
    console.error("Error in fetchAndExtractPdftext:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      url: fileUrl,
    });
    throw error;
  }
}

// Fallback function using pdfjs-dist
async function extractWithPdfJs(arrayBuffer: ArrayBuffer): Promise<string> {
  console.log("=== USING PDFJS-DIST FALLBACK ===");

  try {
    const pdfjsLib = await import("pdfjs-dist");

    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    console.log("PDF loaded, pages:", pdf.numPages);

    let fullText = "";

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageText = textContent.items.map((item: any) => item.str).join(" ");

      fullText += pageText + "\n";
      console.log(`Page ${pageNum} text length:`, pageText.length);
    }

    console.log("PDFJS-Dist extraction successful:");
    console.log("Total pages:", pdf.numPages);
    console.log("Total text length:", fullText.length);
    console.log("First 200 characters:", fullText.substring(0, 200));
    console.log(
      "Last 200 characters:",
      fullText.substring(fullText.length - 200)
    );
    console.log("=== PDFJS-DIST EXTRACTION COMPLETE ===");

    return fullText;
  } catch (error) {
    console.error("PDFJS-Dist extraction failed:", error);
    throw error;
  }
}
