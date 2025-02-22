/* eslint-disable @typescript-eslint/no-explicit-any */
import { CircleArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL, configHeaders } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";
import {
  AppointmentTemplate,
  Child,
  User,
} from "@/containers/Dashboard/Appointment";
import { getSlotString } from "@/lib/utils";
export interface AppointmentCreateForm {
  userId: string;
  name: string;
  childIds: number[];
  appointmentTemplateId: number;
  appointmentDate: string;
  appointmentSlot: number;
  notes: string;
  isDoctorCreate: boolean;
  description: string;
}

const AppointmentCreateContainer = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentCreateForm>({
    mode: "onChange",
  });
  const appointmentDate = watch("appointmentDate");
  const userId = watch("userId");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [users, setUsers] = useState<User[]>([]);
  const [availableSlots, setAvailableSlots] = useState<number[]>([]);

  const [childsOfUser, setChildsOfUser] = useState<Child[]>([]);
  const [appointmentTemplates, setAppointmentTemplates] = useState<
    AppointmentTemplate[]
  >([]);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]); // List of selected children

  const mapSlotsToTimeSlots = (slots: number[]) => {
    const timeSlotMap: Record<
      number,
      { id: number; start: string; end: string }
    > = {
      1: { id: 1, start: "07:00", end: "09:30" },
      2: { id: 2, start: "09:30", end: "12:00" },
      3: { id: 3, start: "12:00", end: "14:30" },
      4: { id: 4, start: "14:30", end: "17:00" },
    };

    return slots.map((slot) => timeSlotMap[slot]).filter(Boolean);
  };

  const handleAddChild = () => {
    // Add a new child selection placeholder

    setSelectedChildren((prev) => [...prev, ""]);
  };

  const handleRemoveChild = (index: number) => {
    // Remove a child from the selected list
    setSelectedChildren((prev) => {
      const newSelection = [...prev];
      newSelection.splice(index, 1);
      return newSelection;
    });
  };

  const handleSelectChild = (value: string, index: number) => {
    setSelectedChildren((prev) => {
      const newSelection = [...prev];

      // Check if the new value already exists in the array
      if (!newSelection.includes(value)) {
        newSelection[index] = value; // Update the current index with the new value
      } else {
        toast.error("Child already selected");
      }

      return newSelection;
    });
  };

  const getAvailableChildren = (index: number) => {
    const currentlySelected = selectedChildren[index];
    return childsOfUser.filter(
      (child) =>
        !selectedChildren.includes(child.id.toString()) ||
        child.id.toString() === currentlySelected
    );
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/get-all-user`);
      setUsers(response.data.resultObj);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };
  const fetchAppointmentTemplates = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/appointmenttemplates/get-all`
      );
      setAppointmentTemplates(response.data.resultObj);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };
  const fetchChildsOfUser = async (userId: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/child/get-child-by-user-id?id=${userId}`
      );
      setChildsOfUser(response.data.resultObj);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };
  const fetchAvailableSlots = async (date: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/appointments/get-available-slot?date=${date}`,
        {
          headers: configHeaders(),
        }
      );

      if (response.data.statusCode === 200) {
        let timeSlots = mapSlotsToTimeSlots(response.data.resultObj.slots);
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          setAvailableSlots([]);
        } else if (selectedDate.toDateString() === today.toDateString()) {
          const now = new Date();
          timeSlots = timeSlots.filter((slot) => {
            const [hours, minutes] = slot.end.split(":").map(Number);
            const slotEndTime = new Date();
            slotEndTime.setHours(hours, minutes, 0, 0);
            return slotEndTime > now;
          });
        }

        // Convert filtered `timeSlots` to an array of slot IDs
        const availableSlotIds = timeSlots.map((slot) => slot.id);

        setAvailableSlots(availableSlotIds);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch available slots.");
    }
  };

  useEffect(() => {
    if (appointmentDate) {
      fetchAvailableSlots(appointmentDate);
    }
  }, [appointmentDate]);

  useEffect(() => {
    if (userId) {
      fetchChildsOfUser(userId);
    }
  }, [userId]);
  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers(); // Lấy dữ liệu status
      await fetchAppointmentTemplates(); // Truyền dữ liệu status vào
    };
    fetchData();
  }, []);

  const onSubmit = async (data: AppointmentCreateForm) => {
    try {
      setIsLoading(true);
      const numericChildIds = data.childIds.map((id) => Number(id));

      const response = await axios.post(
        `${BASE_URL + API_ROUTES.DASHBOARD_APPOINTMENT_CREATE}`,
        {
          userId: data.userId,
          name: data.name,
          childIds: numericChildIds,
          appointmentTemplateId: data.appointmentTemplateId,
          appointmentDate: data.appointmentDate,
          appointmentSlot: data.appointmentSlot,
          notes: data.notes,
          isDoctorCreate: true,
          description: data.description,
        },
        {
          headers: configHeaders(),
        }
      );
      if (response.data.statusCode === 200) {
        window.location.href = `${ROUTES.DASHBOARD_APPOINTMENT}`;
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to create Appointment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="p-6">
        <Link to={ROUTES.DASHBOARD_APPOINTMENT}>
          <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700">
            <CircleArrowLeft />
            Back
          </Button>
        </Link>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Create appointment</h1>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
              <div>
                {/* Username Field */}
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10 w-1/6 ">
                    Appointment Name
                  </div>
                  <input
                    className="flex-1 p-2 bg-white"
                    {...register("name", {
                      required: "Appointment name is required",
                      minLength: {
                        value: 2,
                        message:
                          "Appointment name must be at least 2 characters",
                      },
                    })}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10 w-1/6  w-1/6">
                    Description
                  </div>
                  <textarea
                    className="flex-1 p-2 bg-white h-40"
                    {...register("description", {
                      minLength: {
                        value: 2,
                        message: "Description must be at least 2 characters",
                      },
                    })}
                  />
                </div>
                {errors.description && (
                  <p className="text-red-500">{errors.description.message}</p>
                )}
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10 w-1/6  w-1/6">
                    Note
                  </div>
                  <textarea
                    className="flex-1 p-2 bg-white h-40"
                    {...register("notes", {
                      minLength: {
                        value: 2,
                        message: "Note must be at least 2 characters",
                      },
                    })}
                  />
                </div>
                {errors.notes && (
                  <p className="text-red-500">{errors.notes.message}</p>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10 w-1/6 ">
                    Issue
                  </div>
                  <select
                    className="flex-1 p-2 bg-white w-64"
                    {...register("appointmentTemplateId", {
                      required: "Issue is required",
                    })}
                  >
                    <option value="">
                      {appointmentTemplates.length == 0
                        ? "No issue available"
                        : "Select issue"}
                    </option>
                    {appointmentTemplates.map((item: AppointmentTemplate) => (
                      <option value={item.id}>
                        Topic: {item.name} | Estimate Fee:{" "}
                        {Math.round(item.fee).toLocaleString()} VND
                      </option>
                    ))}
                  </select>
                </div>
                {errors.appointmentSlot && (
                  <p className="text-red-500">
                    {errors.appointmentSlot.message}
                  </p>
                )}
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10 w-1/6">
                    Appointment Date
                  </div>
                  <input
                    type="date"
                    className="flex-1 p-2"
                    {...register("appointmentDate", {
                      required: "Appointment date is required",
                      validate: (value) => {
                        const selectedDate = new Date(value);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
                        return (
                          selectedDate >= today ||
                          "Appointment date cannot be in the past"
                        );
                      },
                    })}
                  />
                </div>
                {errors.appointmentDate && (
                  <p className="text-red-500">
                    {errors.appointmentDate.message}
                  </p>
                )}
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10 w-1/6 ">
                    Appointment Slot
                  </div>
                  <select
                    className="flex-1 p-2 bg-white"
                    {...register("appointmentSlot", {
                      required: "Appointment slot is required",
                    })}
                  >
                    <option value="">
                      {availableSlots.length == 0
                        ? "No slot available"
                        : "Select available slot"}
                    </option>
                    {availableSlots?.map((slot: number) => (
                      <option value={slot}>{getSlotString(slot)}</option>
                    ))}
                  </select>
                </div>
                {errors.appointmentSlot && (
                  <p className="text-red-500">
                    {errors.appointmentSlot.message}
                  </p>
                )}
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10 w-1/6 ">
                    Customer
                  </div>
                  <select
                    className="flex-1 p-2 bg-white w-64"
                    {...register("userId", {
                      required: "Customer is required",
                    })}
                  >
                    <option value="">Select customer </option>
                    {users.map((user: User) => (
                      <option value={user.id}>
                        {user.fullName} |{" "}
                        {user.phoneNumber
                          ? user.phoneNumber
                          : "No phone number"}{" "}
                        |{" "}
                        {user.address
                          ? "Address: " + user.address
                          : "No address"}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.userId && (
                  <p className="text-red-500">{errors.userId.message}</p>
                )}
                <div className="bg-slate-100 rounded-md py-3 ">
                  <div className="mb-4 flex   bg-slate-100 rounded-md p-4">
                    <label className="block mb-2 mt-2 font-medium mr-10 w-1/6">
                      Childs &nbsp;
                      {selectedChildren.length === 0 && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <div className="gap-2">
                      {selectedChildren.map((child, index) => (
                        <div
                          key={index}
                          className="mx-2 mb-2 flex items-center space-x-2"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <div className="flex flex-col ">
                            <select
                              {...register(`childIds.${index}`, {
                                required: "Child is required", // Validate required
                              })}
                              className="bg-white p-2 rounded mr-2 w-64"
                              value={child || ""}
                              onChange={(e) =>
                                handleSelectChild(e.target.value, index)
                              }
                            >
                              <option value="" disabled>
                                Select a child
                              </option>
                              {getAvailableChildren(index).map((child) => (
                                <option key={child.id} value={child.id}>
                                  {child.name}
                                </option>
                              ))}
                            </select>
                            {errors.childIds?.[index] && (
                              <span className="text-red-500 text-sm">
                                {errors.childIds[index].message}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            className="bg-red-400"
                            onClick={() => handleRemoveChild(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleAddChild}
                      disabled={selectedChildren.length >= childsOfUser.length}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                    >
                      Thêm trẻ em
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end mt-10 mr-10">
              <Button
                disabled={isLoading}
                className="bg-sky-900 hover:bg-sky-700 text-emerald-400 px-10 py-6 text-xl"
                type="submit"
              >
                {isLoading && <AiOutlineLoading className="animate-spin" />}
                Save
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AppointmentCreateContainer;
