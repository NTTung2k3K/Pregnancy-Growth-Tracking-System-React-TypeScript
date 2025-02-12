
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
import { timeSlots } from "@/containers/Appointment-Booking";
import { cn, getSlotString } from "@/lib/utils";
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
      appointmentDate: initialDate,
      notes: "",
      description: "",
    },
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
    await onSubmit({
      id: appointmentId,
      userId: userId, // Hardcoded for demo
      appointmentDate: values.appointmentDate.toISOString(),
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
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    className="w-full flex justify-center bg-gray-400"
                    disabled={(date) => date < new Date()}
                    initialFocus
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
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.id} value={slot.id.toString()}>
                      {getSlotString(slot.id)}
                    </SelectItem>
                  ))}
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
            {isSubmitting ? "Creating..." : "Create Appointment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
