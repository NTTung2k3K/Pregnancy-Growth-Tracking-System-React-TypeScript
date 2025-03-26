import { IconBadge } from "@/components/IconBadge";
import {
  ArrowBigRightDash,
  Baby,
  BadgeAlert,
  BriefcaseMedicalIcon,
  CircleArrowLeft,
  CircleHelp,
  FileUser,
  History,
  Pen,
  SquareMousePointer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "@/routes";
import { Appointment, Child, Doctor } from "@/containers/Dashboard/Appointment";
import { GrowthCharts } from "@/containers/Dashboard/Appointment/components/chart-record";
import { getSlotString } from "@/lib/utils";
import { API_ROUTES } from "@/routes/api";
import { formatDate } from "@/lib/text";

const AppointmentDetailContainer = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState<Appointment>();
  const [doctor, setDoctor] = useState<Doctor>();
  const role = localStorage.getItem("role");
  const isAdmin = role === "Admin";
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState<string>();

  const apiLink = isAdmin
    ? API_ROUTES.DASHBOARD_APPOINTMENT_ADMIN_DETAIL
    : API_ROUTES.DASHBOARD_APPOINTMENT_DOCTOR_DETAIL;

  const fetchAppointment = async () => {
    try {
      const response = await axios.get(`${BASE_URL + apiLink}`, {
        params: { id: id },
      });
      const fetchedAppointment = {
        ...response.data.resultObj,
      };
      setAppointment(fetchedAppointment);
      setStatus(fetchedAppointment.status);
      const sortedAppointments = response.data.resultObj.appoinmentUsers
        ?.slice() // Create a copy to avoid mutating the original array
        .sort(
          (a: any, b: any) =>
            new Date(b.assignedTime).getTime() -
            new Date(a.assignedTime).getTime()
        );
      setHistory(sortedAppointments);
      setDoctor(sortedAppointments[0].doctor);
    } catch (error) {
      console.error("Failed to fetch Appointment:", error);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, []);

  // const isToday = (dateString?: string): boolean => {
  //   if (!dateString) return false; // Handle undefined case

  //   const givenDate = new Date(dateString);
  //   if (isNaN(givenDate.getTime())) return false; // Handle invalid date case

  //   const today = new Date();

  //   return (
  //     givenDate.getFullYear() === today.getFullYear() &&
  //     givenDate.getMonth() === today.getMonth() &&
  //     givenDate.getDate() === today.getDate()
  //   );
  // };

  return (
    <div>
      <div className=" flex items-center justify-between mt-10">
        <Link className="p-6" to={ROUTES.DASHBOARD_APPOINTMENT}>
          <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700">
            <CircleArrowLeft className="mr-2" />
            Back
          </Button>
        </Link>
        {status === "Confirmed" && (
          <Link
            className="p-6"
            to={ROUTES.DASHBOARD_APPOINTMENT_UPDATE.replace(":id", String(id))}
          >
            <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700">
              <Pen className="mr-2" />
              Examination
            </Button>
          </Link>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Appointment Details</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
          <div>
            <div className="flex items-center gap-x-2 my-5">
              <IconBadge icon={SquareMousePointer} />
              <h2 className="text-xl text-sky-900 font-semibold">
                Appointment information
              </h2>
            </div>

            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Appointment Name
              </div>
              <p className="flex-1 p-2">{appointment?.name}</p>
            </div>

            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Description
              </div>
              <p className="flex-1 p-2">{appointment?.description}</p>
            </div>

            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Note
              </div>
              <p className="flex-1 p-2">{appointment?.notes}</p>
            </div>

            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Result
              </div>
              <p className="flex-1 p-2">{appointment?.result}</p>
            </div>

            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Appointment Date
              </div>
              <p className="flex-1 p-2">
                {appointment?.appointmentDate
                  ? new Date(appointment.appointmentDate).toLocaleDateString(
                      "vi-VN"
                    )
                  : "N/A"}
              </p>
            </div>

            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Appointment Slot
              </div>
              <p className="flex-1 p-2">
                {getSlotString(appointment?.appointmentSlot ?? 1)}
              </p>
            </div>

            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Status
              </div>
              <p className="flex-1 p-2">{appointment?.status}</p>
            </div>

            {isAdmin && (
              <div className="mt-4">
                <div className="flex items-center justify-between gap-x-2">
                  <div className="flex items-center">
                    <IconBadge icon={History} />
                    <h2 className="ml-4 text-xl text-sky-900 font-semibold">
                      History of doctor change
                    </h2>
                  </div>
                </div>
                <div className="flex flex-col mt-4 border bg-slate-100 rounded-md p-4">
                  {history.map((item: any) => (
                    <div className=" bg-sky-800 px-20 py-4 my-2 text-emerald-400 rounded-lg font-semibold">
                      <div className="flex justify-between items-center">
                        <p>Date: {" " + formatDate(item.assignedTime)}</p>
                        <ArrowBigRightDash />
                        <p> {item.doctor.fullName}</p>
                      </div>
                      <div className="flex  items-center my-2">
                        <div className="flex">
                          <CircleHelp className="mr-2" />
                          {item.reason}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-x-2 my-5">
              <IconBadge icon={BadgeAlert} />
              <h2 className="text-xl text-sky-900 font-semibold">Issue</h2>
            </div>

            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Issue
              </div>
              <p className="flex-1 p-2">
                {appointment?.appointmentTemplate?.name}
              </p>
            </div>

            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Fee
              </div>
              <p className="flex-1 p-2">
                {Math.round(appointment?.fee ?? 0).toLocaleString()} VNĐ
              </p>
            </div>

            <div key={doctor?.id}>
              <div className="flex items-center gap-x-2 my-5">
                <IconBadge icon={BriefcaseMedicalIcon} />
                <h2 className="text-xl text-sky-900 font-semibold">Doctor</h2>
              </div>

              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10 w-1/6">
                  Doctor name
                </div>
                <p className="flex-1 p-2">{doctor?.fullName}</p>
              </div>

              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10 w-1/6">
                  Doctor phone number
                </div>
                <p className="flex-1 p-2">{doctor?.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-x-2 my-5">
              <IconBadge icon={FileUser} />
              <h2 className="text-xl text-sky-900 font-semibold">Customer</h2>
            </div>

            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Customer name
              </div>
              <p className="flex-1 p-2">{appointment?.user?.fullName}</p>
            </div>

            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Customer phone number
              </div>
              <p className="flex-1 p-2">{appointment?.user?.phoneNumber}</p>
            </div>

            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Customer address
              </div>
              <p className="flex-1 p-2">{appointment?.user?.address}</p>
            </div>

            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Customer email
              </div>
              <a
                href={`mailto:${appointment?.user?.email}`}
                className="flex-1 p-2 hover:underline"
              >
                {appointment?.user?.email}
              </a>
            </div>
          </div>
        </div>

        {appointment?.childs?.map((child: Child) => (
          <div key={child.id} className="w-full">
            <div className="flex items-center gap-x-2 my-5">
              <IconBadge icon={Baby} />
              <h2 className="text-xl text-sky-900 font-semibold">
                Child: <span className="text-blue-300">{child.name}</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-x-6">
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10 w-1/6">
                  Child name
                </div>
                <p className="flex-1 p-2">{child.name}</p>
              </div>

              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10 w-1/6">
                  Due date
                </div>
                <p className="flex-1 p-2">
                  {new Date(child.dueDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>

            <div className="my-4">
              <GrowthCharts child={child} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentDetailContainer;
