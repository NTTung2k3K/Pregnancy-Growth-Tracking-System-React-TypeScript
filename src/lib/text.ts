export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

export function textConvert(input: string): string {
  if (input.includes("-")) {
    return input
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } else {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }
}

export function formatDate(inputDate: string) {
  // Parse the input date string (YYYY-MM-DD)
  const [year, month, day] = inputDate.split("-").map(Number);

  // Create an array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the month name and return the formatted string
  return `${monthNames[month - 1]} ${day}, ${year}`;
}
