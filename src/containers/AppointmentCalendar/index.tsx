import { LargeCalendar } from "@/containers/Appointment-History/_components/large-calendar";

export default function AppointmentCalendarContainer() {
  return (
    <>
      <h1 className="text-4xl font-bold text-center  text-blue-600 my-7">
        My Calendar for Appointment
      </h1>
      <div className="flex justify-center">
        <div className="container py-8 min-h-[30vh]">
          <LargeCalendar />
        </div>
      </div>
    </>
  );
}
