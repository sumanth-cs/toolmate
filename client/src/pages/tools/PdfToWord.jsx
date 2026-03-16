import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Download } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function PdfToWord() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState([]);
  const [converting, setConverting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState("upload");

  const handleFile = useCallback(async (f) => {
    if (f.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    const data = await f.arrayBuffer();
    setFile({ name: f.name, data });
    setStep("upload");
    setExtractedText([]);
  }, []);

  const extractText = async () => {
    if (!file) return;
    setConverting(true);
    try {
      const pdf = await pdfjsLib.getDocument({ data: file.data }).promise;
      const pageTexts = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items
          .map((item) => item.str)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        pageTexts.push(text);
      }
      setExtractedText(pageTexts);
      setStep("preview");
    } catch (err) {
      alert("Error extracting text. The PDF may be image-based or encrypted.");
    }
    setConverting(false);
  };

  const downloadAsDocx = async () => {
    const children = [];
    extractedText.forEach((text, idx) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `— Page ${idx + 1} —`, bold: true, size: 28 }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }),
      );
      // Split text into paragraphs by double spaces or newlines
      const paragraphs = text.split(/\.\s+/).filter(Boolean);
      paragraphs.forEach((p) => {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: p.trim() + ".", size: 24 })],
            spacing: { after: 120 },
          }),
        );
      });
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const baseName = file?.name.replace(".pdf", "") || "converted";
    saveAs(blob, `${baseName}.docx`);
    setStep("done");
  };

  const downloadAsTxt = () => {
    const text = extractedText
      .map((t, i) => `--- Page ${i + 1} ---\n${t}`)
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const baseName = file?.name.replace(".pdf", "") || "converted";
    saveAs(blob, `${baseName}.txt`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col"
    >
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
          <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-brand-500" />
          PDF to Word
        </h1>
        <p className="text-foreground/60 mt-2 text-sm sm:text-base">
          Extract text from PDF and convert it into a Word (.docx) document.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6 w-full max-w-4xl mx-auto flex flex-col gap-6">
        {/* Upload Section */}
        {!file ? (
          <div
            className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-brand-500 bg-brand-500/10"
                : "border-border hover:border-brand-500/50 hover:bg-white/5"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
            }}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".pdf";
              input.onchange = (e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              };
              input.click();
            }}
          >
            <Upload className="w-10 h-10 mx-auto mb-3 text-brand-500/60" />
            <p className="text-foreground/80 font-semibold">
              Drop a PDF file here or click to browse
            </p>
            <p className="text-foreground/40 text-sm mt-1">
              Text-based PDFs work best
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border">
              <div>
                <p className="text-sm font-semibold truncate">{file.name}</p>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setExtractedText([]);
                  setStep("upload");
                }}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Change File
              </button>
            </div>

            {step === "upload" && (
              <button
                onClick={extractText}
                disabled={converting}
                className="btn-primary w-full h-12 gap-2 text-base disabled:opacity-50"
              >
                {converting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                    Extracting text...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" /> Extract & Convert
                  </>
                )}
              </button>
            )}

            {step === "preview" && extractedText.length > 0 && (
              <>
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold text-foreground/80">
                    Preview ({extractedText.length} pages extracted)
                  </h3>
                  <div className="bg-background border border-border rounded-xl p-4 max-h-[400px] overflow-y-auto text-sm text-foreground/80 whitespace-pre-wrap font-mono">
                    {extractedText.map((text, idx) => (
                      <div key={idx} className="mb-4">
                        <p className="text-brand-500 font-bold mb-1">
                          — Page {idx + 1} —
                        </p>
                        <p>
                          {text ||
                            "(No text found on this page — it may be image-based)"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={downloadAsDocx}
                    className="btn-primary h-12 gap-2"
                  >
                    <Download className="w-5 h-5" /> Download .docx
                  </button>
                  <button
                    onClick={downloadAsTxt}
                    className="btn-secondary h-12 gap-2"
                  >
                    <Download className="w-5 h-5" /> Download .txt
                  </button>
                </div>
              </>
            )}

            {step === "done" && (
              <div className="text-center py-8">
                <p className="text-lg font-bold text-emerald-400 mb-2">
                  ✅ Conversion Complete!
                </p>
                <p className="text-foreground/60 text-sm">
                  Your Word document has been downloaded.
                </p>
                <button
                  onClick={() => {
                    setFile(null);
                    setExtractedText([]);
                    setStep("upload");
                  }}
                  className="mt-4 text-brand-400 hover:text-brand-300 text-sm font-semibold"
                >
                  Convert another PDF
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
