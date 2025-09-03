import { useState } from "react";
import Sidebar from "./components/Sidebar";
import AnnouncementRail from "./components/AnnouncementRail";
import SearchBar from "./components/SearchBar";
import DocList from "./components/DocList";
import PreviewPane from "./components/PreviewPane";
import { useDrive } from "./hooks/useDrive";

export default function App() {
  const { files, selected, selectFile, q, setQ, docText } = useDrive();
  const [showRight] = useState(true);

  return (
    <div
      className="h-screen grid"
      style={{
        gridTemplateColumns: showRight ? "240px 1fr 320px" : "240px 1fr",
      }}
    >
      <Sidebar />
      <main className="flex flex-col">
        <div className="p-3 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
          <SearchBar value={q} onChange={setQ} />
          <div className="text-xs opacity-60 hidden md:block">
            Tip: ⌘K / CTRL+K to focus search
          </div>
        </div>
        <div className="grid grid-cols-2 h-[calc(100vh-60px)]">
          <div className="p-3 overflow-auto">
            <DocList files={files} onOpen={selectFile} />
          </div>
          <div className="border-l border-neutral-200 dark:border-neutral-800">
            <PreviewPane file={selected} text={docText} />
          </div>
        </div>
      </main>
      {showRight && <AnnouncementRail />}
    </div>
  );
}
