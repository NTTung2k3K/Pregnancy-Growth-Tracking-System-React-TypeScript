import { API_ROUTES } from "@/routes/api";
import { https } from "./config";

export const EmployeeService = {
    login: (data: any) => {
        return https.post(API_ROUTES.EMPLOYEE_LOGIN, data);
    },
    forgotPassword: (data: any) => {
        return https.post(API_ROUTES.EMPLOYEE_FORGOT_PASSWORD, data);
    },
    resetPassword: (data: any) => {
        return https.post(API_ROUTES.EMPLOYEE_RESET_PASSWORD, data);
    },
}