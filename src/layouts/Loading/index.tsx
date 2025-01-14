import { useEffect, useState } from "react";
import "./index.css";

interface LoadingProps {
  children?: React.ReactNode;
}

const Loading = ({ children }: LoadingProps) => {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-emerald-200">
        <div className="flex flex-col justify-center items-center">
          <p className="text-emerald-500 text-3xl font-semibold">
            Baby Care
          </p>
          <p className="mt-4 mb-4 text-emerald-500 text-xl font-semibold">
            Pregnancy Growth Tracking System
          </p>
          <div className="loader" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Loading;
