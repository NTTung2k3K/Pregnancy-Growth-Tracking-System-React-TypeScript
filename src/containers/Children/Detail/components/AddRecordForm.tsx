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
  const [warnings, setWarnings] = useState<{ [key: string]: string }>({});

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
              className="col-span-3  border border-black  p-2 rounded-md"
              {...register(`weekOfPregnancy`, {
                required: "Week is required",
              })}
              onChange={(e) => {
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
          <div className="grid grid-cols-4 items-center gap-4">
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
                validate: (value) =>
                  (value != null && value > 0) ||
                  "Height must be a positive number",
              })}
              onChange={(e) => {
                const value = parseFloat(e.target.value);

                if (value < 0) {
                  setWarnings((prev) => ({
                    ...prev,
                    height: "Negative values are not allowed.",
                  }));
                } else if (
                  standard?.minHeight !== undefined &&
                  standard?.maxHeight !== undefined &&
                  (value < standard.minHeight || value > standard.maxHeight)
                ) {
                  setWarnings((prev) => ({
                    ...prev,
                    height: `Height is out of range (${standard.minHeight} - ${standard.maxHeight} cm)`,
                  }));
                } else {
                  setWarnings((prev) => ({ ...prev, height: "" }));
                }
              }}
              className="border border-black col-span-3"
            />
          </div>
          {/* Error Message (blocks submission) */}
          {errors.height && (
            <p className="text-red-500 flex items-center justify-center">
              {errors.height.message}
            </p>
          )}
          {/* Warning Message (allows submission) */}
          {warnings.height && (
            <p className="text-yellow-500 flex items-center justify-center">
              {warnings.height}
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
                validate: (value) =>
                  (value != null && value > 0) ||
                  "Weight must be a positive number",
              })}
              onChange={(e) => {
                const value = parseFloat(e.target.value);

                if (value < 0) {
                  setWarnings((prev) => ({
                    ...prev,
                    weight: "Negative values are not allowed.",
                  }));
                } else if (
                  standard?.minWeight !== undefined &&
                  standard?.maxWeight !== undefined &&
                  (value < standard.minWeight || value > standard.maxWeight)
                ) {
                  setWarnings((prev) => ({
                    ...prev,
                    weight: `Weight is out of range (${standard.minWeight} - ${standard.maxWeight} kg)`,
                  }));
                } else {
                  setWarnings((prev) => ({ ...prev, weight: "" }));
                }
              }}
              className="border border-black col-span-3"
            />
          </div>
          {/* Error Message (blocks submission) */}
          {errors.weight && (
            <p className="text-red-500 flex items-center justify-center">
              {errors.weight.message}
            </p>
          )}
          {/* Warning Message (allows submission) */}
          {warnings.weight && (
            <p className="text-yellow-500 flex items-center justify-center">
              {warnings.weight}
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
                validate: (value) =>
                  (value != null && value > 0) ||
                  "Head circumference must be a positive number",
              })}
              onChange={(e) => {
                const value = parseFloat(e.target.value);

                if (value < 0) {
                  setWarnings((prev) => ({
                    ...prev,
                    headCircumference: "Negative values are not allowed.",
                  }));
                } else if (
                  standard?.headCircumference !== undefined &&
                  (value < 0.15 || value > standard.headCircumference)
                ) {
                  setWarnings((prev) => ({
                    ...prev,
                    headCircumference: `Head circumference is out of range (0.15 - ${standard.headCircumference} cm)`,
                  }));
                } else {
                  setWarnings((prev) => ({ ...prev, headCircumference: "" }));
                }
              }}
              className="border border-black col-span-3"
            />
          </div>
          {/* Error Message (blocks submission) */}
          {errors.headCircumference && (
            <p className="text-red-500 flex items-center justify-center">
              {errors.headCircumference.message}
            </p>
          )}
          {/* Warning Message (allows submission) */}
          {warnings.headCircumference && (
            <p className="text-yellow-500 flex items-center justify-center">
              {warnings.headCircumference}
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
                validate: (value) =>
                  (value != null && value > 0) ||
                  "Abdominal circumference must be a positive number",
              })}
              onChange={(e) => {
                const value = parseFloat(e.target.value);

                if (value < 0) {
                  setWarnings((prev) => ({
                    ...prev,
                    abdominalCircumference: "Negative values are not allowed.",
                  }));
                } else if (
                  standard?.abdominalCircumference !== undefined &&
                  (value < 0.2 || value > standard.abdominalCircumference)
                ) {
                  setWarnings((prev) => ({
                    ...prev,
                    abdominalCircumference: `Abdominal circumference is out of range (0.2 - ${standard.abdominalCircumference} cm)`,
                  }));
                } else {
                  setWarnings((prev) => ({
                    ...prev,
                    abdominalCircumference: "",
                  }));
                }
              }}
              className="border border-black col-span-3"
            />
          </div>
          {/* Error Message (blocks submission) */}
          {errors.abdominalCircumference && (
            <p className="text-red-500 flex items-center justify-center">
              {errors.abdominalCircumference.message}
            </p>
          )}
          {/* Warning Message (allows submission) */}
          {warnings.abdominalCircumference && (
            <p className="text-yellow-500 flex items-center justify-center">
              {warnings.abdominalCircumference}
            </p>
          )}
          {/* Fetal Heart Rate */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fetalHeartRate" className="text-right">
              Fetal Heart Rate (bpm)
            </Label>
            <Input
              type="number"
              step="any"
              disabled={!isWeekSelected || standard?.fetalHeartRate === null}
              placeholder="Enter fetal heart rate (optional)"
              {...register("fetalHeartRate", {
                setValueAs: (value) => (value ? parseFloat(value) : null), // Convert to float, null if empty
                validate: (value) => {
                  if (standard?.fetalHeartRate === null) return true; // Allow empty if FHR is not required
                  if (value == null) return "Fetal heart rate is required"; // Required if standard is set
                  return true;
                },
              })}
              onChange={(e) => {
                const value = parseFloat(e.target.value);

                if (value < 0) {
                  setWarnings((prev) => ({
                    ...prev,
                    fetalHeartRate: "Negative values are not allowed.",
                  }));
                } else if (
                  standard?.fetalHeartRate !== undefined &&
                  (value < 120 || value > (standard?.fetalHeartRate ?? 200))
                ) {
                  setWarnings((prev) => ({
                    ...prev,
                    fetalHeartRate: `Fetal heart rate is out of range (120 - ${standard.fetalHeartRate} bpm)`,
                  }));
                } else {
                  setWarnings((prev) => ({ ...prev, fetalHeartRate: "" }));
                }
              }}
              className="border border-black col-span-3"
            />
          </div>
          {/* Error Message (blocks submission) */}
          {errors.fetalHeartRate && (
            <p className="text-red-500 flex items-center justify-center">
              {errors.fetalHeartRate.message}
            </p>
          )}
          {warnings.fetalHeartRate && (
            <p className="text-yellow-500 flex items-center justify-center">
              {warnings.fetalHeartRate}
            </p>
          )}
          {standard?.fetalHeartRate === null && (
            <p className="text-sky-800 font-bold text-sm mt-1 text-center">
              In weeks 1, 2, 3, fetal heart rate is not required.
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
              className="col-span-3 border border-black"
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
