import { Check, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { API_ROUTES } from "@/routes/api";
import { BASE_URL, https } from "@/services/config";
import { CookiesService } from "@/services/cookies.service";
import toast from "react-hot-toast";
import { User } from "../Dashboard/Users/components/IUser";
import axios from "axios";
import { formatDate } from "@/lib/text";

interface MembershipPackage {
  id: string;
  packageName: string;
  description?: string;
  originalPrice: number;
  duration: number;
  status?: string;
  packageLevel?: string;
  imageUrl?: string;
  discount?: number;
  price?: number;
  maxRecordAdded: number;
  maxGrowthChartShares: number;
  hasGenerateAppointments: boolean;
  hasStandardDeviationAlerts: boolean;
  hasViewGrowthChart: boolean;
}

const PACKAGE_STYLES = {
  Bronze: {
    gradient: "from-amber-700 to-amber-900",
    border: "border-amber-500",
    shadow: "shadow-amber-100",
    hover: "hover:border-amber-400",
  },
  Silver: {
    gradient: "from-gray-400 to-gray-600",
    border: "border-gray-300",
    shadow: "shadow-gray-100",
    hover: "hover:border-gray-200",
  },
  Gold: {
    gradient: "from-yellow-400 to-yellow-600",
    border: "border-yellow-300",
    shadow: "shadow-yellow-100",
    hover: "hover:border-yellow-200",
  },
};

const BRONZE_FEATURES = [
  "Add children",
  "Create appointments",
  "View blogs",
  "View and comment on growth charts",
];

export default function MembershipContainer() {
  const [packages, setPackages] = useState<MembershipPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const userId = CookiesService.get();
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL + API_ROUTES.DASHBOARD_USER_DETAIL}`,
        {
          params: { Id: userId },
        }
      );
      const fetchedUser = {
        ...response.data.resultObj,
        role: response.data.resultObj.role?.name || null,
      };
      setIsExpired(
        new Date(fetchedUser.userMembershipResponses[0].endDate) < new Date()
      );
      setUser(fetchedUser);
    } catch (error) {
      console.error("Failed to fetch employee:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchMembershipPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await https.get(API_ROUTES.MEMBERSHIP);
        setPackages(response.data.resultObj.items || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải thông tin gói dịch vụ");
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipPackages();
  }, []);

  const handleSelect = (pkgId: string) => {
    if (userId) {
      const selectedPackage = packages.find((pkg) => pkg.id === pkgId);
      if (selectedPackage) {
        navigate(`/payment/${pkgId}`, {
          state: { pkg: selectedPackage, pkgId },
        });
      }
    } else {
      toast.error("Please login to buy packages");
    }
  };

  if (loading)
    return (
      <div className="flex min-h-[400px] items-center justify-center my-6">
        <div className="text-lg">Đang tải thông tin gói dịch vụ...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-[400px] items-center justify-center my-6">
        <div className="text-lg text-red-500">Lỗi: {error}</div>
      </div>
    );

  const getColor = (tier: string) => {
    switch (tier) {
      case "Bronze":
        return "text-[#cd7f32] hover:text-[#cd7f32]";
      case "Silver":
        return "text-[#c0c0c0] hover:text-[#c0c0c0]";
      case "Gold": // Corrected from "Bronze" to "Gold"
        return "text-[#ffd700] hover:text-[#ffd700]";
      default:
        return "text-gray-300 hover:text-gray-300"; // Fallback color
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <h1 className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
          Choose the Right Service Package
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Explore a range of packages designed to accompany your pregnancy
        </p>
        {!isExpired && (
          <p className="mt-4 text-lg text-emerald-400 font-bold">
            You are currently using{" "}
            <span
              className={`${getColor(
                user?.userMembershipResponses[0].package.packageLevel || ""
              )}`}
            >
              {user?.userMembershipResponses[0].package.packageName}
            </span>{" "}
            , expired at :{" "}
            {formatDate(user?.userMembershipResponses[0].endDate || "")}
          </p>
        )}

        <div className="mt-16 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => {
            const styles =
              PACKAGE_STYLES[pkg.packageLevel as keyof typeof PACKAGE_STYLES];
            const isPopular = pkg.packageLevel === "Silver";
            const savings = pkg.originalPrice - (pkg.price || 0);
            const formattedPrice = pkg.price
              ? `${Math.round(pkg.price).toLocaleString()}`
              : `${Math.round(pkg.originalPrice).toLocaleString()}`;
            const isBronze = pkg.packageLevel === "Bronze";

            return (
              <Card
                key={pkg.id}
                className={`relative flex flex-col transform transition-all duration-300 hover:scale-105 ${styles.border} ${styles.shadow} ${styles.hover}`}
              >
                {isPopular && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-32">
                    <Badge
                      variant="default"
                      className={`w-full bg-gradient-to-r ${styles.gradient} py-1 text-center text-white`}
                    >
                      Phổ biến nhất
                    </Badge>
                  </div>
                )}

                <div
                  className={`rounded-t-xl bg-gradient-to-br h-60  ${styles.gradient} p-6 text-white`}
                >
                  <h2 className="flex items-center justify-center gap-2 text-2xl font-bold">
                    {pkg.packageName}
                    {isPopular && <Star className="h-5 w-5 fill-current" />}
                  </h2>
                  <div className="mt-4 text-center">
                    <span className="text-4xl font-bold">{formattedPrice}</span>
                    <span className="text-lg"> VNĐ</span>
                    {!isBronze && (
                      <p className="mt-1 text-sm opacity-90">
                        {pkg.duration} days
                      </p>
                    )}
                  </div>
                  {!isBronze && pkg.discount && pkg.discount > 0 && (
                    <div className="mt-2 text-center">
                      <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
                        Save {Math.round(savings).toLocaleString()} VNĐ
                      </span>
                    </div>
                  )}
                  {isBronze && (
                    <div className="mt-2 text-center">
                      <br></br>
                      <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
                        System default packages
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-grow p-6">
                  <p className="text-gray-600">{pkg.description}</p>
                  <ul className="mt-6 space-y-3 text-sm">
                    {isBronze ? (
                      // Hiển thị tính năng cơ bản cho gói Bronze
                      BRONZE_FEATURES.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-500" />
                          {feature}
                        </li>
                      ))
                    ) : (
                      // Hiển thị tính năng cho các gói khác
                      <>
                        {pkg.maxRecordAdded !== 0 && (
                          <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            {pkg.maxRecordAdded === -1
                              ? "No limit record"
                              : `Max ${pkg.maxRecordAdded} record`}
                          </li>
                        )}
                        {pkg.maxGrowthChartShares !== 0 && (
                          <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            {pkg.maxGrowthChartShares === -1
                              ? "No limit share growth charts"
                              : `Maximum sharing ${pkg.maxGrowthChartShares} growth charts`}
                          </li>
                        )}
                        {pkg.hasGenerateAppointments && (
                          <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            Create automatic appointments
                          </li>
                        )}
                        {pkg.hasStandardDeviationAlerts && (
                          <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            Standard deviation warning
                          </li>
                        )}
                        {pkg.hasViewGrowthChart && (
                          <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            View growth charts
                          </li>
                        )}
                      </>
                    )}
                  </ul>
                </div>

                {!isBronze && (
                  <div className="p-6 pt-0">
                    <Button
                      className={`w-full bg-gradient-to-r ${styles.gradient} text-white hover:opacity-90`}
                      onClick={() => handleSelect(pkg.id)}
                      disabled={!isExpired}
                    >
                      Chọn Gói {pkg.packageLevel === "Silver" ? "Bạc" : "Vàng"}
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
