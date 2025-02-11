"use client";

import { Check, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { API_ROUTES } from "@/routes/api";
import { https } from "@/services/config";

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
  "Thêm trẻ em",
  "Tạo lịch hẹn",
  "Xem blog",
  "Xem và bình luận các biểu đồ tăng trưởng",
];

export default function MembershipContainer() {
  const [packages, setPackages] = useState<MembershipPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
    const selectedPackage = packages.find((pkg) => pkg.id === pkgId);
    if (selectedPackage) {
      navigate(`/payment/${pkgId}`, { state: { pkg: selectedPackage, pkgId } });
    }
  };

  if (loading)
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg">Đang tải thông tin gói dịch vụ...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg text-red-500">Lỗi: {error}</div>
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <h1 className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
          Chọn Gói Dịch Vụ Phù Hợp
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Khám phá các gói dịch vụ đa dạng, được thiết kế để đồng hành cùng thai
          kỳ của bạn
        </p>

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
                        {pkg.duration} ngày
                      </p>
                    )}
                  </div>
                  {!isBronze && pkg.discount && pkg.discount > 0 && (
                    <div className="mt-2 text-center">
                      <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
                        Tiết kiệm {Math.round(savings).toLocaleString()} VNĐ
                      </span>
                    </div>
                  )}
                  {isBronze && (
                    <div className="mt-2 text-center">
                      <br></br>
                      <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
                        Gói mặc định của hệ thống
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
                              ? "Không giới hạn số lượng hồ sơ"
                              : `Tối đa ${pkg.maxRecordAdded} hồ sơ`}
                          </li>
                        )}
                        {pkg.maxGrowthChartShares !== 0 && (
                          <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            {pkg.maxGrowthChartShares === -1
                              ? "Không giới hạn chia sẻ biểu đồ"
                              : `Chia sẻ tối đa ${pkg.maxGrowthChartShares} biểu đồ`}
                          </li>
                        )}
                        {pkg.hasGenerateAppointments && (
                          <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            Tạo lịch hẹn tự động
                          </li>
                        )}
                        {pkg.hasStandardDeviationAlerts && (
                          <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            Cảnh báo độ lệch chuẩn
                          </li>
                        )}
                        {pkg.hasViewGrowthChart && (
                          <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            Xem biểu đồ tăng trưởng
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
