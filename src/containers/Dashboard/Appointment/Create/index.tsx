import { IconBadge } from "@/components/IconBadge";
import { CircleArrowLeft, Image, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL, configHeaders } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarOverlay } from "./components/AvatarOverlay";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";
import {
  Appointment,
  AppointmentTemplate,
  Child,
  User,
} from "@/containers/Dashboard/Appointment";
import { set } from "date-fns";
export interface AppointmentCreateForm {
  userId: string;
  name: string;
  childId: number;
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

  const [imageTemp, setImageTemp] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<string | undefined>(
    undefined
  );

  const [users, setUsers] = useState<User[]>([]);
  const [availableSlots, setAvailableSlots] = useState<number[]>([]);

  const [childsOfUser, setChildsOfUser] = useState<Child[]>([]);
  const [appointmentTemplates, setAppointmentTemplates] = useState<
    AppointmentTemplate[]
  >([]);

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
        setAvailableSlots(response.data.resultObj);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
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
      const response = await axios.post(
        `${BASE_URL + API_ROUTES.DASHBOARD_APPOINTMENT_CREATE}`,
        {
          userId: data.userId,
          name: data.name,
          childId: data.childId,
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
                    className="flex-1 p-2 bg-white"
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
                    className="flex-1 p-2 "
                    {...register("appointmentDate", {
                      required: "Appointment date is required",
                      validate: (value) =>
                        new Date(value) > new Date() ||
                        "Appointment date cannot be in the past",
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
                    {availableSlots?.slots?.map((slot: number) => (
                      <option value={slot}>{slot}</option>
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
                    className="flex-1 p-2 bg-white"
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
                <div>
                  <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                    <div className="font-medium flex items-center mr-10 w-1/6 ">
                      Child
                    </div>
                    <select
                      className="flex-1 p-2 bg-white"
                      {...register("childId", {
                        required: "Child is required",
                      })}
                    >
                      <option value="">
                        {childsOfUser.length == 0
                          ? "No child available"
                          : "Select child"}
                      </option>
                      {childsOfUser.map((item: Child) => (
                        <option value={item.id}>
                          Name: {item.name} | Blood type: {item.bloodType}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {errors.childId && (
                  <p className="text-red-500">{errors.childId.message}</p>
                )}
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
