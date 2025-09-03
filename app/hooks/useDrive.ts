import { useEffect, useMemo, useState } from "react";
import MiniSearch from "minisearch";
import { listFiles, exportGoogleDocAsText } from "../lib/drive";

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  owners?: any[];
  iconLink?: string;
  webViewLink?: string;
  text?: string; // for internal search
};

export function useDrive() {
  const [ready, setReady] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [selected, setSelected] = useState<DriveFile | null>(null);
  const [docText, setDocText] = useState<string>("");
  const [q, setQ] = useState<string>("");

  const index = useMemo(
    () =>
      new MiniSearch<DriveFile>({
        fields: ["name", "text"], // now searching both file name and full text
        idField: "id",
        searchOptions: { prefix: true, fuzzy: 0.2 },
      }),
    []
  );

  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await listFiles();

        // Fetch full text for searchable files (PDFs and Google Docs)
        const withText: DriveFile[] = await Promise.all(
          res.map(async (file: DriveFile): Promise<DriveFile> => {
            if (
              file.mimeType === "application/pdf" ||
              file.mimeType.includes("google-apps.document")
            ) {
              try {
                const exported = await exportGoogleDocAsText(file.id);
                return { ...file, text: exported.text };
              } catch (err) {
                console.error("❌ Failed to fetch text for:", file.name);
              }
            }
            return file;
          })
        );

        setFiles(withText);
        setReady(true);
      } catch (err) {
        console.error("❌ Failed to load files:", err);
      }
    }

    fetchFiles();
  }, []);

  useEffect(() => {
    index.removeAll();
    if (Array.isArray(files) && files.length) {
      index.addAll(files);
    }
  }, [files, index]);

  async function selectFile(file: DriveFile) {
    setSelected(file);
    setDocText(""); // clear old content
    try {
      const res = await exportGoogleDocAsText(file.id);
      setDocText(res.text);
    } catch (err) {
      console.error("❌ Failed to export doc:", err);
    }
  }

  const results = useMemo(() => {
    if (!q) return files;
    return index.search(q).map((r) => files.find((f) => f.id === r.id)!);
  }, [q, files, index]);

  const [pendingDocNeedle, setPendingDocNeedle] = useState<string | null>(null);

  function openBestMatch() {
    const best = index.search(q)[0];
    if (!best) return;
    const match = files.find((x) => x.id === best.id);
    if (match) {
      setPendingDocNeedle(q);
      selectFile(match);
    }
  }

  return {
    ready,
    files: results,
    selected,
    selectFile,
    docText,
    q,
    setQ,
    openBestMatch,
    pendingDocNeedle,
    setPendingDocNeedle,
  };
}
