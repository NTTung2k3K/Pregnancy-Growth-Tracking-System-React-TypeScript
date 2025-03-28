import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, ChevronRight, CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CookiesService } from "@/services/cookies.service";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { getSlotString } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { AppointmentTemplate, Child } from "@/containers/Dashboard/Appointment";

export const timeSlots = [
  { id: 1, start: "07:00", end: "09:30" },
  { id: 2, start: "09:30", end: "12:00" },
  { id: 3, start: "12:00", end: "14:30" },
  { id: 4, start: "14:30", end: "17:00" },
];
export const timeSlotsStartHours = [
  { id: 1, startHour: 7, label: "07:00 - 09:30" },
  { id: 2, startHour: 9.5, label: "09:30 - 12:00" },
  { id: 3, startHour: 12, label: "12:00 - 14:30" },
  { id: 4, startHour: 14.5, label: "14:30 - 17:00" },
];
export default function AppointmentBookingContainer() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedChildren, setSelectedChildren] = useState<number[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [appointmentTemplates, setAppointmentTemplates] = useState<
    AppointmentTemplate[]
  >([]);
  const [name, setName] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<
    { id: number; start: string; end: string }[]
  >([]);
  const [isLoadingSlot, setIsLoadingSlot] = useState(false);

  const fetchChilds = async () => {
    try {
      setIsLoadingData(true);
      const userId = CookiesService.get();

      if (!userId) {
        toast.error("User ID not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/child/get-child-by-user-id`,
        {
          params: { id: userId },
        }
      );

      if (response.data.isSuccessed) {
        setChildren(response.data.resultObj);
      } else {
        toast.error("Failed to fetch children");
      }
    } catch (error) {
      toast.error("Failed to fetch children");
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchAppointmentTemplates = async () => {
    try {
      setIsLoadingData(true);
      const response = await axios.get(
        `${BASE_URL}/appointmenttemplates/get-all`
      );

      if (response.data.isSuccessed) {
        setAppointmentTemplates(response.data.resultObj);
      } else {
        toast.error("Failed to fetch appointment templates");
      }
    } catch (error) {
      toast.error("Failed to fetch appointment templates");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchChilds(), fetchAppointmentTemplates()]);
    };
    fetchData();
  }, []);

  const handleChildToggle = (childId: number) => {
    setSelectedChildren((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId]
    );
  };

  const handleSubmit = async () => {
    try {
      const userId = CookiesService.get();
      if (!userId) {
        toast.error("Please login again to booking");
        return;
      }

      if (!selectedTemplate) {
        toast.error("Please select an appointment type");
        return;
      }

      if (!selectedDate) {
        toast.error("Please select a date");
        return;
      }

      if (!name.trim()) {
        toast.error("Please enter appointment name");
        return;
      }

      if (!notes.trim()) {
        toast.error("Please enter notes about the appointment");
        return;
      }

      setIsLoading(true);

      const appointmentData = {
        userId,
        name: name.trim(),
        childIds: selectedChildren,
        appointmentTemplateId: Number.parseInt(selectedTemplate),
        appointmentDate: selectedDate,
        appointmentSlot: Number.parseInt(selectedSlot),
        notes: notes.trim(),
        description: description.trim(),
        isDoctorCreate: false,
      };

      const response = await axios.post(
        `${BASE_URL}/appointments/create`,
        appointmentData
      );

      if (response.data.isSuccessed) {
        toast.success("Appointment booked successfully");
        // Redirect to history page
        window.location.href = "/appointment/history";
      } else {
        toast.error(response.data.message || "Failed to book appointment");
      }
    } catch (error) {
      toast.error("Failed to book appointment");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const localDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      setSelectedDate(localDate);
      handleDoctorFullSlot(localDate);
      setSelectedSlot("");
    }
  };

  const handleDoctorFullSlot = async (date: Date | undefined) => {
    setIsLoadingSlot(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/appointments/get-available-slot-user`,
        {
          params: { date: date },
        }
      );

      const availableSlotIds = response.data; // Example: [2, 3, 4]

      const availableTimeSlots = timeSlots.filter((slot) =>
        availableSlotIds.includes(slot.id)
      );

      setAvailableTimeSlots(availableTimeSlots);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoadingSlot(false); // Stop loading after fetching
    }
  };

  const isSlotDisabled = (
    selectedDate: Date | undefined,
    startTime: string
  ): boolean => {
    if (!selectedDate) return false; // No date selected yet

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0); // Start of selected date

    // If selected date is in the future, enable all slots
    if (selected > today) return false;

    // If selected date is today, check startTime
    if (selected.getTime() === today.getTime()) {
      const [hours, minutes] = startTime.split(":").map(Number);
      const slotStartDateTime = new Date();
      slotStartDateTime.setHours(hours, minutes, 0, 0);

      return now > slotStartDateTime; // Disable if the slot's start time has passed
    }

    return false;
  };

  if (isLoadingData) {
    return <div className="flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="p-10">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-sky-800">
            Book Development Tracking Appointment
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="flex items-center justify-center text-lg font-semibold text-sky-800">
                  Select children
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  {children.map((child) => (
                    <Button
                      key={child.id}
                      variant={
                        selectedChildren.includes(child.id)
                          ? "custom"
                          : "outline"
                      }
                      className="h-20 relative"
                      onClick={() => handleChildToggle(child.id)}
                      disabled={isLoading}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={
                              child.photoUrl ||
                              "https://static.vecteezy.com/system/resources/previews/021/095/586/original/cartoon-kid-reaching-boy-free-png.png"
                            }
                            alt={child.name}
                          />
                        </Avatar>
                        {child.name}
                      </div>
                      {selectedChildren.includes(child.id) && (
                        <Check className="absolute top-2 right-2 h-4 w-4" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
              <Button
                className="w-full mt-6"
                variant={selectedChildren.length === 0 ? "outline" : "custom"}
                onClick={() => setStep(2)}
                disabled={selectedChildren.length === 0 || isLoading}
              >
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-lg font-semibold">
                  Appointment Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter appointment name"
                  className="mt-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <Label className="text-lg font-semibold">
                  Appointment type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedTemplate}
                  onValueChange={setSelectedTemplate}
                  disabled={isLoading}
                >
                  <SelectTrigger className="mt-3">
                    <SelectValue placeholder="Select type for appointment" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTemplates.map((template) => (
                      <SelectItem
                        key={template.id}
                        value={template.id.toString()}
                      >
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-lg font-semibold">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full mt-3 justify-start text-left font-normal"
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate
                        ? selectedDate.toLocaleDateString("vi-VN")
                        : "Select day"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-lg font-semibold">
                  Time slot <span className="text-red-500">*</span>
                </Label>
                {isLoadingSlot ? (
                  <div className="text-center text-blue-500 font-semibold mt-3">
                    Loading available slots...
                  </div>
                ) : (
                  <RadioGroup
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3"
                    value={selectedSlot}
                    onValueChange={setSelectedSlot}
                    disabled={isLoading}
                  >
                    {availableTimeSlots.map((slot) => {
                      const isDisabled = isSlotDisabled(
                        selectedDate,
                        slot.start
                      );
                      return (
                        <div
                          key={slot.id}
                          className={
                            isDisabled ? "opacity-50 cursor-not-allowed" : ""
                          }
                        >
                          <RadioGroupItem
                            value={slot.id.toString()}
                            id={`slot-${slot.id}`}
                            className="peer sr-only"
                            disabled={isDisabled}
                          />
                          <Label
                            htmlFor={`slot-${slot.id}`}
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            {getSlotString(slot.id)}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-lg font-semibold">
                    Notes <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    placeholder="Enter notes about the child's condition"
                    className="mt-3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label className="text-lg font-semibold">Description</Label>
                  <Textarea
                    placeholder="Detailed description of concerns or symptoms"
                    className="mt-3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={
                    !selectedDate ||
                    !selectedSlot ||
                    !selectedTemplate ||
                    !name.trim() ||
                    !notes.trim() ||
                    isLoading
                  }
                  variant="custom"
                >
                  {isLoading ? "Booking..." : "Confirm Appointment"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
