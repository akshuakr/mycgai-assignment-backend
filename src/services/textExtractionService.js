// import pdfParse from "pdf-parse";

// const extractTextFromPdf = async (buffer) => {
//   try {
//     const data = await pdfParse(buffer);
//     return data.text;
//   } catch (error) {
//     throw new Error("Failed to extract text from PDF");
//   }
// };

// export { extractTextFromPdf };


import { PDFExtract } from "pdf.js-extract";

const pdfExtract = new PDFExtract();

const extractTextFromPdf = async (buffer) => {
  try {
    const data = await pdfExtract.extractBuffer(buffer, {});
    let text = data.pages
      .map((page) => page.content.map((item) => item.str).join(" "))
      .join("\n")
      .replace(/(\r\n|\n|\r)/gm, " ")
      .replace(/\t/g, "")
      .replace(/  +/g, " ")
      .replace(/[^\x00-\x7F]/g, "")
      .trim();

    if (text.length === 0) {
      throw new Error("Parsed text returned was empty");
    }

    return text;
  } catch (error) {
    console.error({
      source: "extractTextFromPdf",
      message: "Failed to extract text from PDF",
      error: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to extract text from PDF");
  }
};

export { extractTextFromPdf };