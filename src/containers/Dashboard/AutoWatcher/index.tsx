import { useEffect } from "react";
import axios from "axios";
import {
  CookiesEmployee2Service,
  CookiesEmployeeService,
  CookiesTokenService,
} from "@/services/cookies.service";
import { BASE_URL } from "@/services/config";

const refreshToken = async () => {
  try {
    const data = CookiesEmployee2Service.get()?.toString();
    if (!data) {
      throw new Error("Please login again.");
    }
    const employee = JSON.parse(data);

    if (!employee.refreshToken) throw new Error("No refresh token");

    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      id: employee.id,
      refreshToken: employee.refreshToken,
    });

    if (response.data.isSuccessed) {
      CookiesEmployeeService.set(response.data.resultObj.id);
      CookiesEmployee2Service.set(JSON.stringify(response.data.resultObj));

      CookiesTokenService.set(response.data.resultObj.accessToken);
      localStorage.setItem("role", response.data.resultObj.roles[0]);

      return response.data.resultObj.accessToken;
    } else {
      console.error("❌ Refresh token failed api, logging out...");
      CookiesEmployeeService.remove();
      CookiesEmployee2Service.remove();
      //   window.location.href = "/auth/employee-login"; // Chuyển về trang login nếu refresh token thất bại
      return null;
    }
  } catch (error) {
    console.error("❌ Refresh token failed, logging out...");
    CookiesEmployeeService.remove();
    CookiesEmployee2Service.remove();
    // window.location.href = "/auth/employee-login"; // Chuyển về trang login nếu refresh token thất bại
    return null;
  }
};

const AuthWatcher = () => {
  useEffect(() => {
    const checkTokenExpiration = async () => {
      const data = CookiesEmployee2Service.get()?.toString();
      if (!data) {
        throw new Error("Please login again.");
      }

      const employee = JSON.parse(data);
      const expireTime = employee.accessTokenExpiredTime;

      if (
        expireTime &&
        Date.now() > new Date(expireTime).getTime() - 60 * 1000 * 3
      ) {
        // Nếu còn 3 phút thì refresh
        await refreshToken();
      }
    };

    const interval = setInterval(checkTokenExpiration, 1000 * 60 * 5); // Kiểm tra mỗi 5 phút

    return () => clearInterval(interval); // Cleanup khi component unmount
  }, []);

  return null; // Component không render gì cả, chỉ chạy ngầm
};

export default AuthWatcher;
