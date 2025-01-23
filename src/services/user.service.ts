import { API_ROUTES } from "@/routes/api";
import { https } from "./config";

export const UserService = {
    login: (data: any) => {
        return https.post(API_ROUTES.LOGIN, data);
    },
    register: (data: any) => {
        return https.post(API_ROUTES.REGISTER, data);
    },
    confirmRegister: (data: any) => {
        return https.post(API_ROUTES.CONFIRM_REGISTER, data);
    },
    forgotPassword: (data: any) => {
        return https.post(API_ROUTES.FORGOT_PASSWORD, data);
    },
    resetPassword: (data: any) => {
        return https.post(API_ROUTES.RESET_PASSWORD, data);
    },
}