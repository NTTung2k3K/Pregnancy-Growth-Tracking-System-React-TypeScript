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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Appointment } from "@/containers/Dashboard/Appointment";
import type { CreateAppointmentPayload } from "@/containers/Appointment-History/_components/appoinment-calendar";
import toast from "react-hot-toast";
import { CreateAppointmentForm } from "@/containers/Appointment-History/_components/create-appoinment-form";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { CookiesService } from "@/services/cookies.service";
import { ROUTES } from "@/routes";
import { cn } from "@/lib/utils";

export function LargeCalendar() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setIsLoading] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = React.useState<
    number | null
  >(null);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const today = new Date();

  // Fetch appointments for the current month
  const fetchAppointments = React.useCallback(async (date: Date) => {
    try {
      setIsLoading(true);
      const startDay = startOfMonth(date);
      const endDate = endOfMonth(date);
      const userId = CookiesService.get();
      if (!userId) {
        toast.error("User ID not found");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/appointments/get-in-range-by-user-id?userId=${userId}&startDay=${format(
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

  const handleCreateAppointment = async (data: CreateAppointmentPayload) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`${BASE_URL}/appointments/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.isSuccessed) {
        toast.success("Appointment created successfully");
        setIsCreateDialogOpen(false);
        fetchAppointments(currentMonth);
      } else {
        toast.error(result.message || "Failed to create appointment");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, today);
          const isPast = isBefore(day, today);

          return (
            <HoverCard key={day.toString()} openDelay={200}>
              <HoverCardTrigger asChild>
                <Card
                  className={`aspect-square p-0.5 cursor-pointer transition-colors hover:bg-accent ${
                    isCurrentMonth ? "bg-background" : "bg-muted/20"
                  } ${dayAppointments.length > 0 ? "ring-1 ring-primary" : ""}
                  ${
                    isToday ? "border-2 border-emerald-400" : "" // Highlight today
                  }
                   ${isPast && !isToday ? "opacity-50 cursor-default" : ""}
                  `}
                  onClick={() => {
                    if (!isPast || isToday) {
                      setSelectedDate(day);
                      setIsCreateDialogOpen(true);
                    }
                  }}
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
                    {(!isPast || isToday) && dayAppointments.length === 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 bg-transparent"
                        onClick={() => {
                          window.location.href = ROUTES.APPOINTMENT_BOOKING;
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Booking
                      </Button>
                    )}
                  </div>
                  {dayAppointments.length > 0 ? (
                    <div
                      className={`space-y-1
                    ${dayAppointments.length > 1 && "h-44 overflow-y-scroll"}
                     `}
                    >
                      {dayAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="p-1.5 rounded-md bg-muted text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium">
                              {appointment.appointmentTemplate.name}
                            </div>

                            {appointment.status === "Pending" ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 bg-transparent"
                                onClick={() => {
                                  setSelectedAppointmentId(appointment.id);
                                  setSelectedDate(day);
                                  setIsCreateDialogOpen(true);
                                }}
                              >
                                Click to confirm
                              </Button>
                            ) : (
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
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {appointment.appointmentTemplate.description}
                          </div>
                          <div className="flex justify-between">
                            <div className="text-[10px] mt-0.5">
                              Fee: &nbsp;
                              {Math.round(
                                appointment.appointmentTemplate.fee
                              ).toLocaleString()}
                              VNĐ
                            </div>
                            {appointment.status === "Pending" && (
                              <Badge
                                className={cn({
                                  "bg-yellow-500/10 text-yellow-500":
                                    appointment.status === "Pending",
                                })}
                              >
                                {appointment.status}
                              </Badge>
                            )}
                            {/* <Badge
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
                            </Badge> */}
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

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Confirm New Appointment for{" "}
              {selectedAppointmentId
                ? appointments
                    .find((a) => a.id === selectedAppointmentId)
                    ?.childs.map((x) => x.name)
                    .join(", ")
                : ""}
            </DialogTitle>
          </DialogHeader>
          <CreateAppointmentForm
            initialDate={selectedDate || undefined}
            appointmentId={selectedAppointmentId ?? 0}
            onSubmit={handleCreateAppointment}
            onCancel={() => setIsCreateDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
