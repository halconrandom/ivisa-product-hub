export async function listFiles() {
  const res = await fetch("/api/drive/list", {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to list files");
  return res.json();
}

export async function exportGoogleDocAsText(id: string) {
  const res = await fetch("/api/drive/export", {
    method: "POST",
    body: JSON.stringify({ id }),
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Failed to export document");
  return res.json();
}
