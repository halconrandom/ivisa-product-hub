import { atom } from "jotai";
import { supabase } from "../lib/supabase";

// Atom for the list of favorite file IDs
export const favoritesAtom = atom<string[]>([]);

// Load from Supabase when the app boots
export const loadFavoritesAtom = atom(null, async (_get, set) => {
  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user.id;
  if (!uid) return;

  const { data, error } = await supabase
    .from("favorites")
    .select("file_id")
    .eq("user_id", uid);

  if (error) {
    console.error("Failed to load favorites", error);
    return;
  }
  set(favoritesAtom, (data ?? []).map((r) => r.file_id));
});

// Toggle (add/remove) a favorite in Supabase
export const toggleFavoriteAtom = atom(
  null,
  async (get, set, fileId: string) => {
    const favs = new Set(get(favoritesAtom));
    const { data: session } = await supabase.auth.getSession();
    const uid = session.session?.user.id;
    if (!uid) return;

    if (favs.has(fileId)) {
      // remove
      favs.delete(fileId);
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", uid)
        .eq("file_id", fileId);
    } else {
      // add
      favs.add(fileId);
      await supabase.from("favorites").insert({
        user_id: uid,
        file_id: fileId,
      });
    }

    set(favoritesAtom, Array.from(favs));
  }
);
