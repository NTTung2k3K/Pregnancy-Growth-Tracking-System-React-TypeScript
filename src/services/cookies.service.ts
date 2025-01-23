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

export const CookiesEmployeeService = {
  get: (): string | null => {
    const employeeId = Cookies.get("EMPLOYEE_ID");
    return employeeId || null; // Return the raw string or null if not set
  },
  set: (employeeId: string): void => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Add 7 days
    Cookies.set("EMPLOYEE_ID", employeeId, { expires: expirationDate }); // No need for JSON.stringify
  },
  remove: (): void => {
    Cookies.remove("EMPLOYEE_ID");
  },
};

export const CookiesTokenService = {
  get: (): string | null => {
    const token = Cookies.get("TOKEN");
    return token || null; // Return the raw string or null if not set
  },
  set: (token: string): void => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Add 7 days
    Cookies.set("TOKEN", token, { expires: expirationDate }); // No need for JSON.stringify
  },
  remove: (): void => {
    Cookies.remove("TOKEN");
  },
};
