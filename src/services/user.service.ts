import { https } from "./config";

export const UserService = {
    register: (data: any) => {
        return https.post("/auth/user-register", data);
    }
}