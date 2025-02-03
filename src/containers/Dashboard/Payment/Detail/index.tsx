import { CircleArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "@/routes";
import { Payment } from "@/containers/Dashboard/Payment";

const PaymentDetailContainer = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState<Payment>();

  const fetchPayment = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Payments/get-by-id`, {
        params: { id: id },
      });
      const fetchedPayment = {
        ...response.data.resultObj,
      };
      setPayment(fetchedPayment);
    } catch (error) {
      console.error("Failed to fetch Payment:", error);
    }
  };

  useEffect(() => {
    fetchPayment();
  }, []);

  return (
    <>
      <div className="p-6">
        <Link to={ROUTES.DASHBOARD_PAYMENT}>
          <Button className="bg-sky-900 text-emerald-400 hover:bg-sky-700">
            <CircleArrowLeft />
            Back
          </Button>
        </Link>
        <div className="flex items-center justify-between mt-8">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Payment Detail</h1>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            {/* Package Name */}
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Name of buyer
              </div>
              <p className="flex-1 p-2">
                {payment?.userMembership.user.fullName}
              </p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Email
              </div>
              <p className="flex-1 p-2">{payment?.userMembership.user.email}</p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Payment Time
              </div>
              <p className="flex-1 p-2">{payment?.paymentDate}</p>
            </div>
            {/* Description */}
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Payment Method
              </div>
              <p className="flex-1 p-2">{payment?.paymentMethod}</p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Status
              </div>
              <p className="flex-1 p-2">{payment?.status}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Show Priority */}
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Package Name
              </div>
              <p className="flex-1 p-2">
                {payment?.userMembership.package.packageName}
              </p>
            </div>

            {/* Package Level */}
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Original Price
              </div>
              <p className="flex-1 p-2">
                {Math.round(
                  payment?.userMembership?.package?.originalPrice ?? 0
                ).toLocaleString()}{" "}
                VNĐ
              </p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Discount
              </div>
              <p className="flex-1 p-2">
                {(payment?.userMembership?.package?.discount ?? 0) * 100}
                <span>%</span>
              </p>
            </div>
            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Price
              </div>
              <p className="flex-1 p-2">
                {Math.round(
                  payment?.userMembership?.package?.price ?? 0
                ).toLocaleString()}{" "}
                VNĐ
              </p>
            </div>

            <div className="flex mt-4 border bg-slate-100 rounded-md p-4">
              <div className="font-medium flex items-center mr-10 w-1/6">
                Duration
              </div>
              <p className="flex-1 p-2">
                {payment?.userMembership.package.duration} days
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentDetailContainer;
