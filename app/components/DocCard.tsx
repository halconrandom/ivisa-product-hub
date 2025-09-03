import { Star } from "lucide-react";
import { useAtom } from "jotai";
import { favoritesAtom, toggleFavoriteAtom } from "../lib/favorites";
import type { DriveFile } from "../hooks/useDrive";

export default function DocCard({
  f,
  onOpen,
}: {
  f: DriveFile;
  onOpen: () => void;
}) {
  const [favs] = useAtom(favoritesAtom);
  const [, toggle] = useAtom(toggleFavoriteAtom);
  const fav = favs.includes(f.id);
  return (
    <button onClick={onOpen} className="group text-left w-full">
      <div className="p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/50 hover:shadow-soft">
        <div className="flex items-center justify-between">
          <div className="font-medium">{f.name}</div>
          <Star
            className={
              "w-4 h-4 cursor-pointer " +
              (fav
                ? "fill-yellow-400 text-yellow-400"
                : "opacity-50 group-hover:opacity-90")
            }
            onClick={(e) => {
              e.stopPropagation();
              toggle(f.id);
            }}
          />
        </div>
        <div className="text-xs opacity-70 mt-1">
          {new Date(f.modifiedTime).toLocaleString()}
        </div>
        <div className="text-xs mt-1 opacity-80">
          {f.mimeType.replace("application/", "")}
        </div>
      </div>
    </button>
  );
}
