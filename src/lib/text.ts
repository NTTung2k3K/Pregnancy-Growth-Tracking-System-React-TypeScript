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

export function formatDate(inputDate: string | null | undefined): string {
  // Check if the input is null or empty
  if (!inputDate) {
    return ""; // Return an empty string for null or empty input
  }

  // Parse the input date string (handles ISO 8601 format)
  const date = new Date(inputDate);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return ""; // Return an empty string for invalid date formats
  }

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

  // Get the day, month, and year
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based index
  const day = date.getDate();

  // Return the formatted string
  return `${monthNames[month]} ${day}, ${year}`;
}

export function formatDateSliceTime(dateString: string): string {
  return dateString.split("T")[0];
}


