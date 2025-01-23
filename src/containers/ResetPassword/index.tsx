import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_ROUTES } from "@/routes/api";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

interface FormValues {
  email: string;
}

const ResetPasswordContainer = () => {
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
    }, 10000);
  };

  const action = localStorage.getItem("action");

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    handleLoading();
    if (action === "employeeResetPassword") {
      dispatch({
        type: `${API_ROUTES.EMPLOYEE_FORGOT_PASSWORD}`,
        payload: { email: data.email },
      });
    } else {
      dispatch({
        type: `${API_ROUTES.FORGOT_PASSWORD}`,
        payload: { email: data.email },
      });
    }
  };

  return (
    <div className="flex flex-col my-20 px-96">
      <Link to="/" className="text-black flex items-center text-xl">
        <MdOutlineKeyboardArrowLeft className="text-3xl" />
        Back
      </Link>
      <h1 className="text-4xl text-sky-900 font-semibold my-4">
        Reset your password
      </h1>
      <p className="mb-4">
        Forgot your password? No problem. Enter your email address here and
        we'll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <div className="flex items-center justify-center mt-6 my-2">
          <Button
            disabled={isLoading}
            type="submit"
            className="bg-sky-800 text-emerald-300 rounded-full p-6 text-xl hover:bg-sky-950"
          >
            {isLoading && <AiOutlineLoading className="animate-spin" />}
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordContainer;
