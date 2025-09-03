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

  // Fetch the files once on mount
  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await listFiles();
        console.log("📦 useDrive loaded files:", res);
        setFiles(res);
        setReady(true);
      } catch (err) {
        console.error("❌ Failed to load files:", err);
      }
    }

    fetchFiles();
  }, []);

  // Update search index when files change
  useEffect(() => {
    index.removeAll();
    if (Array.isArray(files) && files.length) {
      index.addAll(files);
    }
  }, [files, index]);

  // Select a file and load its content
  async function selectFile(f: DriveFile) {
    setSelected(f);
    setDocText(""); // clear old content
    try {
      const res = await exportGoogleDocAsText(f.id);
      setDocText(res.text);
    } catch (err) {
      console.error("❌ Failed to export doc:", err);
    }
  }

const results = useMemo(() => {
  if (!q) return files;
  return index.search(q).map((r) => files.find((f) => f.id === r.id)!);
}, [q, files, index]);

  return {
    ready,
    files: results,
    selected,
    selectFile,
    docText,
    q,
    setQ,
  };
}
