import Cookies from "js-cookie";

export const CookiesService = {
  get: (): string | null => {
    const userId = Cookies.get("USER_ID");
    return userId || null; // Return the raw string or null if not set
  },
  set: (userId: string): void => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Add 7 days
    Cookies.set("USER_ID", userId, { expires: expirationDate }); // No need for JSON.stringify
  },
  remove: (): void => {
    Cookies.remove("USER_ID");
  },
};
