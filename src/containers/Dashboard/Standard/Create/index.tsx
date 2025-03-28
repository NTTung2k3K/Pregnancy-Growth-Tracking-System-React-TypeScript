import { CircleArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
import { ROUTES } from "@/routes";
import { Link, useNavigate } from "react-router-dom";
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

const GrowthStandardCreateContainer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Standard>({
    mode: "onChange",
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (data: Standard) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${BASE_URL + API_ROUTES.DASHBOARD_GROWTH_STANDARD_CREATE}`,
        {
          ...data,
          gestationalAge: `${data.week.toString()} weeks`,
          gender: data.gender,
        }
      );
      if (response.data.statusCode === 200) {
        navigate(ROUTES.DASHBOARD_GROWTH_STANDARDS);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to update data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-6 mt-20">
        <Link to={ROUTES.DASHBOARD_GROWTH_STANDARDS}>
          <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700 mb-10">
            <CircleArrowLeft /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-medium">Create Standard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div>
            <div className="flex border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10">Gender</div>
              <select
                className="flex-1 p-2 border rounded-md"
                {...register("gender", { required: "Gender is required" })}
              >
                <option value="">Select Gender</option>
                <option value="1">Male</option>
                <option value="0">Female</option>
              </select>
            </div>
            {errors.gender && (
              <p className="text-red-500 mt-2 mx-4">{errors.gender?.message}</p>
            )}
          </div>
          {fields.map((key) => (
            <>
              <div className="">
                <div
                  key={key}
                  className="flex border bg-slate-100 rounded-md p-4"
                >
                  <div className="font-medium flex items-center mr-10">
                    {formatFieldName(key)}
                  </div>
                  <input
                    type="number"
                    className="flex-1 p-2 border rounded-md"
                    step="any"
                    min="0"
                    {...register(key, {
                      required: `${key} is required`,
                      valueAsNumber: true, // Ensures numbers are stored correctly
                      min: { value: 0, message: `${key} must be positive` }, // Ensure value is >= 0
                    })}
                  />
                </div>
                {errors[key] && (
                  <p className="text-red-500 mt-2 mx-4">
                    {errors[key]?.message}
                  </p>
                )}
              </div>
            </>
          ))}
        </div>
        <div className="flex items-center justify-end mt-10">
          <Button
            disabled={isLoading}
            className="bg-sky-900 hover:bg-sky-700 text-emerald-400 px-10 py-6 text-xl"
            type="submit"
          >
            {isLoading && <AiOutlineLoading className="animate-spin" />} Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default GrowthStandardCreateContainer;
