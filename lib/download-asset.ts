export async function downloadRemoteAsset(
  url: string,
  filename: string,
): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("fetch failed");
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(objectUrl);
  } catch {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  }
}

export function assetFilename(url: string, fallback: string): string {
  try {
    const pathname = new URL(url).pathname;
    const base = pathname.split("/").pop();
    if (base && base.includes(".")) return base;
  } catch {
    // ignore
  }
  return fallback;
}
