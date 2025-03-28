import { CircleArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { useEffect } from "react";
import { ROUTES } from "@/routes";
import { Link, useParams } from "react-router-dom";
import { Standard } from "../components/IStandard";

const fields: Array<keyof Standard> = [
  "week",
  "averageWeight",
  "averageHeight",
  "maxWeight",
  "minWeight",
  "minHeight",
  "maxHeight",
  "headCircumference",
  "abdominalCircumference",
  "fetalHeartRate",
];

const formatFieldName = (field: keyof Standard): string => {
  const fieldMap :any = {
    week: "Week",
    averageWeight: "Average Weight",
    averageHeight: "Average Height",
    maxWeight: "Max Weight",
    minWeight: "Min Weight",
    minHeight: "Min Height",
    maxHeight: "Max Height",
    headCircumference: "Head Circumference",
    abdominalCircumference: "Abdominal Circumference",
    fetalHeartRate: "Fetal Heart Rate",
    gender: "Gender", // Including gender for consistency
  };
  return fieldMap[field] || field;
};

const GrowthStandardDetailContainer = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useForm<Standard>({
    mode: "onChange",
  });

  const { id } = useParams();

  const fetchStandardData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.DASHBOARD_GROWTH_STANDARD_DETAIL}/${id}`
      );
      const fetchedData = response.data.resultObj;
      Object.keys(fetchedData).forEach((key) =>
        setValue(key as keyof Standard, fetchedData[key])
      );
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchStandardData();
  }, []);


  return (
    <div>
      <div className="p-6">
        <Link to={ROUTES.DASHBOARD_GROWTH_STANDARDS}>
          <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700 mb-10">
            <CircleArrowLeft /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-medium">Standard Detail</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center mr-10">Gender</div>
            <select
              disabled
              className="flex-1 p-2 border rounded-md"
              {...register("gender", {
                required: "Gender is required",
              })}
            >
              <option value="">Select Gender</option>
              <option value="1">Male</option>
              <option value="0">Female</option>
            </select>
            {errors.gender && (
              <p className="text-red-500">{errors.gender?.message}</p>
            )}
          </div>
          {fields.map((key) => (
            <div
              key={key}
              className="flex mt-4 border bg-slate-100 rounded-md p-4"
            >
              <div className="font-medium flex items-center mr-10">
                {formatFieldName(key)}
              </div>
              <input
                disabled
                type="number"
                className="flex-1 p-2 border rounded-md"
                step="any"
                min="0"
                {...register(key, {
                  required: `${formatFieldName(key)} is required`,
                  valueAsNumber: true,
                  min: { value: 0, message: `${formatFieldName(key)} must be positive` },
                })}
              />
              {errors[key] && (
                <p className="text-red-500">{errors[key]?.message}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GrowthStandardDetailContainer;