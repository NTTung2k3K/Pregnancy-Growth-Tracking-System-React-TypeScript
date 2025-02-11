import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Appointment } from "@/containers/Dashboard/Appointment";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { CookiesEmployeeService } from "@/services/cookies.service";
import { ROUTES } from "@/routes";
import { cn } from "@/lib/utils";
import { API_ROUTES } from "@/routes/api";
import { useNavigate } from "react-router-dom";

export function DoctorCalendar() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setIsLoading] = React.useState(true);

  const today = new Date();

  // Fetch appointments for the current month
  const fetchAppointments = React.useCallback(async (date: Date) => {
    try {
      setIsLoading(true);
      const startDay = startOfMonth(date);
      const endDate = endOfMonth(date);
      const userId = CookiesEmployeeService.get();
      if (!userId) {
        toast.error("User ID not found");
        return;
      }

      const response = await axios.get(
        `${
          BASE_URL + API_ROUTES.DOCTOR_CALENDAR
        }?userId=${userId}&startDay=${format(
          startDay,
          "yyyy-MM-dd"
        )}&endDate=${format(endDate, "yyyy-MM-dd")}`
      );
      const data = response.data;

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
    fetchAppointments(currentMonth);
  }, [currentMonth, fetchAppointments]);

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((appointment) =>
      isSameDay(parseISO(appointment.appointmentDate), date)
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <h2 className="text-lg font-semibold">
            {format(currentMonth, "MMM yyyy")}
          </h2>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 bg-transparent"
            onClick={previousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 bg-transparent"
            onClick={nextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-xs font-medium">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="py-0.5">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 mt-0.5">
        {Array.from({ length: startOfMonth(currentMonth).getDay() }).map(
          (_, index) => (
            <div
              key={`empty-${index}`}
              className="aspect-square bg-muted/20 rounded-[2px]"
            />
          )
        )}

        {days.map((day) => {
          const dayAppointments = getAppointmentsForDate(day);
          dayAppointments.sort((a, b) => a.appointmentSlot - b.appointmentSlot);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, today);

          return (
            <HoverCard key={day.toString()} openDelay={200}>
              <HoverCardTrigger asChild>
                <Card
                  className={` aspect-square p-0.5 cursor-pointer transition-colors hover:bg-accent ${
                    isCurrentMonth ? "bg-background" : "bg-muted/20"
                  } ${dayAppointments.length > 0 ? "ring-1 ring-primary" : ""}
                  ${
                    isToday ? "border-2 border-emerald-400" : "" // Highlight today
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between">
                      <span
                        className={`text-xs ${
                          !isCurrentMonth && "text-muted-foreground"
                        }`}
                      >
                        {format(day, "d")}
                      </span>
                      {isToday && <span className="absolute text-xs font-bold text-emerald-400 ml-8">Today</span>}
                      {dayAppointments.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="scale-75 -mr-1 -mt-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                        >
                          {dayAppointments.length}
                        </Badge>
                      )}
                    </div>
                    {dayAppointments.length > 0 && (
                      <div className="mt-0.5">
                        {dayAppointments.slice(0, 1).map((apt) => (
                          <div
                            key={apt.id}
                            className="text-[8px] truncate text-muted-foreground leading-tight"
                          >
                            {apt.appointmentTemplate.name} |{" "}
                            <span
                              className={cn({
                                "text-green-500": apt.status === "Completed",
                                "text-yellow-500": apt.status === "Pending",
                                "text-red-500":
                                  apt.status === "NoShow" ||
                                  apt.status === "Failed" ||
                                  apt.status === "CancelledByUser" ||
                                  apt.status === "CancelledByDoctor",
                                "text-blue-500": apt.status === "InProgress",
                                "text-violet-500": apt.status === "Confirmed",
                                "text-pink-500": apt.status === "Rescheduled",
                              })}
                            >
                              {apt.status}
                            </span>
                          </div>
                        ))}
                        {dayAppointments.length > 1 && (
                          <div className="text-[8px] text-muted-foreground leading-tight">
                            +{dayAppointments.length - 1}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent className="w-64" align="start">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">
                      {format(day, "MMM d, yyyy")}
                    </h4>
                  </div>
                  {dayAppointments.length > 0 ? (
                    <div className="space-y-1">
                      {dayAppointments.map((appointment) => (
                        <div
                          onClick={() => {
                            navigate(
                              ROUTES.DASHBOARD_APPOINTMENT_DETAIL.replace(
                                ":id",
                                String(appointment.id)
                              )
                            );
                          }}
                          key={appointment.id}
                          className="p-1.5 rounded-md bg-muted text-xs cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium">
                              {appointment.appointmentTemplate.name}
                            </div>

                            <Badge className="bg-sky-900 text-emerald-400">
                              Slot {appointment.appointmentSlot}
                            </Badge>
                          </div>
                          <div className="flex text-[10px] text-muted-foreground">
                            Child:
                            {appointment.childs.map((child) => (
                              <p className="ml-2">{child.name},</p>
                            ))}
                          </div>
                          <div className="flex text-[10px] text-muted-foreground">
                            Parent: {appointment.user.fullName}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No appointments scheduled
                    </p>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>
    </div>
  );
}
