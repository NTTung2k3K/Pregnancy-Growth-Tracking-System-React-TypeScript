import { IconBadge } from "@/components/IconBadge";
import {
  Baby,
  ChartColumnIncreasing,
  CircleArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL, configHeaders } from "@/services/config";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";
import toast from "react-hot-toast";
import { ROUTES } from "@/routes";
import { formatDate } from "@/lib/text";
import { API_ROUTES } from "@/routes/api";
import { GrowthChart } from "../components/IGrowthCharts";
import { GrowthCharts } from "../../Appointment/components/chart-record";
import { CommentsSection } from "../../components/CommentSection";
import {
  CookiesEmployeeService,
} from "@/services/cookies.service";
import { MdFamilyRestroom } from "react-icons/md";

interface GrowthChartsFormValues {
  status: number;
}

const GrowthChartUpdateContainer = () => {
  const { register, handleSubmit, setValue } =
    useForm<GrowthChartsFormValues>();
  const { id } = useParams();
  const [chart, setChart] = useState<GrowthChart>();
  const [status, setStatus] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentUserId = CookiesEmployeeService.get();

  const fetchStatus = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.DASHBOARD_GROWTH_CHARTS_STATUS_ALL}`,
        {
          params: {
            isAdminUpdate: true,
          },
        }
      );
      setStatus(response.data.resultObj);
    } catch (error) {
      console.error("Failed to fetch status:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchChart = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.DASHBOARD_GROWTH_CHARTS_DETAIL}`,
        {
          params: { Id: Number(id) },
        }
      );
      const fetchedChart = response.data.resultObj;

      setValue(
        "status",
        fetchedChart.status == "Shared"
          ? 1
          : fetchedChart.status == "Blocked"
          ? 2
          : 3
      );

      setChart(fetchedChart);
    } catch (error) {
      console.error("Failed to fetch chart:", error);
    }
  };

  useEffect(() => {
    fetchChart();
  }, []);

  const handleLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  };

  const onSubmit = async (data: GrowthChartsFormValues) => {
    try {
      handleLoading();
      const response = await axios.put(
        `${BASE_URL + API_ROUTES.DASHBOARD_GROWTH_CHARTS_UPDATE}`,
        {
          growthChartId: id,
          status: Number(data.status),
        },
        {
          headers: configHeaders(),
        }
      );
      if (response.data.statusCode === 200) {
        window.location.href = `${ROUTES.DASHBOARD_GROWTH_CHARTS}`;
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };

  return (
    <div>
      <div className="mt-10">
        <Link className="p-6" to={ROUTES.DASHBOARD_GROWTH_CHARTS}>
          <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700">
            <CircleArrowLeft />
            Back
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Update Chart</h1>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ChartColumnIncreasing} />
                <h2 className="text-xl text-sky-900 font-semibold">
                  Chart Information
                </h2>
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">Topic</div>
                <p className="flex-1 p-2">{chart?.topic}</p>
              </div>
              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  Question
                </div>
                <p className="flex-1 p-2">{chart?.question}</p>
              </div>

              <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                <div className="font-medium flex items-center mr-10">
                  View Count
                </div>
                <p className="flex-1 p-2">{chart?.viewCount}</p>
              </div>
              <div>
                <div className="flex items-center gap-x-2 mt-6">
                  <IconBadge icon={ShieldCheck} />
                  <h2 className="text-xl text-sky-900 font-semibold">Status</h2>
                </div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10">
                    Status
                  </div>
                  <select className="flex-1 p-2" {...register("status")}>
                    {status.map((item: any) => (
                      <option value={item.id}>{item.status}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-x-2 mt-6">
                  <IconBadge icon={MdFamilyRestroom} />
                  <h2 className="text-xl text-sky-900 font-semibold">Parent</h2>
                </div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10">
                    Name
                  </div>
                  <p>{chart?.userViewModel.fullName}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Baby} />
                  <h2 className="text-xl text-sky-900 font-semibold">
                    Baby Profile
                  </h2>
                </div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10">
                    Name
                  </div>
                  <p className="flex-1 p-2">{chart?.childModelView.name}</p>
                </div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10">
                    Gender
                  </div>
                  <p className="flex-1 p-2">
                    {chart?.childModelView.fetalGender}
                  </p>
                </div>
                <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
                  <div className="font-medium flex items-center mr-10">
                    Date Of Birth
                  </div>
                  <p className="flex-1 p-2">
                    {formatDate(chart?.childModelView.dueDate!)}
                  </p>
                </div>
                <div className="flex items-center justify-center mt-4 border bg-slate-100 rounded-md p-4">
                  <img
                    className=""
                    width={200}
                    src={chart?.childModelView.photoUrl || ""}
                    alt="Img"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end mt-10 mr-10">
            <Button
              disabled={isLoading}
              className="bg-sky-900 text-emerald-400 px-10 py-6 text-xl"
              type="submit"
            >
              {isLoading && <AiOutlineLoading className="animate-spin" />}
              Save
            </Button>
          </div>
          <div className="my-10">
            {chart?.childModelView && (
              <GrowthCharts child={chart?.childModelView} />
            )}
          </div>
        </div>
      </form>
      <div className="p-6">
        <CommentsSection
          growthChartId={Number(id)}
          currentUserId={currentUserId ?? ""}
          status={chart?.status ?? "unknown"}
        />
      </div>
    </div>
  );
};

export default GrowthChartUpdateContainer;
