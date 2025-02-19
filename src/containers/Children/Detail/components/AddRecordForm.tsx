import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { Child } from "@/containers/Dashboard/Children/components/IChild";
import { ROUTES } from "@/routes";
import toast from "react-hot-toast";
import { AiOutlineLoading } from "react-icons/ai";
import { Standard } from "@/containers/Dashboard/Standard/components/IStandard";
import { watch } from "fs";

// Define form types
type ChildFormValues = {
  height: number;
  weight: number;
  headCircumference: number;
  abdominalCircumference: number;
  fetalHeartRate: number | null;
  weekOfPregnancy: number;
  healthCondition: string;
};

const AddRecordForm = ({ child }: { child: Child }) => {
  const [open, setOpen] = useState(false); // Control modal state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChildFormValues>({
    mode: "onChange",
  });

  const [standard, setStandard] = useState<Standard>();

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

  const [isWeekSelected, setIsWeekSelected] = useState(false);

  const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedWeek = e.target.value;
    setIsWeekSelected(!!selectedWeek); // Update the state based on selection
    fetchStandard(parseInt(selectedWeek));
  };

  const maxWeekRecord =
    child?.fetalGrowthRecordModelViews?.reduce(
      (max, record) =>
        record.weekOfPregnancy > max ? record.weekOfPregnancy : max,
      0
    ) ?? 0;

  const weeks = Array.from(
    { length: 41 - (maxWeekRecord + 1) + 1 },
    (_, i) => maxWeekRecord + 1 + i
  );

  const onSubmit = async (data: ChildFormValues) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${BASE_URL + API_ROUTES.RECORD_CREATE}`,
        {
          childId: child?.id,
          weekOfPregnancy: Number(data.weekOfPregnancy),
          weight: Number(data.weight),
          height: Number(data.height),
          recordedAt: new Date().toISOString(),
          headCircumference: Number(data.headCircumference),
          abdominalCircumference: Number(data.abdominalCircumference),
          fetalHeartRate: Number(data.fetalHeartRate),
          growChartsID: null,
          healthCondition: data.healthCondition,
        }
      );
      if (response.data.statusCode === 200) {
        window.location.href = ROUTES.CHILDREN_DETAIL.replace(
          ":id",
          String(child.id)
        );
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to update child:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-sky-900 text-emerald-400">Add record</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[700px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="text-sky-800 font-bold">
            Add record
          </DialogTitle>
          <DialogDescription>
            Function allows members to update important fetal growth information
            indicators over time.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="weekOfPregnancy" className="text-right">
              Week Of Pregnancy
            </Label>
            <select
              className="col-span-3  shadow-sm  p-2 rounded-md"
              {...register(`weekOfPregnancy`, {
                required: "Week is required",
              })}
              onChange={(e) => {
                fetchStandard(parseInt(e.target.value));
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
          </div>
          {errors.weekOfPregnancy && (
            <p className="text-red-500 flex items-center justify-center">
              {errors.weekOfPregnancy.message}
            </p>
          )}
          {/* Height */}
          <div className="grid grid-cols-4 items-center gap-4 ">
            <Label htmlFor="height" className="text-right">
              Height (cm)
            </Label>
            <Input
              disabled={!isWeekSelected}
              type="number"
              step="any"
              {...register("height", {
                required: "Height is required",
                setValueAs: (value) => (value ? parseFloat(value) : undefined),
                min: {
                  value: standard?.minHeight ?? 0.25,
                  message: `Height must be at least ${
                    standard?.minHeight ?? 0.25
                  } cm`,
                },
                max: {
                  value: standard?.maxHeight ?? 0.3,
                  message: `Height must be at most ${
                    standard?.maxHeight ?? 0.3
                  } cm`,
                },
              })}
              className="col-span-3"
            />
          </div>
          {errors.height && (
            <p className="text-red-500 flex items-center justify-center">
              {errors.height.message}
            </p>
          )}

          {/* Weight */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="weight" className="text-right">
              Weight (kg)
            </Label>
            <Input
              disabled={!isWeekSelected}
              type="number"
              step="any"
              {...register("weight", {
                required: "Weight is required",
                setValueAs: (value) => (value ? parseFloat(value) : undefined),
                min: {
                  value: standard?.minWeight ?? 1, // Default min weight to 1 kg if undefined
                  message: `Weight must be at least ${
                    standard?.minWeight ?? 1
                  } kg`,
                },
                max: {
                  value: standard?.maxWeight ?? 200, // Default max weight to 200 kg if undefined
                  message: `Weight must be at most ${
                    standard?.maxWeight ?? 200
                  } kg`,
                },
              })}
              className="col-span-3"
            />
          </div>
          {errors.weight && (
            <p className="text-red-500 flex items-center justify-center">
              {errors.weight.message}
            </p>
          )}

          {/* Head Circumference */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="headCircumference" className="text-right">
              Head Circumference (cm)
            </Label>
            <Input
              disabled={!isWeekSelected}
              type="number"
              step="any"
              {...register("headCircumference", {
                required: "Head circumference is required",
                setValueAs: (value) => (value ? parseFloat(value) : undefined),
                min: {
                  value: 0.2, // Default min to 30 cm
                  message: `Head circumference must be at least 0.2 cm`,
                },
                max: {
                  value: standard?.headCircumference ?? 60, // Default max to 60 cm
                  message: `Head circumference must be at most ${
                    standard?.headCircumference ?? 60
                  } cm`,
                },
              })}
              className="col-span-3"
            />
          </div>
          {errors.headCircumference && (
            <p className="text-red-500 flex items-center justify-center">
              {errors.headCircumference.message}
            </p>
          )}

          {/* Abdominal Circumference */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="abdominalCircumference" className="text-right">
              Abdominal Circumference (cm)
            </Label>
            <Input
              disabled={!isWeekSelected}
              type="number"
              step="any"
              {...register("abdominalCircumference", {
                required: "Abdominal circumference is required",
                setValueAs: (value) => (value ? parseFloat(value) : undefined),
                min: {
                  value: 0.15, // Default min: 20 cm
                  message: `Abdominal circumference must be at least 0.15 cm`,
                },
                max: {
                  value: standard?.abdominalCircumference ?? 100, // Default max: 100 cm
                  message: `Abdominal circumference must be at most ${
                    standard?.abdominalCircumference ?? 100
                  } cm`,
                },
              })}
              className="col-span-3"
            />
          </div>
          {errors.abdominalCircumference && (
            <p className="text-red-500 flex items-center justify-center">
              {errors.abdominalCircumference.message}
            </p>
          )}

          {/* Fetal Heart Rate */}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fetalHeartRate" className="text-right">
              Fetal Heart Rate (bpm)
            </Label>
            <Input
              type="number"
              disabled={!isWeekSelected || !standard?.fetalHeartRate}
              {...register("fetalHeartRate", {
                validate: (value) => {
                  if (standard?.fetalHeartRate === null) return true; // Allow null when standard is null
                  if (!value) return "This field is required"; // Required if standard is not null
                  if (value < 120) return "Value must be at least 120";
                  if (value > (standard?.fetalHeartRate || 160))
                    return `Value must not exceed  ${
                      standard?.fetalHeartRate || 160
                    }`;
                  return true;
                },
              })}
              className="col-span-3"
            />
          </div>
          {errors.fetalHeartRate && (
            <p className="text-red-500 flex items-center justify-center">
              {errors.fetalHeartRate.message}
            </p>
          )}

          {/* Health Condition */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="healthCondition" className="text-right">
              Health Condition
            </Label>
            <Input
              disabled={!isWeekSelected}
              {...register("healthCondition", {
                required: "Health condition is required",
              })}
              className="col-span-3"
            />
          </div>
          {errors.healthCondition && (
            <p className="text-red-500 flex items-center justify-center">
              {errors.healthCondition.message}
            </p>
          )}

          <DialogFooter>
            <Button
              disabled={isLoading}
              className="bg-sky-900 text-emerald-400"
              type="submit"
            >
              {isLoading && <AiOutlineLoading className="animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecordForm;
