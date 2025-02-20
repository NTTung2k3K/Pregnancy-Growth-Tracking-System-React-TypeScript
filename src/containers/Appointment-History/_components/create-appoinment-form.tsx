import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreateAppointmentPayload } from "@/containers/Appointment-History/_components/appoinment-calendar";
import { timeSlotsStartHours } from "@/containers/Appointment-Booking";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import { CookiesService } from "@/services/cookies.service";
import toast from "react-hot-toast";

const formSchema = z.object({
  appointmentDate: z.date({
    required_error: "Please select a date",
  }),
  appointmentSlot: z.string({
    required_error: "Please select a time slot",
  }),
  notes: z.string().optional(),
  description: z.string().optional(),
});

interface CreateAppointmentFormProps {
  initialDate?: Date;
  appointmentId: number;
  onSubmit: (data: CreateAppointmentPayload) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CreateAppointmentForm({
  initialDate,
  appointmentId,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CreateAppointmentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appointmentDate: initialDate
        ? initialDate instanceof Date
          ? initialDate
          : new Date(initialDate)
        : new Date(),
      notes: "",
      description: "",
    },
  });

  const filteredSlots = timeSlotsStartHours.filter((slot) => {
    const now = new Date();
    const selectedDate = form.watch("appointmentDate");

    const isToday = selectedDate?.toDateString() === now.toDateString();

    return !isToday || now.getHours() + now.getMinutes() / 60 < slot.startHour;
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (appointmentId == 0) {
      return;
    }
    const userId = CookiesService.get();
    if (!userId) {
      toast.error("User ID not found");
      return;
    }
    const appointmentDateInLocalTime = new Date(values.appointmentDate);

    appointmentDateInLocalTime.setHours(0, 0, 0, 0);
    console.log(appointmentDateInLocalTime);

    await onSubmit({
      id: appointmentId,
      userId: userId, // Hardcoded for demo
      appointmentDate: appointmentDateInLocalTime,
      appointmentSlot: Number.parseInt(values.appointmentSlot),
      notes: values.notes,
      description: values.description,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="appointmentDate"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-center">
              <FormLabel>Date </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal ",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        new Date(field.value).toLocaleDateString("vi-VN")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  {/* <Calendar
                    mode="single"
                    selected={new Date("2024-10-10")}
                    onSelect={(date) => {
                      console.log("Selected date:", date);
                      field.onChange(date);
                    }}
                    className="w-full flex justify-center bg-gray-400"
                    disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                    initialFocus
                    footer={
                      field.value
                        ? `Selected: ${field.value.toLocaleDateString("vi-VN")}`
                        : "Pick a day."
                    }
                  /> */}
                  <Calendar
                    mode="single"
                    selected={field.value}
                    defaultMonth={field.value} // Thêm defaultMonth để mở đúng tháng
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onSelect={(date: any) => {
                      const selectedDate = new Date(date);
                      selectedDate.setHours(0, 0, 0, 0);
                      field.onChange(selectedDate);
                    }}
                    className="rounded-md border bg-[#1dd186]"
                    disabled={(date) =>
                      date.setHours(0, 0, 0, 0) <
                      new Date().setHours(0, 0, 0, 0)
                    }
                    initialFocus
                    footer={
                      field.value
                        ? `Selected: ${field.value.toLocaleDateString("vi-VN")}`
                        : "Pick a day."
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="appointmentSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Slot</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredSlots.length > 0 ? (
                    filteredSlots.map((slot) => (
                      <SelectItem key={slot.id} value={slot.id.toString()}>
                        Slot {slot.id} - {slot.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem key={0} value="Invalid">
                      No slot available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Add any notes here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any description here..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Confirm Appointment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
