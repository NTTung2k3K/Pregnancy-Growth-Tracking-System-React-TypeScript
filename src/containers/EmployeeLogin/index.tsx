import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { API_ROUTES } from "@/routes/api";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading } from "react-icons/ai";
import { ROUTES } from "@/routes";

interface FormValues {
  userName: string;
  password: string;
}

const EmployeeLoginContainer = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
  });

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    handleLoading();
    dispatch({ type: `${API_ROUTES.EMPLOYEE_LOGIN}`, payload: data });
  };

  return (
    <div className="font-[sans-serif]">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
          <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-8">
                <h3 className="text-sky-900 text-3xl font-bold">BabyCare</h3>
                <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                  Employee Login
                </p>
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  User name
                </label>
                <div className="relative flex items-center">
                  <input
                    {...register("userName", {
                      required: "Username is required",
                    })}
                    type="text"
                    className={`w-full text-sm text-gray-800 border ${
                      errors.userName ? "border-red-500" : "border-gray-300"
                    } pl-4 pr-10 py-3 rounded-lg outline-blue-600`}
                    placeholder="Enter user name"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-[18px] h-[18px] absolute right-4"
                    viewBox="0 0 24 24"
                  >
                    <circle cx={10} cy={7} r={6} data-original="#000000" />
                    <path
                      d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                      data-original="#000000"
                    />
                  </svg>
                </div>
                {errors.userName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.userName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters long",
                      },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/,
                        message:
                          "Password must include at least one uppercase letter, one digit, and one non-alphanumeric character.",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    className={`w-full text-sm text-gray-800 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } pl-4 pr-10 py-3 rounded-lg outline-blue-600`}
                    placeholder="Enter password"
                  />
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
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm">
                  <Link
                    to={`${ROUTES.RESET_PASSWORD}`}
                    onClick={() => {
                      localStorage.setItem("action", "employeeResetPassword");
                    }}
                    className="text-sky-900 hover:underline font-semibold"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <div className="!mt-8">
                <Button
                  disabled={isLoading}
                  type="submit"
                  className="w-full shadow-xl py-2.5 px-4 tracking-wide rounded-lg text-emerald-400 font-semibold bg-sky-800 hover:bg-sky-900 focus:outline-none"
                >
                  {isLoading && <AiOutlineLoading className="animate-spin" />}
                  Sign in
                </Button>
              </div>
            </form>
          </div>
          <div className="max-md:mt-8">
            <img
              src="https://readymadeui.com/login-image.webp"
              className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover"
              alt="Dining Experience"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLoginContainer;
