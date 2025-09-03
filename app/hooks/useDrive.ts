import { useEffect, useMemo, useState } from "react";
import MiniSearch from "minisearch";
import { listFiles, exportGoogleDocAsText } from "../../../ivisa-product-hub/src/lib/drive";

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  owners?: any[];
  iconLink?: string;
  webViewLink?: string;
};

export function useDrive() {
  const [ready, setReady] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [selected, setSelected] = useState<DriveFile | null>(null);
  const [docText, setDocText] = useState<string>("");
  const [q, setQ] = useState("");

  const index = useMemo(
    () =>
      new MiniSearch<DriveFile>({
        fields: ["name"],
        idField: "id",
        searchOptions: { prefix: true, fuzzy: 0.2 },
      }),
    []
  );

  useEffect(() => {
    (async () => {
      try {
        setReady(true);
        // Our serverless API already filters to Docs/PDFs in a specific folder.
        const result = await listFiles();
        setFiles(result.files);
      } catch (e) {
        console.warn("Drive list failed:", e);
      }
    })();
  }, []);

  useEffect(() => {
    index.removeAll();
    if (files.length) index.addAll(files);
  }, [files, index]);

  async function selectFile(f: DriveFile) {
    setSelected(f);
    setDocText("");
    if (f.mimeType === "application/vnd.google-apps.document") {
      try {
        const text = await exportGoogleDocAsText(f.id);
        setDocText(text);
      } catch (e) {
        console.warn("Doc export failed:", e);
      }
    } else {
      // TODO v0.2: add pdfjs text extraction for PDFs
      setDocText("");
    }
  }

  const filtered = useMemo(() => {
    if (!q.trim()) return files;
    const ids = new Set(index.search(q).map((r) => r.id));
    return files.filter((f) => ids.has(f.id));
  }, [q, files, index]);

  return {
    ready,
    files: filtered,
    allFiles: files,
    selected,
    selectFile,
    q,
    setQ,
    docText,
  };
}
