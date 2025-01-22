import React from "react";
import { useLocation } from "react-router-dom";

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const { state } = location as { state: { redirectUrl: string } };

  if (!state || !state.redirectUrl) {
    return <div>Invalid payment details. Please try again.</div>;
  }

  const handleProceedToPayment = () => {
    window.location.href = state.redirectUrl; // Chuyển hướng tới VNPay
  };

  return (
    <div className="bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto text-center bg-white shadow-lg p-6 rounded-lg">
        <h1 className="text-4xl font-bold text-gray-800">Payment Details</h1>
        <p className="text-gray-600 mt-4">Confirm your membership package and proceed to payment.</p>
        <button
          onClick={handleProceedToPayment}
          className="mt-6 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Proceed to VNPay
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
