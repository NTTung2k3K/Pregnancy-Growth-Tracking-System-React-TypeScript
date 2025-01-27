import { ROUTES } from "..";

export const accessRules = {
  Doctor: [ROUTES.DASHBOARD_EMPLOYEE_PROFILE, ROUTES.DASHBOARD_DOCTOR],
};

export const canAccess = (
  role: keyof typeof accessRules,
  path: string
): boolean => {
  return accessRules[role]?.includes(path) ?? false;
};
