import * as React from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
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
  isBefore,
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
    return appointments.filter(
      (appointment) =>
        isSameDay(parseISO(appointment.appointmentDate), date) &&
        appointment.status !== "CancelledByUser"
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
          const isPast = isBefore(day, today);

          return (
            <HoverCard key={day.toString()} openDelay={200}>
              <HoverCardTrigger asChild>
                <Card
                  className={` aspect-square p-0.5 cursor-pointer transition-colors hover:bg-accent ${
                    isCurrentMonth ? "bg-background" : "bg-muted/20"
                  } ${dayAppointments.length > 0 ? "ring-1 ring-primary" : ""}
                  ${
                    isToday ? "border-2 border-emerald-400" : "" // Highlight today
                  }
                  ${isPast && !isToday ? "opacity-50 cursor-default" : ""}
                  `}
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
                      {isToday && (
                        <span className="absolute text-xs font-bold text-emerald-400 ml-8">
                          Today
                        </span>
                      )}
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
                        {dayAppointments.slice(0, 2).map((apt) => (
                          <div
                            key={apt.id}
                            className="flex flex-col justify-center items-center my-1 text-[8px] truncate text-muted-foreground leading-tight"
                          >
                            {apt.appointmentTemplate.name}
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
                        {dayAppointments.length > 2 && (
                          <div className="flex items-center justify-center text-emerald-400 text-[8px] font-bold leading-tight">
                            +{dayAppointments.length - 2}
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
                    {(!isPast || isToday) && dayAppointments.length === 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 bg-transparent"
                        onClick={() => {
                          window.location.href =
                            ROUTES.DASHBOARD_APPOINTMENT_CREATE;
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Booking
                      </Button>
                    )}
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

                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>Parent: {appointment.user.fullName}</span>
                            <Badge
                              className={cn({
                                "bg-green-500/10 text-green-500":
                                  appointment.status === "Completed",
                                "bg-yellow-500/10 text-yellow-500":
                                  appointment.status === "Pending",
                                "bg-red-500/10 text-red-500": [
                                  "NoShow",
                                  "Failed",
                                  "CancelledByUser",
                                  "CancelledByDoctor",
                                ].includes(appointment.status),
                                "bg-blue-500/10 text-blue-500":
                                  appointment.status === "InProgress",
                                "bg-violet-500/10 text-violet-500":
                                  appointment.status === "Confirmed",
                                "bg-pink-500/10 text-pink-500":
                                  appointment.status === "Rescheduled",
                              })}
                            >
                              {appointment.status}
                            </Badge>
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
