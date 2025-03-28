import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { useDispatch } from "react-redux";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { API_ROUTES } from "@/routes/api";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";

interface SignupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

interface FormValues {
  email: string;
  password: string;
  // date: string;
}

const SignupForm = ({ isOpen, onClose, onSwitchToLogin }: SignupFormProps) => {
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

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    try {
      handleLoading();

      dispatch({
        type: `${API_ROUTES.REGISTER}`,
        payload: {
          email: data.email,
          password: data.password,
        },
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const commonInputClasses =
    "bg-white p-6 rounded-none border-2 border-slate-300";

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#e7e2cd] p-0 border-none h-[700px] overflow-y-scroll">
        <img
          src="/assets/images/signup-img.jpg"
          className="rounded-lg w-full h-[220px]"
        />
        <div className="bg-gradient-to-t from-[#e7e2cd] via-transparent to-transparent absolute w-full h-[100px] top-[120px] left-0 z-10"></div>
        <DialogHeader>
          <DialogTitle className="text-center font-semibold text-3xl">
            Track your baby's development
          </DialogTitle>
          <DialogDescription className="py-4 text-xl text-black px-6 text-center">
            Get expert guidance from the world's #1 pregnancy and parenting
            resource, delivered via email, our apps, and website.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6">
          {/* Email Input */}
          <div className="my-2">
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
              })}
              className={commonInputClasses}
              placeholder="Email address:"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="my-2 relative">
            <Input
              type={showPassword ? "text" : "password"}
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
              className={commonInputClasses}
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

          {/* Submit Button */}
          <div className="flex items-center justify-center mt-6 my-2">
            <Button
              disabled={isLoading}
              type="submit"
              className=" bg-sky-800 text-emerald-300 rounded-full p-6 text-xl hover:bg-sky-950"
            >
              {isLoading && <AiOutlineLoading className="animate-spin" />}
              Sign up
            </Button>
          </div>
        </form>

        <div className="border border-slate-500 mx-6"></div>

        <div className="flex flex-col justify-center items-center">
          <p className="font-semibold my-2 text-xl">Already a member?</p>
          <Button
            onClick={onSwitchToLogin}
            className=" bg-slate-500/20 text-sky-950 border border-black rounded-full p-6 text-xl hover:bg-slate-500/50 hover:border-black my-4"
          >
            Log in
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupForm;
