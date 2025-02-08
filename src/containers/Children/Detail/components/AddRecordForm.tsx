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

// Define form types
type ChildFormValues = {
  height: number;
  weight: number;
  headCircumference: number;
  abdominalCircumference: number;
  fetalHeartRate: number;
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

  const handleLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
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
      handleLoading();
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
          {/* Height */}
          <div className="grid grid-cols-4 items-center gap-4 ">
            <Label htmlFor="height" className="text-right">
              Height (cm)
            </Label>
            <Input
              type="number"
              step="any"
              {...register("height", {
                required: "Height is required",
                setValueAs: (value) => (value ? parseFloat(value) : undefined),
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
              type="number"
              step="any"
              {...register("weight", {
                required: "Weight is required",
                setValueAs: (value) => (value ? parseFloat(value) : undefined),
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
              type="number"
              step="any"
              {...register("headCircumference", {
                required: "Head circumference is required",
                setValueAs: (value) => (value ? parseFloat(value) : undefined),
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
              type="number"
              step="any"
              {...register("abdominalCircumference", {
                required: "Abdominal circumference is required",
                setValueAs: (value) => (value ? parseFloat(value) : undefined),
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
              {...register("fetalHeartRate", {
                required: "Heart rate is required",
              })}
              className="col-span-3"
            />
          </div>
          {errors.fetalHeartRate && (
            <p className="text-red-500 flex items-center justify-center">
              {errors.fetalHeartRate.message}
            </p>
          )}

          {/* Week of Pregnancy */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="weekOfPregnancy" className="text-right">
              Week Of Pregnancy
            </Label>
            <select
              className="col-span-3  shadow-sm  p-2 rounded-md"
              {...register(`weekOfPregnancy`, {
                required: "Week is required",
              })}
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

          {/* Health Condition */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="healthCondition" className="text-right">
              Health Condition
            </Label>
            <Input
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
