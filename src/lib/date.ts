export function getLocalDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function toDateInputValue(value: string | Date): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return getLocalDateInputValue(date);
}

export function formatEventDate(value: string, long = false): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date to be announced";
  }

  return date.toLocaleDateString("en-BD", {
    weekday: long ? "long" : undefined,
    day: "numeric",
    month: long ? "long" : "short",
    year: "numeric",
  });
}

export function isPastDate(value: string, today: Date = new Date()): boolean {
  const currentDate = new Date(today);
  currentDate.setHours(0, 0, 0, 0);

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return false;

  date.setHours(0, 0, 0, 0);

  return date < currentDate;
}
