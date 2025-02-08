import { CookiesEmployee2Service } from "@/services/cookies.service";
import { DoctorCalendar } from "./components/Calendar";

const DoctorContainer = () => {
  const doctor = JSON.parse(CookiesEmployee2Service.get() || "");

  return (
    <>
      <h1 className="text-3xl font-bold text-center  text-sky-800 my-7">
        Welcome, {doctor.fullName} 🙌
      </h1>
      <p className="text-center text-sky-800 font-semibold">
        Dedication Beyond Duty
      </p>
      <div className="flex justify-center">
        <div className="container py-8 min-h-[30vh]">
          <DoctorCalendar />
        </div>
      </div>
    </>
  );
};

export default DoctorContainer;
