import { IconBadge } from "@/components/IconBadge";
import {
  Baby,
  BadgeAlert,
  BriefcaseMedicalIcon,
  CircleArrowLeft,
  FileUser,
  SquareMousePointer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL, configHeaders } from "@/services/config";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
import { ROUTES } from "@/routes";
import { Appointment } from "@/containers/Dashboard/Appointment";
import { Status } from "@/containers/Dashboard/MembershipPackage/Create";
import { GrowthCharts } from "@/containers/Dashboard/Appointment/components/chart-record";
import { getSlotString } from "@/lib/utils";
import { API_ROUTES } from "@/routes/api";
import { Standard } from "../../Standard/components/IStandard";

export interface AppointmentUpdateForm {
  id: number;
  userId: string;
  childsUpdated: ChildsUpdated[];
  name: string;
  fee: number;
  status: number;
  notes: string;
  weekOfPregnancy: number;
  healthCondition: string;
  result: string;
  description: string;
}

export interface ChildsUpdated {
  childId: number;
  weekOfPregnancy: number;
  weight: number;
  height: number;
  headCircumference: number;
  abdominalCircumference: number;
  fetalHeartRate: number | null;
  healthCondition: string;
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
  const navigate = useNavigate();

  const { id } = useParams();
  const [appointment, setAppointment] = useState<Appointment>();
  const [doctors, setDoctors] = useState([]);

  const [status, setStatus] = useState<Status[]>([]);

  const role = localStorage.getItem("role");
  const isAdmin = role === "Admin";
  const [reason, setReason] = useState<string>();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [standard, setStandard] = useState<Standard>();

  const [isWeekSelected, setIsWeekSelected] = useState(false);

  const [warnings, setWarnings] = useState<{ [key: string]: string }>({});
  const [maxStandard, setMaxStandard] = useState<Standard>();
  const [minStandard, setMinStandard] = useState<Standard>();

  const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedWeek = e.target.value;
    setIsWeekSelected(!!selectedWeek); // Update the state based on selection
    fetchStandard(parseInt(selectedWeek));
  };

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
  const fetchStandard = async (week: number) => {
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.DASHBOARD_DOCTOR_APPOINTMENT_STANDARD_WEEK}`,
        {
          params: { week: week },
        }
      );
      setStandard(response.data.resultObj);

      console.log(response.data.resultObj);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };
  const fetchMinStandard = async (week: number) => {
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.DASHBOARD_DOCTOR_APPOINTMENT_STANDARD_WEEK}`,
        {
          params: { week: week },
        }
      );
      setMinStandard(response.data.resultObj);

      console.log(response.data.resultObj);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };
  const fetchMaxStandard = async (week: number) => {
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.DASHBOARD_DOCTOR_APPOINTMENT_STANDARD_WEEK}`,
        {
          params: { week: week },
        }
      );
      setMaxStandard(response.data.resultObj);

      console.log(response.data.resultObj);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchAppointment = async (statusData: Status[]) => {
    try {
      const response = await axios.get(`${BASE_URL}/appointments/get-by-id`, {
        params: { id: id },
      });

      const fetchedAppointment = response.data.resultObj;

      // Set form values using setValue
      setValue("id", fetchedAppointment.id || "");
      setValue("userId", fetchedAppointment.user.id || "");
      setValue("name", fetchedAppointment.name || "");
      setValue("notes", fetchedAppointment.notes || "");
      setValue("description", fetchedAppointment.description || "");
      setValue("result", fetchedAppointment.result || "");
      setValue("fee", fetchedAppointment.fee || "");
      setValue("status", fetchedAppointment.status || "");

      const statusId = statusData.find(
        (x) => x.status === fetchedAppointment.status
      )?.id;
      setValue("status", statusId || 0);
      setDisplayValue(formatNumber(fetchedAppointment?.fee?.toString() ?? 0));
      setAppointment(fetchedAppointment);
      setReason(fetchedAppointment.appoinmentUsers[0].reason);
    } catch (error) {
      console.error("Failed to fetch Appointment:", error);
    }
  };
  const fetchDoctor = async () => {
    const response = await axios.get(
      `${BASE_URL + API_ROUTES.DASHBOARD_APPOINTMENT_DOCTOR_FREE}`,
      {
        params: { appointmentId: id },
      }
    );
    const formattedResult = response.data.resultObj.map((item: any) => ({
      ...item,
    }));
    setDoctors(formattedResult || []);
  };
  useEffect(() => {
    const fetchData = async () => {
      const statusData = await fetchStatus(); // Lấy dữ liệu status
      if (statusData) {
        await fetchAppointment(statusData); // Truyền dữ liệu status vào
        await fetchMinStandard(1);
        await fetchMaxStandard(41);
      }
      fetchDoctor();
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
        `${BASE_URL}/appointments/update-by-doctor`,
        {
          id: data.id,
          userId: data.userId,
          childsUpdated: data.childsUpdated,
          name: data.name,
          fee: unformatNumber(displayValue),
          status: data.status,
          notes: data.notes,
          result: data.result,
          description: data.description,
        },
        {
          headers: configHeaders(),
        }
      );
      if (response.data.statusCode === 200) {
        window.location.reload();
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
  const onUpdateDoctor = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (reason && selectedDoctorId) {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${BASE_URL + API_ROUTES.DASHBOARD_APPOINTMENT_CHANGE_DOCTOR}`,
          {
            doctorId: selectedDoctorId,
            appointmentId: id,
            reason: reason,
          },
          {
            headers: configHeaders(),
          }
        );
        if (response.data.statusCode === 200) {
          if (!id) {
            console.error("ID is undefined or null");
            return;
          }
          navigate(
            ROUTES.DASHBOARD_APPOINTMENT_DETAIL.replace(":id", id.toString())
          );
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Failed to update Appointment:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Doctor or Reason is required");
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
              <h1 className="text-2xl font-medium">
                {isAdmin ? "Change Doctor" : "Examination Child"}
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
            <div>
              {/* Username Field */}
              <div className="flex items-center gap-x-2 my-5">
                <IconBadge icon={SquareMousePointer} />
                <h2 className="text-xl text-sky-900 font-semibold">
                  Appointment information
                </h2>
              </div>
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
                <div className="font-medium flex items-center mr-10   w-1/6">
                  Description
                </div>
                <textarea
                  disabled={isAdmin}
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
                <div className="font-medium flex items-center mr-10 w-1/6 ">
                  Note
                </div>
                <textarea
                  disabled={isAdmin}
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
                <div className="font-medium flex items-center mr-10 w-1/6  ">
                  Result
                </div>
                <textarea
                  disabled={isAdmin}
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
                <div className="font-medium flex items-center mr-10 w-1/6">
                  Appointment Date
                </div>
                <input
                  type="text"
                  value={new Date(
                    appointment?.appointmentDate || new Date()
                  ).toLocaleDateString("vi-VN")}
                  disabled
                  className="bg-gray-100 p-2 w-full"
                />
              </div>

              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10 w-1/6 ">
                  Appointment Slot
                </div>
                <input
                  type="text"
                  value={getSlotString(appointment?.appointmentSlot ?? 1)}
                  disabled
                  className="bg-gray-100 p-2 w-full"
                />
              </div>

              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10 w-1/6 ">
                  Status
                </div>
                <select
                  disabled={isAdmin}
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
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-x-2 my-5">
                <IconBadge icon={BadgeAlert} />
                <h2 className="text-xl text-sky-900 font-semibold">Issue</h2>
              </div>
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

              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10 w-1/6">
                  Fee
                </div>
                <input
                  disabled={isAdmin}
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
              {errors.fee && (
                <p className="text-red-500">{errors.fee.message}</p>
              )}
              {appointment?.appoinmentUsers.map((item) => (
                <>
                  <div className="flex items-center gap-x-2 my-5">
                    <IconBadge icon={BriefcaseMedicalIcon} />
                    <h2 className="text-xl text-sky-900 font-semibold">
                      Doctor
                    </h2>
                  </div>
                  <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                    <div className="font-medium flex items-center mr-10 w-1/6 ">
                      Doctor name
                    </div>
                    <input
                      className="flex-1 p-2 bg-gray-100"
                      value={item.doctor.fullName}
                      disabled
                    />
                  </div>
                  <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                    <div className="font-medium flex items-center mr-10 w-1/6 ">
                      Doctor phone number
                    </div>
                    <input
                      className="flex-1 p-2 bg-gray-100"
                      value={item.doctor.phoneNumber}
                      disabled
                    />
                  </div>

                  {isAdmin && (
                    <>
                      <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                        <div className="font-medium flex items-center mr-10 w-1/6 ">
                          Other Doctor
                        </div>
                        <select
                          className="flex-1 p-2 bg-white border rounded-md"
                          value={selectedDoctorId || ""}
                          onChange={(event) =>
                            setSelectedDoctorId(event.target.value)
                          }
                        >
                          <option value="" disabled>
                            Select a doctor
                          </option>
                          {doctors.map((item: any) => (
                            <option key={item.id} value={item.id}>
                              {item.fullName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                        <div className="font-medium flex items-center mr-10 w-1/6">
                          Reason
                        </div>
                        <input
                          className="flex-1 p-2 bg-white border rounded-md"
                          value={reason}
                          onChange={(event) => setReason(event.target.value)}
                        />
                      </div>
                      <div className="flex items-center justify-end mt-10 mr-10">
                        <Button
                          disabled={isLoading}
                          className="bg-sky-900 hover:bg-sky-700 text-emerald-400 px-10 py-6 text-xl"
                          onClick={(e) => {
                            onUpdateDoctor(e);
                          }}
                        >
                          {isLoading && (
                            <AiOutlineLoading className="animate-spin" />
                          )}
                          Save
                        </Button>
                      </div>
                    </>
                  )}
                </>
              ))}
              <div className="flex items-center gap-x-2 my-5">
                <IconBadge icon={FileUser} />
                <h2 className="text-xl text-sky-900 font-semibold">Customer</h2>
              </div>
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
            </div>
          </div>
          {!isAdmin &&
            appointment?.childs.map((child, index) => {
              const maxWeekRecord = child.fetalGrowthRecordModelViews.reduce(
                (max, record) =>
                  record.weekOfPregnancy > max ? record.weekOfPregnancy : max,
                0
              );

              // Tạo danh sách tuần từ maxWeekRecord + 1 đến 41
              const weeks = Array.from(
                { length: 41 - (maxWeekRecord + 1) + 1 },
                (_, i) => maxWeekRecord + 1 + i
              );

              return (
                <div className="w-full">
                  <input
                    type="hidden"
                    {...register(`childsUpdated.${index}.childId`, {
                      value: child.id,
                    })}
                  />

                  <div className="flex items-center gap-x-2 my-5">
                    <IconBadge icon={Baby} />
                    <h2 className="text-xl text-sky-900 font-semibold">
                      Child: <span className="text-blue-300">{child.name}</span>
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6">
                    <div className=" flex mt-4 border bg-slate-100 rounded-md p-4">
                      <div className="font-medium flex items-center mr-10 w-1/6 ">
                        Child name
                      </div>
                      <input
                        className="flex-1 p-2 bg-gray-100"
                        value={child.name}
                        disabled
                      />
                    </div>
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
                    <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                      <div className="font-medium flex items-center mr-10 w-1/6 ">
                        BloodType
                      </div>
                      <input
                        className="flex-1 p-2 bg-gray-100"
                        value={child.bloodType}
                        disabled
                      />
                    </div>
                    <div className="flex mt-4 border items-center bg-slate-100 rounded-md p-4">
                      <div className="font-medium flex items-center mr-10 w-1/6 ">
                        Week Of Pregnancy
                      </div>
                      <div className="flex-1">
                        <select
                          className="flex-1 w-full p-2 bg-white"
                          {...register(
                            `childsUpdated.${index}.weekOfPregnancy`,
                            {
                              required: "Week is required",
                            }
                          )}
                          onChange={(e) => {
                            handleWeekChange(e);
                          }}
                        >
                          <option value="">Select week</option>
                          {weeks.map((week) => (
                            <option key={week} value={week}>
                              {week}
                            </option>
                          ))}
                        </select>
                        {errors?.childsUpdated?.[index]?.weekOfPregnancy && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.childsUpdated[index].weekOfPregnancy
                              ?.message || "This field is required."}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex mt-4 border items-center bg-slate-100 rounded-md p-4">
                      <div className="font-medium flex items-center mr-10 w-1/6">
                        Height (cm)
                      </div>
                      <div className="flex-1">
                        <input
                          disabled={!isWeekSelected}
                          className={`p-2 bg-white w-full ${
                            errors?.childsUpdated?.[index]?.height
                              ? "border-red-500"
                              : ""
                          }`}
                          type="number"
                          step="any"
                          {...register(`childsUpdated.${index}.height`, {
                            required: "Height is required",
                            setValueAs: (value) =>
                              value ? parseFloat(value) : undefined,
                            validate: (value) => {
                              const minHeight = minStandard?.minHeight ?? 0;
                              const maxHeight = maxStandard?.maxHeight ?? 100;

                              return (
                                (value != null &&
                                  value > minHeight &&
                                  value <= maxHeight) ||
                                `Height must be greater than ${minHeight} and not exceed ${maxHeight}`
                              );
                            },
                          })}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (
                              standard?.minHeight !== undefined &&
                              standard?.maxHeight !== undefined &&
                              (value < standard.minHeight ||
                                value > standard.maxHeight)
                            ) {
                              setWarnings((prev) => ({
                                ...prev,
                                height: `Height is out of range (${standard.minHeight} - ${standard.maxHeight} cm)`,
                              }));
                            } else {
                              setWarnings((prev) => ({ ...prev, height: "" }));
                            }
                          }}
                        />
                        {errors?.childsUpdated?.[index]?.height && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.childsUpdated[index].height?.message}
                          </p>
                        )}
                        {warnings.height && (
                          <p className="text-yellow-500 text-sm mt-1">
                            {warnings.height}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex mt-4 border items-center bg-slate-100 rounded-md p-4">
                      <div className="font-medium flex items-center mr-10 w-1/6">
                        Weight (kg)
                      </div>
                      <div className="flex-1">
                        <input
                          disabled={!isWeekSelected}
                          className={`p-2 bg-white w-full ${
                            errors?.childsUpdated?.[index]?.weight
                              ? "border-red-500"
                              : ""
                          }`}
                          type="number"
                          step="any"
                          placeholder="Enter weight estimate"
                          {...register(`childsUpdated.${index}.weight`, {
                            required: "Weight is required",
                            setValueAs: (value) =>
                              value ? parseFloat(value) : undefined,
                            validate: (value) => {
                              const minWeight = minStandard?.minWeight ?? 0; // Default to 0 if undefined
                              const maxWeight = maxStandard?.maxWeight ?? 12.6; // Default to 12.6 if undefined

                              return (
                                (value != null &&
                                  value > minWeight &&
                                  value <= maxWeight) ||
                                `Weight must be greater than ${minWeight} and not exceed ${maxWeight}`
                              );
                            },
                          })}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (
                              standard?.minWeight !== undefined &&
                              standard?.maxWeight !== undefined &&
                              (value < standard.minWeight ||
                                value > standard.maxWeight)
                            ) {
                              setWarnings((prev) => ({
                                ...prev,
                                weight: `Weight is out of range (${standard.minWeight} - ${standard.maxWeight} kg)`,
                              }));
                            } else {
                              setWarnings((prev) => ({ ...prev, weight: "" }));
                            }
                          }}
                        />
                        {errors?.childsUpdated?.[index]?.weight && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.childsUpdated[index].weight?.message}
                          </p>
                        )}
                        {warnings.weight && (
                          <p className="text-yellow-500 text-sm mt-1">
                            {warnings.weight}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex mt-4 border items-center bg-slate-100 rounded-md p-4">
                      <div className="font-medium flex items-center mr-10 w-1/6">
                        Head Circumference (cm)
                      </div>
                      <div className="flex-1">
                        <input
                          disabled={!isWeekSelected}
                          className={`p-2 bg-white w-full ${
                            errors?.childsUpdated?.[index]?.headCircumference
                              ? "border-red-500"
                              : ""
                          }`}
                          type="number"
                          step="any"
                          placeholder="Enter head circumference"
                          {...register(
                            `childsUpdated.${index}.headCircumference`,
                            {
                              required: "Head circumference is required",
                              setValueAs: (value) =>
                                value ? parseFloat(value) : undefined,
                              validate: (value) => {
                                const minCircumference = 0; // Minimum is fixed at 0
                                const maxCircumference =
                                  maxStandard?.headCircumference ?? 4.1; // Default to 4.1 if undefined

                                return (
                                  (value != null &&
                                    value > minCircumference &&
                                    value <= maxCircumference) ||
                                  `Head circumference must be greater than ${minCircumference} and not exceed ${maxCircumference}`
                                );
                              },
                            }
                          )}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);

                            if (value < 0) {
                              setWarnings((prev) => ({
                                ...prev,
                                headCircumference:
                                  "Negative values are not allowed.",
                              }));
                            } else if (
                              standard?.headCircumference !== undefined &&
                              (value < 0.15 ||
                                value > standard.headCircumference)
                            ) {
                              setWarnings((prev) => ({
                                ...prev,
                                headCircumference: `Head circumference is out of range (0.15- ${standard.headCircumference} cm)`,
                              }));
                            } else {
                              setWarnings((prev) => ({
                                ...prev,
                                headCircumference: "",
                              }));
                            }
                          }}
                        />

                        {/* Error message (blocks submission) */}
                        {errors?.childsUpdated?.[index]?.headCircumference && (
                          <p className="text-red-500 text-sm mt-1">
                            {
                              errors.childsUpdated[index].headCircumference
                                ?.message
                            }
                          </p>
                        )}

                        {/* Warning message (allows submission) */}
                        {warnings.headCircumference && (
                          <p className="text-yellow-500 text-sm mt-1">
                            {warnings.headCircumference}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex mt-4 border items-center bg-slate-100 rounded-md p-4">
                      <div className="font-medium flex items-center mr-10 w-1/6">
                        Abdominal Circumference (cm)
                      </div>
                      <div className="flex-1">
                        <input
                          disabled={!isWeekSelected}
                          className={`p-2 bg-white w-full ${
                            errors?.childsUpdated?.[index]
                              ?.abdominalCircumference
                              ? "border-red-500"
                              : ""
                          }`}
                          type="number"
                          step="any"
                          placeholder="Enter abdominal circumference"
                          {...register(
                            `childsUpdated.${index}.abdominalCircumference`,
                            {
                              required: "Abdominal circumference is required",
                              setValueAs: (value) =>
                                value ? parseFloat(value) : undefined,
                              validate: (value) => {
                                const minCircumference = 0; // Minimum is fixed at 0
                                const maxCircumference =
                                  maxStandard?.abdominalCircumference ?? 3.5; // Default to 3.5 if undefined

                                return (
                                  (value != null &&
                                    value > minCircumference &&
                                    value <= maxCircumference) ||
                                  `Abdominal circumference must be greater than ${minCircumference} and not exceed ${maxCircumference}`
                                );
                              },
                            }
                          )}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);

                            if (value < 0) {
                              setWarnings((prev) => ({
                                ...prev,
                                abdominalCircumference:
                                  "Negative values are not allowed.",
                              }));
                            } else if (
                              standard?.abdominalCircumference !== undefined &&
                              (value < 0.2 ||
                                value > standard.abdominalCircumference)
                            ) {
                              setWarnings((prev) => ({
                                ...prev,
                                abdominalCircumference: `Abdominal circumference is out of range (0.2 - ${standard.abdominalCircumference} cm)`,
                              }));
                            } else {
                              setWarnings((prev) => ({
                                ...prev,
                                abdominalCircumference: "",
                              }));
                            }
                          }}
                        />

                        {/* Error message (blocks submission) */}
                        {errors?.childsUpdated?.[index]
                          ?.abdominalCircumference && (
                          <p className="text-red-500 text-sm mt-1">
                            {
                              errors.childsUpdated[index].abdominalCircumference
                                ?.message
                            }
                          </p>
                        )}

                        {/* Warning message (allows submission) */}
                        {warnings.abdominalCircumference && (
                          <p className="text-yellow-500 text-sm mt-1">
                            {warnings.abdominalCircumference}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex mt-4 border items-center bg-slate-100 rounded-md p-4">
                      <div className="font-medium flex items-center mr-10 w-1/6">
                        Fetal Heart Rate (bpm)
                      </div>
                      <div className="flex-1">
                        <input
                          disabled={
                            !isWeekSelected || standard?.fetalHeartRate === null
                          }
                          className={`p-2 bg-white w-full ${
                            errors?.childsUpdated?.[index]?.fetalHeartRate
                              ? "border-red-500"
                              : ""
                          }`}
                          type="number"
                          step="any"
                          placeholder="Enter fetal heart rate (optional)"
                          {...register(
                            `childsUpdated.${index}.fetalHeartRate`,
                            {
                              setValueAs: (value) =>
                                value ? parseFloat(value) : null, // Convert input to float, null if empty
                              validate: (value) => {
                                if (standard?.fetalHeartRate === null)
                                  return true; // ✅ Allow empty if not required
                                if (value == null)
                                  return "Fetal heart rate is required"; // ❌ Required only if standard is set
                                if (value < 120)
                                  return "Fetal heart rate must be at least 120"; // ❌ Enforce min limit
                                if (value > 170)
                                  return "Fetal heart rate must not exceed 170"; // ❌ Enforce max limit

                                return true;
                              },
                            }
                          )}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);

                            if (value < 0) {
                              setWarnings((prev) => ({
                                ...prev,
                                fetalHeartRate:
                                  "Negative values are not allowed.",
                              }));
                            } else if (
                              standard?.fetalHeartRate !== undefined &&
                              (value < 120 ||
                                value > (standard.fetalHeartRate ?? 200))
                            ) {
                              setWarnings((prev) => ({
                                ...prev,
                                fetalHeartRate: `Fetal heart rate is out of range (120 - ${standard.fetalHeartRate} bpm)`,
                              }));
                            } else {
                              setWarnings((prev) => ({
                                ...prev,
                                fetalHeartRate: "",
                              }));
                            }
                          }}
                        />

                        {/* Error Message (blocks submission) */}
                        {errors?.childsUpdated?.[index]?.fetalHeartRate && (
                          <p className="text-red-500 text-sm mt-1">
                            {
                              errors.childsUpdated[index]?.fetalHeartRate
                                ?.message
                            }
                          </p>
                        )}

                        {/* Warning Message (allows submission) */}
                        {warnings.fetalHeartRate && (
                          <p className="text-yellow-500 text-sm mt-1">
                            {warnings.fetalHeartRate}
                          </p>
                        )}

                        {/* Info Message: If FHR is not required in early weeks */}
                        {standard?.fetalHeartRate === null && (
                          <p className="text-sky-800 font-bold text-sm mt-1">
                            In weeks 1, 2, 3, fetal heart rate is not required.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex mt-4 border items-center bg-slate-100 rounded-md p-4">
                      <div className="font-medium flex items-center mr-10 w-1/6 ">
                        Health Condition
                      </div>
                      <div className="flex-1">
                        <textarea
                          disabled={!isWeekSelected}
                          className={`p-2 bg-white w-full  h-40 ${
                            errors?.childsUpdated?.[index]?.healthCondition
                              ? "border-red-500"
                              : ""
                          }`}
                          {...register(
                            `childsUpdated.${index}.healthCondition`,
                            {
                              required: "Health Condition is required",
                            }
                          )}
                        />
                        {errors?.childsUpdated?.[index]?.healthCondition && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.childsUpdated[index].healthCondition
                              ?.message || "This field is required."}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="my-4">
                    <GrowthCharts child={child} />
                  </div>
                </div>
              );
            })}
          {!isAdmin && (
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
          )}
        </div>
      </form>
    </div>
  );
};

export default AppointmentUpdateContainer;
