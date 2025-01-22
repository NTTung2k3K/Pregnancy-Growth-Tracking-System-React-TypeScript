export function addDateWithMonthsAndDays(inputDate: string) {
  // Parse the input date string (YYYY-MM-DD) to a Date object
  const [year, month, day] = inputDate.split("-").map(Number);
  const date = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript

  // Add 9 months
  date.setMonth(date.getMonth() + 9);

  // Handle month overflow by checking if the day has changed
  if (date.getDate() < day) {
    date.setDate(0); // Set to last day of the previous month if overflow occurs
  }

  // Add 10 days
  date.setDate(date.getDate() + 8);

  // Format the result back to YYYY-MM-DD
  const resultYear = date.getFullYear();
  const resultMonth = String(date.getMonth() + 1).padStart(2, "0"); // Month is 1-indexed
  const resultDay = String(date.getDate()).padStart(2, "0");

  return `${resultYear}-${resultMonth}-${resultDay}`;
}
