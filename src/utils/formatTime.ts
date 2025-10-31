// utils/formatTime.ts
export function formatTime(timeString: string): string {
  // Handle time like "14:30" or "09:00"
  const [hourStr, minuteStr] = timeString.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const ampm = hour >= 12 ? "pm" : "am";
  hour = hour % 12 || 12; // convert 0 → 12 and 13 → 1

  const formattedMinute = minute.toString().padStart(2, "0");
  return `${hour}:${formattedMinute} ${ampm}`;
}
