import { ROUTES } from "..";

export const accessRules = {
  Doctor: [
    ROUTES.DASHBOARD_EMPLOYEE_PROFILE,
    ROUTES.DASHBOARD_DOCTOR,
    ROUTES.DASHBOARD_APPOINTMENT,
    ROUTES.DASHBOARD_APPOINTMENT_CREATE,
    ROUTES.DASHBOARD_APPOINTMENT_UPDATE,
    ROUTES.DASHBOARD_APPOINTMENT_DETAIL,
    ROUTES.DASHBOARD_CHILDREN,
    ROUTES.DASHBOARD_CHILDREN_DETAIL,
    ROUTES.DASHBOARD_DOCTOR_GROWTH_CHARTS,
    ROUTES.DASHBOARD_DOCTOR_GROWTH_CHARTS_UPDATE,
    ROUTES.DASHBOARD_CHAT
  ],
};

export const canAccess = (
  role: keyof typeof accessRules,
  path: string
): boolean => {
  return (
    accessRules[role]?.some((route) =>
      route.includes(":id")
        ? path.startsWith(route.replace(":id", ""))
        : route === path
    ) ?? false
  );
};
