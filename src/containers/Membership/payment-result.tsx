import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // import useNavigate

interface Result {
    message: string;
    detail: string;
  }

const PaymentResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // khai báo useNavigate
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const resultParam = queryParams.get("result");

    if (resultParam === "true") {
        setResult({
          message: "✅ Congratulations! Your payment was successful.",
          detail: "Thank you for choosing our service. We will be in contact with more details shortly."
        });
      } else if (resultParam === "false") {
        setResult({
          message: "❌ Payment failed. Please try again.",
          detail: "If you need assistance, feel free to contact our support team."
        });
      } else {
        setResult({
          message: "⚠️ Invalid result parameter.",
          detail: "Please check your link or try again later."
        });
      }
    }, [location]);

  const handleBackToHome = () => {
    navigate("/"); // Chuyển hướng về trang chủ
  };

  return (
    <div className="bg-pink-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg p-6 rounded-lg text-center">
        <h1 className="text-4xl font-semibold text-pink-700 mb-4">
          Payment Result
        </h1>
        <p className="mt-2 text-center text-3xl text-gray-600">{result?.message}</p>
        <br></br>
        <p className="mt-2 text-center text-1xl text-gray-600">{result?.detail}</p>
        <img 
          src="/assets/images/login-img.jpg"
          alt="Thai kỳ"
          className="mt-6 m-auto rounded-lg shadow-md block"
        />
        <div className="mt-6">
          <button
            onClick={handleBackToHome}
            className="py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;