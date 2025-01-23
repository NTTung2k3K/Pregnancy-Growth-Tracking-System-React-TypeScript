import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AiOutlineLoading } from "react-icons/ai";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { addDateWithMonthsAndDays } from "@/lib/date";
import { formatDate } from "@/lib/text";

interface FormValues {
  date: string;
}

const CalculateForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      date: "",
    },
    mode: "onChange",
  });

  const [isLoading] = useState<boolean>(false);

  const [date, setDate] = useState<Date | null>(null);

  const [dueDate, setDueDate] = useState<string | null>(null);

  const validateDate = (value: string) => {
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignore time for comparison
    return selectedDate <= today || "Date cannot be in the future";
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setDueDate(addDateWithMonthsAndDays(data.date));
  };

  // Register the form fields
  register("date", {
    required: "Date is required",
    validate: validateDate,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="hover:underline cursor-pointer">Calculate my due date</p>
      </DialogTrigger>
      <DialogContent className="bg-[#e7e2cd] border-none p-6">
        <DialogHeader>
          <DialogTitle className="text-center font-semibold text-3xl">
            First day of your last period
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6">
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

          {dueDate && (
            <p className="text-center p-4 font-semibold text-2xl text-sky-900">
              {formatDate(dueDate)}
            </p>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-center mt-6 my-2">
            <Button
              disabled={isLoading}
              type="submit"
              className=" bg-sky-800 text-emerald-300 rounded-full p-6 text-xl hover:bg-sky-950"
            >
              {isLoading && <AiOutlineLoading className="animate-spin" />}
              Calculate
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CalculateForm;
