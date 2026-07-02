import { format, parseISO, differenceInDays, differenceInHours } from "date-fns";
import { id as localeId } from "date-fns/locale";

export function formatDate(dateStr: string) {
  try {
    return format(parseISO(dateStr), "d MMM yyyy", { locale: localeId });
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string) {
  try {
    return format(parseISO(dateStr), "d MMM yyyy HH:mm", { locale: localeId });
  } catch {
    return dateStr;
  }
}

export function formatTimeRange(start: string, end: string) {
  return `${start} – ${end}`;
}

export function daysSince(dateStr: string | null) {
  if (!dateStr) return null;
  try {
    return differenceInDays(new Date(), parseISO(dateStr));
  } catch {
    return null;
  }
}

export function hoursSince(dateStr: string | null) {
  if (!dateStr) return null;
  try {
    return differenceInHours(new Date(), parseISO(dateStr));
  } catch {
    return null;
  }
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function getWeekRange() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + 1);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

export function getToday() {
  return new Date().toISOString().split("T")[0];
}
