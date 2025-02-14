
import { CircleArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import {  useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
import { ROUTES } from "@/routes";
import { Link } from "react-router-dom";
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

const GrowthStandardCreateContainer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Standard>({
    mode: "onChange",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (data: Standard) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${BASE_URL + API_ROUTES.DASHBOARD_GROWTH_STANDARD_CREATE}`,
        { ...data }
      );
      if (response.data.statusCode === 200) {
        window.location.href = `${ROUTES.DASHBOARD_GROWTH_STANDARDS}`;
        toast.success(response.data.message.message);
      } else {
        toast.error(response.data.message.message);
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
          {fields.map((key) => (
            <div
              key={key}
              className="flex mt-4 border bg-slate-100 rounded-md p-4"
            >
              <div className="font-medium flex items-center mr-10">{key}</div>
              <input
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
