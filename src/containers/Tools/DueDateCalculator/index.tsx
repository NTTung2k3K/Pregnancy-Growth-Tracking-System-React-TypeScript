import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { addDateWithMonthsAndDays } from "@/lib/date";
import { formatDate } from "@/lib/text";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";

interface FormValues {
  date: string;
}

const DueDateCalculatorContainer = () => {
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

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setDueDate(addDateWithMonthsAndDays(data.date));
  };

  // Register the form fields
  register("date", {
    required: "Date is required",
  });
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="py-40 px-96">
        <div className="">
          {dueDate && (
            <div className="mb-10 flex flex-col justify-center items-center bg-emerald-200 rounded-md text-sky-900 p-4">
              <img
                src="/assets/images/Home/Tools/date-calculator.webp"
                alt=""
                width={130}
              />
              <p>Congrats! Your due date is</p>
              <p className="text-center p-4 font-semibold text-2xl ">
                {formatDate(dueDate)}
              </p>
            </div>
          )}
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
          {errors.date && <p className="text-red-500">{errors.date.message}</p>}
        </div>

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
    </>
  );
};

export default DueDateCalculatorContainer;
