export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    // Handle invalid date strings
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "short", // "Oct"
    day: "numeric", // "22"
  });
}
