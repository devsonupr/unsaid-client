import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config.js";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
    mobileNo: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: "",
      name: "",
      password: "",
      confirmPassword: "",
      mobileNo: "",
    });
    setError("");
    setShowPassword(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // 🔴 Username must not contain spaces
  if (formData.username.includes(" ")) {
    setError("Username cannot contain spaces.");
    return;
  }

  // 🔴 Passwords must match (on register only)
  if (!isLogin && formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

   // ❌ Mobile number must be exactly 10 digits
  if (!isLogin && !/^\d{10}$/.test(formData.mobileNo)) {
    setError("Mobile number must be exactly 10 digits.");
    return;
  }

  try {
    const endpoint = isLogin
      ? `${BASE_URL}/api/auth/login`
      : `${BASE_URL}/api/auth/register`;

    const payload = isLogin
      ? {
          username: formData.username,
          password: formData.password,
        }
      : {
          name: formData.name,
          username: formData.username,
          password: formData.password,
          mobileNo: formData.mobileNo,
        };

    const response = await axios.post(endpoint, payload, {
      withCredentials: true,
    });

    localStorage.setItem("token", response.data.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.data));

    // window.location.href = "/home";
    navigate("/home");
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong.");
    setIsLoading(false);
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        {/* 🔵 LOGO HEADING */}
        <h1
          className="text-4xl font-bold text-gray-900 mb-6 text-center"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Unsaid.
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div className="inputBox">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <span>Full Name</span>
              </div>
              
              <div className="inputBox">
                <input
                  type="text"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <span>Mobile Number</span>
              </div>
            </>
          )}
          
          <div className="inputBox">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <span>Username</span>
          </div>
          
          <div className="inputBox">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <span>Password</span>
          </div>
          
          {!isLogin && (
            <div className="inputBox">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <span>Confirm Password</span>
            </div>
          )}

          {/* 🔓 Show Password Toggle */}
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
              className="mr-2"
            />
            Show Password
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {isLoading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={handleToggle}
             disabled={isLoading}
            className="text-blue-600 hover:underline font-semibold"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;