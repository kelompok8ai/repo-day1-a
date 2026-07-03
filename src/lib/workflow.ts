export type RouteType = "direksi" | "komisaris";

export const DIREKSI_POSITIONS = [
  { key: "direktur_utama", label: "Direktur Utama", username: "dirut" },
  { key: "direktur_it", label: "Direktur IT & Operasional", username: "dir_it" },
  { key: "direktur_keuangan", label: "Direktur Keuangan", username: "dir_keu" },
  { key: "direktur_kepatuhan", label: "Direktur Kepatuhan", username: "dir_kep" },
  { key: "direktur_bisnis", label: "Direktur Bisnis & Syariah", username: "dir_bis" },
] as const;

export const KOMISARIS_POSITIONS = [
  { key: "komisaris_utama", label: "Komisaris Utama", username: "kom_utama" },
  { key: "komisaris_independen", label: "Komisaris Independen", username: "kom_indep" },
  { key: "komisaris", label: "Komisaris", username: "komisaris" },
] as const;

export type BoardPosition =
  | (typeof DIREKSI_POSITIONS)[number]["key"]
  | (typeof KOMISARIS_POSITIONS)[number]["key"];

export function parseTargetIds(json: string | null): number[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.map(Number).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function stringifyTargetIds(ids: number[]) {
  return JSON.stringify(ids);
}
