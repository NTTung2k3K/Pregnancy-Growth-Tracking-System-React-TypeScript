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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [time, setTime] = useState<number>(300);
  const [isCounting, setIsCounting] = useState<boolean>(false);


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
