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
  "gestationalAge",
  "minWeight",
  "maxWeight",
  "averageWeight",
  "minHeight",
  "maxHeight",
  "averageHeight",
  "headCircumference",
  "abdominalCircumference",
  "fetalHeartRate",
];

const numberFields: Array<keyof Standard> = [
  "week",
  "minWeight",
  "maxWeight",
  "averageWeight",
  "minHeight",
  "maxHeight",
  "averageHeight",
  "headCircumference",
  "abdominalCircumference",
  "fetalHeartRate",
];

const formatFieldName = (field: string): string => {
  return field
    .replace(/\bminWeight\b/gi, "Min Height") // Convert "minWeight" to "Min Height"
    .replace(/\bmaxWeight\b/gi, "Max Weight") // Convert "maxWeight" correctly
    .replace(/\bmin\b/gi, "Min") // Convert "min" to "Min"
    .replace(/\bmax\b/gi, "Max") // Convert "max" to "Max"
    .replace(/\baverage\b/gi, "Average") // Convert "average" to "Average"
    .replace(/([A-Z])/g, " $1") // Insert space before capital letters (camelCase to words)
    .trim()
    .replace(/^./, (char) => char.toUpperCase()); // Capitalize first letter
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
      <div className="p-6 mt-20">
        <Link to={ROUTES.DASHBOARD_GROWTH_STANDARDS}>
          <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700 mb-10">
            <CircleArrowLeft /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-medium">Standard Detail</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
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
                type={numberFields.includes(key) ? "number" : "text"}
                className="flex-1 p-2 border rounded-md"
                step="any"
                min="0"
                {...register(key, {
                  required: `${key} is required`,
                  ...(numberFields.includes(key) && {
                    valueAsNumber: true, // Ensures numbers are stored correctly
                    min: { value: 0, message: `${key} must be positive` },
                  }),
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
