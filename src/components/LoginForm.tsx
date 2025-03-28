import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { API_ROUTES } from "@/routes/api";
import { useDispatch } from "react-redux";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { https } from "@/services/config";
import { UserService } from "@/services/user.service";
import { CookiesService } from "@/services/cookies.service";

interface FormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

const LoginForm = ({ isOpen, onClose, onSwitchToSignup }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
  });

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsLoading(true);
      const response = await UserService.login(data);
      if (response.data.statusCode === 200) {
        CookiesService.set(response.data.resultObj.id);
        window.location.href = `/`;
        toast.success(response.data.message);
      }
    } catch (e) {
      toast.error("Email hoặc mật khẩu không đúng.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 100000);
  };

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        handleLoading();
        // Gọi API userinfo của Google để lấy thông tin chi tiết người dùng
        const res = await https.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );
        dispatch({
          type: `${API_ROUTES.LOGIN_WITH_GOOGLE}`,
          payload: res.data,
        });
        // toast.success("Successfully logged in with Google!");
      } catch (err) {
        console.error("Login with Google failed:", err);
        toast.error("Failed to login with Google. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-[#e7e2cd] p-0 border-none h-[700px] overflow-y-scroll">
          <img
            src="/assets/images/login-img.jpg"
            className="rounded-lg w-full h-[220px]"
          />
          <div className="bg-gradient-to-t from-[#e7e2cd] via-transparent to-transparent absolute w-full h-[100px] top-[120px] left-0 z-10"></div>
          <DialogHeader>
            <DialogTitle className="text-center font-semibold text-3xl">
              Welcome back
            </DialogTitle>
            <DialogDescription className="py-4 text-xl text-black px-6 text-center">
              Enter your email address to log in to your BabyCenter account
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6">
            <div className="my-2">
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                })}
                className="bg-white p-6 rounded-none border-2 border-slate-300"
                placeholder="Email address:"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="my-2 relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                })}
                className=" bg-white p-6 rounded-none border-2 border-slate-300 "
                placeholder="Password:"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
              <span
                onClick={togglePasswordVisibility}
                className="absolute top-4 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
              >
                {showPassword ? (
                  <FaRegEyeSlash size={18} />
                ) : (
                  <FaRegEye size={18} />
                )}
              </span>
            </div>

            <Link
              to={"/auth/reset-password"}
              onClick={() => {
                onClose();
                localStorage.setItem("action", "resetPasword");
              }}
              className="my-2 text-sm text-sky-800"
            >
              Forgot password?
            </Link>

            <div className="flex items-center justify-center mt-6 my-2">
              <Button
                disabled={isLoading}
                type="submit"
                className="bg-sky-800 text-emerald-300 rounded-full p-6 text-xl hover:bg-sky-950"
              >
                {isLoading && <AiOutlineLoading className="animate-spin" />}
                Log in
              </Button>
            </div>
          </form>

          <div className="flex items-center justify-center mt-6 my-2">
            <button
              onClick={() => login()}
              className="flex items-center gap-2 bg-white border border-gray-300 p-2 rounded-lg shadow-md hover:shadow-lg"
            >
              <img
                src="/assets/thang/Google_Icons-09-512.webp"
                alt="Google Logo"
                className="w-5 h-5"
              />
              <span className="text-gray-700 font-semibold">
                Sign in with Google
              </span>
            </button>
          </div>

          <div className="border border-slate-500 mx-6"></div>

          <div className="flex flex-col justify-center items-center">
            <p className="font-semibold my-2 text-xl">New to BabyCare?</p>
            <Button
              onClick={onSwitchToSignup}
              className="bg-slate-500/20 text-sky-950 border border-black rounded-full p-6 text-xl hover:bg-slate-500/50 hover:border-black my-4"
            >
              Sign up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginForm;
