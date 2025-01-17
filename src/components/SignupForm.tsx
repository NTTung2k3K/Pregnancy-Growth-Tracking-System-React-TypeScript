"use client";

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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SignupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

interface FormValues {
  email: string;
  password: string;
  city: string;
  date: string;
}

const SignupForm = ({ isOpen, onClose, onSwitchToLogin }: SignupFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      date: "",
      city: "",
    },
    mode: "onChange",
  });

  const [date, setDate] = useState<Date | null>(null);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  // Validation helper
  const validateDate = (value: string) => {
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignore time for comparison
    return selectedDate >= today || "Date cannot be in the past";
  };

  // Register the form fields
  register("date", {
    required: "Date is required",
    validate: validateDate,
  });

  register("city", { required: "City is required" });

  const commonInputClasses =
    "bg-white p-6 rounded-none border-2 border-slate-300";

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
          <div className="my-2">
            <Input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              className={commonInputClasses}
              placeholder="Password:"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* City Select Input */}
          <div className="my-2">
            <Select
              onValueChange={(value) =>
                setValue("city", value, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full bg-white p-6 border-2 border-slate-300">
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                <SelectItem value="Chicago">Chicago</SelectItem>
                <SelectItem value="Houston">Houston</SelectItem>
              </SelectContent>
            </Select>
            {errors.city && (
              <p className="text-red-500">{errors.city.message}</p>
            )}
          </div>

          {/* Date Picker Input */}
          <div className="my-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full bg-white p-6 border-2 border-slate-300 text-left justify-start font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date || undefined}
                  onSelect={(selectedDate) => {
                    setDate(selectedDate ?? null);
                    setValue(
                      "date",
                      selectedDate
                        ? selectedDate.toISOString().split("T")[0]
                        : "",
                      { shouldValidate: true }
                    );
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-red-500">{errors.date.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-center mt-6 my-2">
            <Button
              type="submit"
              className="bg-sky-800 text-emerald-300 rounded-full p-6 text-xl hover:bg-sky-950"
            >
              Sign up
            </Button>
          </div>
        </form>

        <div className="border border-slate-500 mx-6"></div>

        <div className="flex flex-col justify-center items-center">
          <p className="font-semibold my-2 text-xl">Already a member?</p>
          <Button
            onClick={onSwitchToLogin}
            className="bg-slate-500/20 text-sky-950 border border-black rounded-full p-6 text-xl hover:bg-slate-500/50 hover:border-black my-4"
          >
            Log in
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupForm;
