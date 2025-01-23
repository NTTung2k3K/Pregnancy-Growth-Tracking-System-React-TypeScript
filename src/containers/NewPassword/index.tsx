import { Button } from "@/components/ui/button";
import { API_ROUTES } from "@/routes/api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import { FaExclamationTriangle, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

interface ResetFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const NewPasswordContainer = () => {
  const navigate = useNavigate();
  //   const username = useSelector(selectAuthStateUsername);
  //   useVerifyUserInRedux();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    mode: "onChange",
  });

  const password = watch("password");

  const location = useLocation();

  // const getQueryParams = (queryString: string) => {
  //   const params = new URLSearchParams(queryString);
  //   return {
  //     email: params.get("email"),
  //     token: params.get("token"),
  //   };
  // };

  // const { email, token } = getQueryParams(location.search);

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token"); // Get the token value
  const email = searchParams.get("email"); // (Optional) Get the email value

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //   const onSubmit = (data: any) => {
  //     const { confirmPassword, ...newData } = data;

  //     UserService.postNewPassword(newData)
  //       .then((response) => {
  //         if (response.statusCode === 201) {
  //           toast.success(response.data.message);
  //           navigate(`${ROUTES.LOGIN}`);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("Error: ", error);
  //         toast.error(error.message);
  //       });
  //   };

  const handleLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const action = localStorage.getItem("action");

  const onSubmit = (data: any) => {
    handleLoading();
    const submitedData = {
      email: email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      token: token,
    };
    if (action === "employeeResetPassword") {
      dispatch({
        type: `${API_ROUTES.EMPLOYEE_RESET_PASSWORD}`,
        payload: submitedData,
        navigate,
      });
    } else {
      dispatch({
        type: `${API_ROUTES.RESET_PASSWORD}`,
        payload: submitedData,
        navigate,
      });
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center my-10">
      <div className="w-[400px]">
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
          <h1 className="text-3xl font-semibold text-sky-900">
            Reset Password
          </h1>
          <p className="text-muted-foreground text-sm">Enter new password!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-5">
          <div className="space-y-4">
            <div className="relative">
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
                className="pl-4 w-full h-[40px] border-2 border-gray-300 rounded-md"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute top-3 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
              >
                {showPassword ? (
                  <FaRegEyeSlash size={18} />
                ) : (
                  <FaRegEye size={18} />
                )}
              </span>
            </div>
            <div className="relative">
              <input
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/,
                    message:
                      "Password must include at least one uppercase letter, one digit, and one non-alphanumeric character.",
                  },
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="pl-4 w-full h-[40px] border-2 border-gray-300 rounded-md"
                placeholder="Confirm Password"
                type={showPassword ? "text" : "password"}
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute top-3 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
              >
                {showPassword ? (
                  <FaRegEyeSlash size={18} />
                ) : (
                  <FaRegEye size={18} />
                )}
              </span>
            </div>
          </div>

          {/* Display error messages */}
          {errors.password && (
            <div className="bg-red-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500">
              <FaExclamationTriangle className="h-4 w-4" />
              <p>{errors.password.message}</p>
            </div>
          )}

          {!errors.password && errors.confirmPassword && (
            <div className="bg-red-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500">
              <FaExclamationTriangle className="h-4 w-4" />
              <p>{errors.confirmPassword.message}</p>
            </div>
          )}

          <Button
            disabled={isLoading}
            className="w-full mt-5 bg-sky-900 flex justify-center items-center text-emerald-400 p-2 rounded-md text-xl"
            type="submit"
          >
            {isLoading && <AiOutlineLoading className="animate-spin" />}
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewPasswordContainer;
