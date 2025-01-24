import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { https } from "@/services/config";
import { API_ROUTES } from "@/routes/api";
import { CookiesService } from "@/services/cookies.service";

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const { state } = location as { state: { pkg: { packageName: string; description: string; price: string; duration: number; packageLevel: string }; pkgId: string } };
  
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initiatePayment = async () => {
      try {
        if (!state || !state.pkgId || !state.pkg) {
          setError("Invalid payment details. Please try again.");
          return;
        }

        const userId = CookiesService.get();
        if (!userId) {
          setError("User ID not found. Please log in again.");
          return;
        }

        const response = await https.post(API_ROUTES.BUYPACKAGE, {
          packageId: state.pkgId,
          userId,
        });

        setRedirectUrl(response.data.resultObj.redirectUrlVnPay);
      } catch (err) {
        console.error("Error initiating payment:", err);
        setError("Failed to initiate payment. Please try again.");
      }
    };

    initiatePayment();
  }, [state]);

  const handleProceedToPayment = () => {
    if (redirectUrl) {
      window.location.replace(redirectUrl);
    }
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!redirectUrl) {
    return <div className="text-center">Loading payment details...</div>;
  }

  // Format price to VND
  const formattedPrice = state.pkg?.price
    ? `${Math.round(Number(state.pkg?.price)).toLocaleString()} VND`
    : '';

  return (
    <div className="bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl p-8 rounded-xl border-2 border-blue-200">
        <h1 className="text-5xl font-extrabold text-blue-600 text-center mb-6">
          Payment Details
        </h1>
        <div className="mt-6">
          <h2 className="text-3xl font-semibold text-blue-500">Package Information</h2>
          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-blue-700 font-medium">Package Name</label>
              <input
                type="text"
                value={state.pkg?.packageName || ''}
                readOnly
                className="w-full border-2 border-blue-300 px-4 py-3 rounded-lg bg-blue-100 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-blue-700 font-medium">Description</label>
              <textarea
                value={state.pkg?.description || ''}
                readOnly
                className="w-full border-2 border-blue-300 px-4 py-3 rounded-lg bg-blue-100 text-gray-700"
              ></textarea>
            </div>
            <div>
              <label className="block text-blue-700 font-medium">Price</label>
              <input
                type="text"
                value={formattedPrice}
                readOnly
                className="w-full border-2 border-blue-300 px-4 py-3 rounded-lg bg-blue-100 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-blue-700 font-medium">Duration (days)</label>
              <input
                type="text"
                value={state.pkg?.duration || ''}
                readOnly
                className="w-full border-2 border-blue-300 px-4 py-3 rounded-lg bg-blue-100 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-blue-700 font-medium">Package Level</label>
              <input
                type="text"
                value={state.pkg?.packageLevel || ''}
                readOnly
                className="w-full border-2 border-blue-300 px-4 py-3 rounded-lg bg-blue-100 text-gray-700"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleProceedToPayment}
            className="py-3 px-8 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
