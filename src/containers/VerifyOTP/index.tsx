import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import OtpInput from "./components/OTPInput";
import { useDispatch } from "react-redux";
import { API_ROUTES } from "@/routes/api";
import { AiOutlineLoading } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface VerifyFormValues {
  email: string;
  otp: string;
}

const VerifyOTPContainer = () => {
  //   const location = useLocation();
  //   const from = location.state?.from;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [time, setTime] = useState<number>(300);
  const [isCounting, setIsCounting] = useState<boolean>(false);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  useEffect(() => {
    if (isCounting && time > 0) {
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    }

    if (time === 0) {
      setIsCounting(false);
    }
  }, [isCounting, time]);

  //   const handleResend = async () => {
  //     try {
  //       UserService.postSendOTP({ email: username }).then((res) => {
  //         if (res.statusCode === 201) {
  //           toast.success("OTP resent successfully!");
  //           setTime(300);
  //           setIsCounting(true);
  //         } else {
  //           toast.error(res.message || "Failed to resend OTP.");
  //         }
  //       });
  //     } catch (error) {
  //       toast.error("An error occurred while resending OTP.");
  //       console.error(error);
  //     }
  //   };

  const { control, register, handleSubmit, setValue } =
    useForm<VerifyFormValues>();

  const handleLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const onSubmit: SubmitHandler<VerifyFormValues> = (data) => {
    handleLoading();
    const otpCode = Object.values(data.otp).join("");
    const email = localStorage.getItem("email");
    const submitedData = { code: otpCode, email: email };
    dispatch({
      type: `${API_ROUTES.CONFIRM_REGISTER}`,
      payload: submitedData,
      navigate,
    });
  };

  //   const onSubmit: SubmitHandler<VerifyFormValues> = (data) => {
  //     const otpCode = Object.values(data.otp).join("");

  //     UserService.postVerifyOTP({ ...data, code: otpCode })
  //       .then((res) => {
  //         if (res.statusCode === 201) {
  //           toast.success("Verify successfully");
  //           handleNavigate(from);
  //         } else {
  //           toast.error(res.message);
  //         }
  //       })
  //       .catch((error) => {
  //         toast.error("An error occurred while verifying OTP.");
  //         console.error(error);
  //       });
  //   };

  return (
    <div className="flex items-center justify-center my-10">
      <div className="w-[500px] p-10">
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
          <h1 className="text-3xl text-sky-900 font-semibold">
            Verification by OTP
          </h1>
          <p className="text-muted-foreground text-sm">
            Please check your email!
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center mt-10"
        >
          <input
            type="hidden"
            {...register("email")}
            // value={username || ""}
            value={""}
          />
          <OtpInput
            length={6}
            name="otp"
            control={control}
            rules={{
              required: "OTP is required",
              validate: (value: any) =>
                /^\d+$/.test(value) || "OTP must contain only numbers",
            }}
            onChange={(otp) => setValue("otp", otp)}
          />

          <div className="mt-4 w-full flex justify-end mr-16">
            {!isCounting && (
              <button
                type="button"
                className=" text-sky-900 font-semibold border-none"
                // onClick={handleResend}
              >
                Resend
              </button>
            )}
            {isCounting && <span>{formatTime(time)}</span>}
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="w-full mt-4 px-4 py-5 bg-sky-900 text-emerald-400 text-xl rounded-md font-semibold"
          >
            {isLoading && <AiOutlineLoading className="animate-spin" />}
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTPContainer;
