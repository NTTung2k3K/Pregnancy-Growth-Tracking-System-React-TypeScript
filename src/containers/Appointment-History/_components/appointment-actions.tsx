import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { data, Link } from "react-router-dom";
import {
  Baby,
  Bookmark,
  BookmarkX,
  Calendar,
  Clock,
  DollarSign,
  Eye,
  Pencil,
  Stethoscope,
  User,
} from "lucide-react";
import { ROUTES } from "@/routes";
import { DialogClose } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Appointment } from "@/containers/Dashboard/Appointment";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { GrowthCharts } from "@/containers/Dashboard/Appointment/components/chart-record";
import { CookiesService } from "@/services/cookies.service";
import { getSlotString } from "@/lib/utils";

interface AppointmentActionsProps {
  id: string;
  status: string;
  fetchAPI: () => void;
}

export function AppointmentActions({
  id,
  status,
  fetchAPI,
}: AppointmentActionsProps) {
  const [appointment, setAppointment] = useState<Appointment>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };
  const fetchAppointment = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/appointments/get-by-id`, {
        params: { id },
      });
      setAppointment(response.data.resultObj);
    } catch (error) {
      setError(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAppointment();
  }, [id]);
  const [open, setOpen] = useState(false);

  const handleCancelAppointment = async () => {
    const userId = CookiesService.get();
    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.patch(
        `${BASE_URL}/appointments/cancel-appointment-by-user`,
        {
          id,
          userId,
        }
      );

      if (res.data.isSuccessed) {
        toast.success("Appointment canceled successfully");
        fetchAPI();
        setOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* View Details Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
            <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            <span className="sr-only">View details</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>Full appointment information</DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : appointment ? (
            <div className="grid gap-6 py-4">
              {/* Main Appointment Info */}
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{appointment.name}</h3>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Date:{" "}
                      {new Date(appointment.appointmentDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Time: {getSlotString(appointment.appointmentSlot)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Fee: {Math.round(appointment.fee).toLocaleString()} VNĐ
                    </span>
                  </div>
                </div>

                {/* Template Info */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Appointment Template
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={appointment.appointmentTemplate.image}
                          alt={appointment.appointmentTemplate.name}
                        />
                        <AvatarFallback>
                          {appointment.appointmentTemplate.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">
                          {appointment.appointmentTemplate.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {appointment.appointmentTemplate.description}
                        </p>
                        <p className="text-sm">
                          Days from birth:{" "}
                          {Math.abs(
                            appointment.appointmentTemplate.daysFromBirth
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Patient Info */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Patient Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.user.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Email:
                        </span>
                        <span>{appointment.user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Phone:
                        </span>
                        <span>{appointment.user.phoneNumber}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Children Info */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Children
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {appointment.childs.map((child) => (
                        <div
                          key={child.id}
                          className="flex flex-col items-start gap-4"
                        >
                          <div className="flex gap-2 items-center">
                            <Baby className="h-4 w-4 text-muted-foreground mt-1" />
                            <div>
                              <h4 className="font-medium">{child.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Due Date:{" "}
                                {new Date(child.dueDate).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </p>
                              {child.pregnancyStage && (
                                <p className="text-sm text-muted-foreground">
                                  Stage: {child.pregnancyStage}
                                </p>
                              )}
                            </div>
                          </div>

                          <GrowthCharts child={child} key={child.id} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Doctors Info */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Assigned Doctors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {appointment.doctors.map((doctor) => (
                        <div key={doctor.id} className="flex items-start gap-4">
                          <Stethoscope className="h-4 w-4 text-muted-foreground mt-1" />
                          <div>
                            <h4 className="font-medium">{doctor.fullName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {doctor.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Phone: {doctor.phoneNumber}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Notes & Description */}
                {(appointment.notes ||
                  appointment.description ||
                  appointment.result) && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Additional Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {appointment.notes && (
                          <div>
                            <h4 className="font-medium mb-1">Notes</h4>
                            <p className="text-sm text-muted-foreground">
                              {appointment.notes}
                            </p>
                          </div>
                        )}
                        {appointment.description && (
                          <div>
                            <h4 className="font-medium mb-1">Description</h4>
                            <p className="text-sm text-muted-foreground">
                              {appointment.description}
                            </p>
                          </div>
                        )}
                        {appointment.result && (
                          <div>
                            <h4 className="font-medium mb-1">Result</h4>
                            <p className="text-sm text-muted-foreground">
                              {appointment.result}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Footer Actions */}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Edit Button - Only show for specific statuses */}
      {status === "Confirmed" && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
              <BookmarkX className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              <span className="sr-only">Cancel appointment</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel appointment</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this appointment? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p>Appointment #{id}</p>
              <div className="flex justify-between">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                <Button onClick={handleCancelAppointment} disabled={isLoading}>
                  {isLoading ? "Cancelling..." : "Accept"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
