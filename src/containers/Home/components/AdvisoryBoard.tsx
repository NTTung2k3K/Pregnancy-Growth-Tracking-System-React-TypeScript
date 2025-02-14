import { Employee } from "@/containers/Dashboard/Employees";
import { API_ROUTES } from "@/routes/api";
import { BASE_URL } from "@/services/config";
import axios from "axios";
import { useEffect, useState } from "react";

const AdvisoryBoard = () => {


  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchEmployees = async () => {
    const response = await axios.get(
      `${BASE_URL + API_ROUTES.DASHBOARD_EMPLOYEES_ALL}`
    );
    const formattedResult = response.data.resultObj.map((item: any) => ({
      ...item,
      role: item.role?.name || null,
    }));
    setEmployees(formattedResult || []);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="bg-white p-8 mt-10 flex flex-col justify-center items-center rounded-lg">
      <p className="text-sky-900 text-3xl font-bold py-2 mt-4">
        Our Medical Advisory Board
      </p>
      <p className="w-[600px] text-center text-lg py-2">
        Meet our medical advisors — highly respected experts who ensure our
        content is complete and accurate.
      </p>
      <div className="grid grid-cols-2">
        {employees.map((item, index) => (
          <div
            key={index}
            className="flex items-center my-4 mx-20 text-black"
          >
            <img
              className="w-20 h-20 rounded-full mr-4"
              src={item.image || ""}
              alt=""
            />
            <div className="flex flex-col">
              <p className="text-sky-900 text-xl font-semibold">
                {item.fullName}
              </p>
              <p>{item.email}</p>
            </div>
          </div>
        ))}
      </div>

      {/* <Link
        to={"/"}
        className="bg-slate-200 py-4 px-8 text-xl text-sky-900 font-semibold border border-sky-900 rounded-full mb-10"
      >
        See all
      </Link> */}
    </div>
  );
};

export default AdvisoryBoard;
