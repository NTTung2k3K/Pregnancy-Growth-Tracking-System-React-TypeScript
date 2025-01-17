import React, { useState } from "react";
import { Controller } from "react-hook-form";

interface OtpInputProps {
  length: number;
  onChange: (otp: string) => void;
  name: string;
  control: any;
  rules?: any;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length,
  onChange,
  name,
  control,
  rules,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const { value } = e.target;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[idx] = value;
      setOtp(newOtp);
      onChange(newOtp.join(""));

      if (value && idx < length - 1) {
        const nextInput = document.getElementById(`otp-${idx + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      const prevInput = document.getElementById(`otp-${idx - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text");
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.slice(0, length).split("");
      setOtp(newOtp);
      onChange(newOtp.join(""));
      const nextInput = document.getElementById(
        `otp-${Math.min(newOtp.length, length) - 1}`
      );
      nextInput?.focus();
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ fieldState }) => (
        <>
          <div
            className="flex justify-center space-x-4 mb-4"
            onPaste={handlePaste}
          >
            {otp.map((value, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                value={value}
                maxLength={1}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          {fieldState.error && (
            <span className="text-red-500 text-sm">
              {fieldState.error.message}
            </span>
          )}
        </>
      )}
    />
  );
};

export default OtpInput;
