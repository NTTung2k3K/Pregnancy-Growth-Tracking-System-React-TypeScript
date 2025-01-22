import { https } from "./config";

export const UserService = {
    login: (data: any) => {
        return https.post("/auth/user-login", data);
    },
    register: (data: any) => {
        return https.post("/auth/user-register", data);
    },
    confirmRegister: (data: any) => {
        return https.post("/auth/confirm-user-register", data);
    },
    forgotPassword: (data: any) => {
        return https.post("/auth/user-forgot-password", data);
    },
    resetPassword: (data: any) => {
        return https.post("/auth/user-reset-password", data);
    },
}