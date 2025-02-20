import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Appointment } from "@/containers/Dashboard/Appointment";
import { BASE_URL } from "@/services/config";
import { CookiesService } from "@/services/cookies.service";
import toast from "react-hot-toast";
export interface CreateAppointmentPayload {
  id: number;
  userId: string;
  appointmentDate: Date;
  appointmentSlot: number;
  notes?: string;
  description?: string;
}

export interface ApiResponse {
  statusCode: number;
  message: string | null;
  isSuccessed: boolean;
}

export function AppointmentCalendar() {
  const [date, setDate] = React.useState<Date>(new Date());
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setIsLoading] = React.useState(true);

  // Fetch appointments for the current month
  const fetchAppointments = React.useCallback(async (currentDate: Date) => {
    try {
      setIsLoading(true);
      const startDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      const userId = CookiesService.get();
      if (!userId) {
        toast.error("User ID not found");
        return;
      }
      const response = await fetch(
        `${BASE_URL}/appointments/get-in-range-by-user-id?userId=${userId}&startDay=${format(
          startDay,
          "yyyy-MM-dd"
        )}&endDate=${format(endDate, "yyyy-MM-dd")}`
      );
      const data = await response.json();

      if (data.isSuccessed) {
        setAppointments(data.resultObj);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAppointments(date);
  }, [date, fetchAppointments]);

  // Function to check if a date has appointments
  const hasAppointment = (day: Date) => {
    return appointments.some(
      (appointment) =>
        format(new Date(appointment.appointmentDate), "yyyy-MM-dd") ===
        format(day, "yyyy-MM-dd")
    );
  };

  // Function to get appointments for a specific date
  const getAppointmentsForDate = (day: Date) => {
    return appointments.filter(
      (appointment) =>
        format(new Date(appointment.appointmentDate), "yyyy-MM-dd") ===
        format(day, "yyyy-MM-dd")
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          className="rounded-md border"
          modifiers={{
            hasAppointment: (day) => hasAppointment(day),
          }}
          modifiersStyles={{
            hasAppointment: {
              backgroundColor: "rgb(224 242 254)",
              fontWeight: "bold",
            },
          }}
          components={{
            Day: ({ date: dayDate, ...props }) => {
              const dayAppointments = getAppointmentsForDate(dayDate);

              if (dayAppointments.length === 0) {
                return <button {...props}>{dayDate.getDate()}</button>;
              }

              return (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button {...props} className={`relative ${props}`}>
                      {dayDate.getDate()}
                      <Badge
                        variant="secondary"
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                      >
                        {dayAppointments.length}
                      </Badge>
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      {dayAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center gap-2"
                        >
                          <CalendarIcon className="h-4 w-4" />
                          <div>
                            <p className="font-medium">
                              {appointment.appointmentTemplate.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.appointmentTemplate.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
