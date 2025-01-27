import { IconBadge } from "@/components/IconBadge";
import { CircleArrowLeft, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL, configHeaders } from "@/services/config";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
import { ROUTES } from "@/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarOverlay } from "@/containers/Dashboard/Appointment/Create/components/AvatarOverlay";
import { log } from "console";
import { Appointment } from "@/containers/Dashboard/Appointment";
import { Status } from "@/containers/Dashboard/MembershipPackage/Create";

export interface AppointmentUpdateForm {
  id: number;
  userId: string;
  childId: number;
  name: string;
  fee: number;
  appointmentDate: string;
  status: number;
  appointmentSlot: number;
  appointmentTemplateId: number;
  notes: string;
  isDoctorUpdate: boolean;
  result: string;
  description: string;
}
const AppointmentUpdateContainer = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AppointmentUpdateForm>({
    mode: "onChange",
  });
  const [displayValue, setDisplayValue] = useState(""); // Giá trị hiển thị trong input

  const { id } = useParams();
  const [appointment, setAppointment] = useState<Appointment>();

  const [status, setStatus] = useState<Status[]>([]);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/appointments/get-appointment-status-handler`
      );
      setStatus(response.data.resultObj);
      return response.data.resultObj;
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchAppointment = async (statusData: any) => {
    try {
      const response = await axios.get(`${BASE_URL}/appointments/get-by-id`, {
        params: { id: id },
      });
      const fetchedAppointment = response.data.resultObj;

      // Set form values using setValue
      setValue("id", fetchedAppointment.id || "");
      setValue("userId", fetchedAppointment.userId || "");
      setValue("name", fetchedAppointment.name || "");
      setValue("childId", fetchedAppointment.childId || "");
      setValue(
        "appointmentTemplateId",
        fetchedAppointment.appointmentTemplateId
      );
      setValue("appointmentDate", fetchedAppointment.appointmentDate || "");
      setValue("appointmentSlot", fetchedAppointment.appointmentSlot || "");
      setValue("notes", fetchedAppointment.notes || "");
      setValue("description", fetchedAppointment.description || "");
      setValue("isDoctorUpdate", fetchedAppointment.isDoctorUpdate || false);
      setValue("result", fetchedAppointment.result || "");
      setValue("fee", fetchedAppointment.fee || "");

      const statusId = statusData.find(
        (x) => x.status === fetchedAppointment.status
      )?.id;

      setValue("status", statusId?.toString() || "0");
      setDisplayValue(formatNumber(fetchedAppointment.fee.toString()));
      setAppointment(fetchedAppointment);
    } catch (error) {
      console.error("Failed to fetch Appointment:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const statusData = await fetchStatus(); // Lấy dữ liệu status
      if (statusData) {
        await fetchAppointment(statusData); // Truyền dữ liệu status vào
      }
    };
    fetchData();
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formatNumber = (value: string) => {
    if (!value) return "";
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const unformatNumber = (value: string) => {
    if (!value) return "";
    return value.replace(/\./g, "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Block spacing character
    if (inputValue.includes(" ")) return;

    // Loại bỏ ký tự không phải số
    const rawValue = unformatNumber(inputValue);

    // Không cho phép hiển thị chuỗi quá dài
    if (rawValue.length > 15) return;

    // Định dạng lại và cập nhật giá trị hiển thị
    setDisplayValue(formatNumber(rawValue));
  };

  const onSubmit = async (data: AppointmentUpdateForm) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${BASE_URL}/Appointments/update`,
        {
          id: data.id,
          userId: data.userId,
          childId: data.childId,
          name: "string",
          fee: 0,
          appointmentDate: "2025-01-27T16:53:53.998Z",
          status: 0,
          appointmentSlot: 0,
          appointmentTemplateId: 0,
          notes: "string",
          isDoctorUpdate: true,
          result: "string",
          description: "string",
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
      console.error("Failed to update Appointment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mt-10">
        <Link className="p-6" to={ROUTES.DASHBOARD_APPOINTMENT}>
          <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700">
            <CircleArrowLeft />
            Back
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Update appointment</h1>
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
                      message: "Appointment name must be at least 2 characters",
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
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10 w-1/6  w-1/6">
                  Result
                </div>
                <textarea
                  className="flex-1 p-2 bg-white h-40"
                  {...register("result", {
                    required: "Result is required",
                    minLength: {
                      value: 2,
                      message: "Result must be at least 2 characters",
                    },
                  })}
                />
              </div>
              {errors.result && (
                <p className="text-red-500">{errors.result.message}</p>
              )}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10 w-1/6 ">
                  Status
                </div>
                <select
                  className="flex-1 p-2 bg-white"
                  {...register("status", {
                    required: "Status is required",
                  })}
                >
                  <option value="">Select status</option>
                  {status.map((item) => (
                    <option value={item.id}>{item.status}</option>
                  ))}
                </select>
              </div>
              {errors.status && (
                <p className="text-red-500">{errors.status.message}</p>
              )}
              {appointment?.doctors.map((doctor) => (
                <>
                  <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                    <div className="font-medium flex items-center mr-10 w-1/6 ">
                      Doctor name
                    </div>
                    <input
                      className="flex-1 p-2 bg-gray-100"
                      value={doctor.fullName}
                      disabled
                    />
                  </div>
                  <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                    <div className="font-medium flex items-center mr-10 w-1/6 ">
                      Doctor phone number
                    </div>
                    <input
                      className="flex-1 p-2 bg-gray-100"
                      value={doctor.phoneNumber}
                      disabled
                    />
                  </div>
                </>
              ))}
            </div>

            <div className="space-y-6">
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10 w-1/6 ">
                  Issue
                </div>
                <input
                  className="flex-1 p-2 bg-gray-100"
                  value={appointment?.appointmentTemplate.name}
                  disabled
                />
              </div>
              {errors.appointmentSlot && (
                <p className="text-red-500">{errors.appointmentSlot.message}</p>
              )}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10 w-1/6  w-1/6">
                  Fee
                </div>
                <input
                  {...register("fee", {
                    required: "Fee is required",
                  })}
                  className="flex-1 p-2 bg-white"
                  value={displayValue} // Hiển thị giá trị định dạng
                  onChange={handleInputChange} // Xử lý khi người dùng nhập
                  onBlur={
                    (e) => register("fee").onBlur(e) // Gọi hàm onBlur mặc định của react-hook-form nếu cần
                  }
                />
              </div>
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10 w-1/6">
                  Appointment Date
                </div>
                <input
                  type="text"
                  value={new Date(
                    appointment?.appointmentDate
                  ).toLocaleDateString("vi-VN")}
                  disabled
                  className="bg-gray-100 p-2 w-full"
                />
              </div>
              {errors.appointmentDate && (
                <p className="text-red-500">{errors.appointmentDate.message}</p>
              )}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10 w-1/6 ">
                  Appointment Slot
                </div>
                <input
                  type="text"
                  value={appointment?.appointmentSlot}
                  disabled
                  className="bg-gray-100 p-2 w-full"
                />
              </div>
              {errors.appointmentSlot && (
                <p className="text-red-500">{errors.appointmentSlot.message}</p>
              )}
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10 w-1/6 ">
                  Customer name
                </div>
                <input
                  className="flex-1 p-2 bg-gray-100"
                  value={appointment?.user.fullName}
                  disabled
                />
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10 w-1/6 ">
                  Customer phone number
                </div>
                <input
                  className="flex-1 p-2 bg-gray-100"
                  value={appointment?.user.phoneNumber}
                  disabled
                />
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10 w-1/6 ">
                  Customer address
                </div>
                <input
                  className="flex-1 p-2 bg-gray-100"
                  value={appointment?.user.address}
                  disabled
                />
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10 w-1/6 ">
                  Customer email
                </div>
                <a
                  href={`mailto:${appointment?.user.email}`}
                  type="email"
                  className="flex-1 p-2 bg-gray-100"
                >
                  {appointment?.user.email}
                </a>
              </div>
              {appointment?.childs.map((child) => (
                <div>
                  <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                    <div className="font-medium flex items-center mr-10 w-1/6 ">
                      Child name
                    </div>
                    <input
                      className="flex-1 p-2 bg-gray-100"
                      value={child.name}
                      disabled
                    />
                  </div>
                  {/* dueDate */}
                  <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                    <div className="font-medium flex items-center mr-10 w-1/6 ">
                      Due date
                    </div>
                    <input
                      className="flex-1 p-2 bg-gray-100"
                      value={new Date(child.dueDate).toLocaleDateString(
                        "vi-VN"
                      )}
                      disabled
                    />
                  </div>
                  <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                    <div className="font-medium flex items-center mr-10 w-1/6 ">
                      Pregnancy week at birth
                    </div>
                    <input
                      className="flex-1 p-2 bg-gray-100"
                      value={child.pregnancyWeekAtBirth}
                      disabled
                    />
                  </div>
                </div>
              ))}
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
  );
};

export default AppointmentUpdateContainer;
