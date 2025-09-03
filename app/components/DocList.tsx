import DocCard from "./DocCard";
import type { DriveFile } from "../hooks/useDrive";

export default function DocList({
  files,
  onOpen,
}: {
  files: DriveFile[];
  onOpen: (f: DriveFile) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {files.map((f) => (
        <DocCard key={f.id} f={f} onOpen={() => onOpen(f)} />
      ))}
    </div>
  );
}
