import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { DataTable } from "@/containers/Dashboard/Appointment/components/DataTable";
import { columns } from "@/containers/Dashboard/Appointment/components/Columns";

export interface Appointment {
  id: number;
  name: string;
  appointmentSlot: number;
  appointmentDate: string;
  status: string;
  fee: number;
  notes: string;
  user: User;
  doctors: Doctor[];
  appointmentTemplate: AppointmentTemplate;
  childs: Child[];
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  image: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dateOfBirth: any;
  address: string;
  phoneNumber: string;
  gender: string;
  bloodGroup: string;
  status: string;
  childs: Child[];
}

export interface Doctor {
  id: string;
  fullName: string;
  image: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dateOfBirth: any;
  address: string;
  gender: string;
  email: string;
  status: string;
  role: Role;
}

export interface Role {
  id: string;
  name: string;
}

export interface AppointmentTemplate {
  id: number;
  name: string;
  daysFromBirth: number;
  description: string;
  status: string;
  fee: number;
  image: string;
}

export interface Child {
  id: number;
  userId: string;
  name: string;
  fetalGender: string;
  pregnancyStage: string;
  weightEstimate: number;
  heightEstimate: number;
  dueDate: string;
  deliveryPlan: string;
  complications: string;
  photoUrl: string;
  bloodType: string;
  pregnancyWeekAtBirth: number;
}

const AppointmentAdminContainer = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointment = async () => {
    const response = await axios.get(`${BASE_URL}/appointments/get-all`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedResult = response.data.resultObj.map((item: any) => ({
      ...item,
    }));
    setAppointments(formattedResult || []);
  };

  useEffect(() => {
    fetchAppointment();
  }, []);

  return (
    <div className="p-6">
      <DataTable columns={columns} data={appointments} />
    </div>
  );
};

export default AppointmentAdminContainer;
