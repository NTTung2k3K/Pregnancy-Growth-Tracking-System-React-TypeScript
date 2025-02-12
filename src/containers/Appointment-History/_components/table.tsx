

import { useState, useEffect, useCallback } from "react";
import { Calendar } from "lucide-react";
import { isAfter } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { appointmentService } from "@/routes/api/services/appointment-api";
import { CookiesService } from "@/services/cookies.service";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { AppointmentActions } from "@/containers/Appointment-History/_components/appointment-actions";
export interface AppointmentStatusType {
  id: number;
  status: string;
}
export interface AppointmentResponseModel {
  id: number;
  appointmentSlot: number;
  appointmentDate: string;
  status: string;
  fee: number;
  notes: string;
  result: any;
  description: any;
  name: string;
  user: User;
  doctors: any[];
  appointmentTemplate: AppointmentTemplate;
  childs: Child[];
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  image: any;
  dateOfBirth: any;
  address: any;
  phoneNumber: string;
  gender: string;
  bloodGroup: any;
  status: string;
  createdBy: any;
  isEmailConfirmed: any;
  lastUpdatedBy: any;
  childs: any;
}

export interface AppointmentTemplate {
  id: number;
  name: string;
  daysFromBirth: number;
  description: string;
  status: string;
  image: string;
  fee: number;
}

export interface Child {
  id: number;
  userId: string;
  name: string;
  fetalGender: any;
  pregnancyStage: any;
  weightEstimate: any;
  heightEstimate: any;
  dueDate: string;
  deliveryPlan: any;
  complications: any;
  photoUrl: any;
  bloodType: any;
  pregnancyWeekAtBirth: any;
}

export default function AppointmentManagement() {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [status, setStatus] = useState("ALL");
  const [statusOptions, setStatusOptions] = useState<AppointmentStatusType[]>(
    []
  );
  const [sortBy, setSortBy] = useState("appointmentDate");
  const [isDescending, setIsDescending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [appointments, setAppointments] = useState<AppointmentResponseModel[]>(
    []
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const sortOptions = [
    { value: "appointmentDate", label: "Appointment Date" },
    { value: "name", label: "Name" },
    // { value: "status", label: "Status" },
    { value: "fee", label: "Fee" },
  ];

  // Fetch status options when component mounts
  useEffect(() => {
    const fetchStatusOptions = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/appointments/get-appointment-status-handler`
        );
        setStatusOptions(response.data.resultObj);
      } catch (error) {
        if (error instanceof Error) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("An unknown error occurred");
          }
        } else {
          toast.error("An unknown error occurred");
        }
      }
    };

    fetchStatusOptions();
  }, []);

  const validateDateRange = () => {
    if (fromDate && toDate && isAfter(fromDate, toDate)) {
      toast.error("From date must be before or equal to To date");
      return false;
    }
    return true;
  };

  const fetchAppointments = useCallback(async () => {
    try {
      if (fromDate && toDate && !validateDateRange()) {
        return;
      }

      setIsLoading(true);
      const userId = CookiesService.get();

      if (!userId) {
        toast.error("User ID not found. Please login again.");
        return;
      }

      const response = await appointmentService.getAppointments({
        userId,
        searchValue: search,
        fromDate,
        toDate,
        status: status,
        sortBy,
        isDescending,
        pageIndex: currentPage,
        pageSize,
      });

      if (response.isSuccessed) {
        setAppointments(response.resultObj.items);
        setTotalRecords(response.resultObj.totalItems);
      } else {
        toast.error("Failed to fetch appointments");
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred");
        }
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    search,
    fromDate,
    toDate,
    status,
    sortBy,
    isDescending,
    currentPage,
    pageSize,
  ]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAppointments();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]); // Chỉ chạy lại khi `search` thay đổi

  // Fetch on filter/sort/page change
  useEffect(() => {
    fetchAppointments();
  }, [fromDate, toDate, status, sortBy, isDescending, currentPage]); // Không cần `fetchAppointments` trong dependency nữa

  const handleDateChange = (type: "from" | "to", date: Date | undefined) => {
    if (date) {
      // Đặt giờ thành 12:00:00 trưa để tránh bị lùi ngày do múi giờ
      const adjustedDate = new Date(date);
      adjustedDate.setHours(12, 0, 0, 0);

      if (type === "from") {
        setFromDate(adjustedDate);
      } else {
        setToDate(adjustedDate);
      }
    }
  };

  const getStatusColor = (statusName: string) => {
    switch (statusName) {
      case "Completed":
        return "text-green-500";
      case "Pending":
        return "text-yellow-500";
      case "NoShow":
      case "Failed":
      case "CancelledByUser":
      case "CancelledByDoctor":
        return "text-red-500";
      case "InProgress":
        return "text-blue-500";
      case "Confirmed":
        return "text-violet-500";
      case "Rescheduled":
        return "text-pink-500";
      default:
        return "text-blue-800";
    }
  };
  const [isFromDateOpen, setIsFromDateOpen] = useState(false);
  const [isToDateOpen, setIsToDateOpen] = useState(false);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pregnancy Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search appointments or children..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <Popover open={isFromDateOpen} onOpenChange={setIsFromDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {fromDate
                        ? fromDate.toLocaleDateString("vi-VN")
                        : "From Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={fromDate}
                      onSelect={(date) => {
                        handleDateChange("from", date);
                        setIsFromDateOpen(false); // Close popover after selection
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover open={isToDateOpen} onOpenChange={setIsToDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {toDate ? toDate.toLocaleDateString("vi-VN") : "To Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={toDate}
                      onSelect={(date) => {
                        handleDateChange("to", date);
                        setIsToDateOpen(false); // Close popover after selection
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue>Sort by status</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem
                      key={option.id}
                      value={option.id === -1 ? "ALL" : option.id.toString()}
                    >
                      {option.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue>Sort by fields</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setIsDescending(!isDescending)}
                  className="px-3"
                >
                  {isDescending ? "↓" : "↑"}
                </Button>
              </div>
            </div>

            {/* Appointments Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Appointment Date</TableHead>
                    <TableHead>Children</TableHead>
                    <TableHead>Doctors</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Fee</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : appointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No appointments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">
                          {appointment.name}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell>
                          {appointment.childs
                            .map((child) => child?.name)
                            .join(", ")}
                        </TableCell>
                        <TableCell>
                          {appointment.doctors
                            .map((doctor) => doctor.fullName)
                            .join(", ")}
                        </TableCell>
                        <TableCell>
                          <div
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {Math.round(appointment.fee).toLocaleString()} VNĐ
                        </TableCell>
                        <TableCell className="text-right">
                          <AppointmentActions
                            key={appointment.id}
                            id={appointment.id.toString()}
                            status={appointment.status}
                            fetchAPI={fetchAppointments}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing page {currentPage} of{" "}
                {Math.ceil(totalRecords / pageSize)}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1 || isLoading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={
                    currentPage >= Math.ceil(totalRecords / pageSize) ||
                    isLoading
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
