export function dateFormatter(dateTime: Date) {
  const date = new Date(dateTime);
  const formatted = date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short", hour12: true });
  return formatted;
}
