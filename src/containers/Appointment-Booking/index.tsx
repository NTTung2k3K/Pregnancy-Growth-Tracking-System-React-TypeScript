"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
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
import type {
  Child,
  AppointmentTemplate,
  CreateAppointmentRequest,
} from "../types/appointment";
import { getSlotString } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const timeSlots = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

export default function AppointmentBookingContainer() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedChildren, setSelectedChildren] = useState<number[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [appointmentTemplates, setAppointmentTemplates] = useState<
    AppointmentTemplate[]
  >([]);
  const [name, setName] = useState("");

  const fetchChilds = async () => {
    try {
      setIsLoading(true);
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
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch children");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAppointmentTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_URL}/appointmenttemplates/get-all`
      );

      if (response.data.isSuccessed) {
        setAppointmentTemplates(response.data.resultObj);
      } else {
        toast.error("Failed to fetch appointment templates");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch appointment templates"
      );
    } finally {
      setIsLoading(false);
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
        toast.error("User ID not found. Please login again.");
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

      const appointmentData: CreateAppointmentRequest = {
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
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to book appointment"
      );
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Book Development Tracking Appointment
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="text-lg font-semibold">Select children</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  {children.map((child) => (
                    <Button
                      key={child.id}
                      variant={
                        selectedChildren.includes(child.id)
                          ? "default"
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
                      //   disabled={(date) =>
                      //     date < new Date() ||
                      //     date.getDay() === 0 ||
                      //     date.getDay() === 6
                      //   }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-lg font-semibold">
                  Time slot <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3"
                  value={selectedSlot}
                  onValueChange={setSelectedSlot}
                  disabled={isLoading}
                >
                  {timeSlots.map((slot) => (
                    <div key={slot.id}>
                      <RadioGroupItem
                        value={slot.id.toString()}
                        id={`slot-${slot.id}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`slot-${slot.id}`}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        {getSlotString(slot.id)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
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
