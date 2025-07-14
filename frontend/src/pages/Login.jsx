import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SignUp from "./SignUp";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getApiBase } from "../utils/getAPIBase.js";

const API_BASE = getApiBase();

const Login = ({ showModal, setShowModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignUpModal, setSignUpModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/api/user/login`, {
        email,
        password,
      });

      toast.success("Login Successful! 🎉");
      const { name, profileInitial, token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ name, profileInitial, email }),
      );
      setTimeout(() => {
        setShowModal(false);
        window.dispatchEvent(new Event("storage"));
        navigate("/");
      }, 1000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed! Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-filter backdrop-blur">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-opacity-60 bg-white p-6 rounded-lg shadow-lg w-96 mx-auto"
            style={{
              boxShadow:
                "0 0 10px 0 rgb(105 167 156 / var(--tw-bg-opacity, 1))",
            }}
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-black shadow-lg w-80 mx-auto rounded-lg">
              Welcome to{" "}
              <span className="text-gray-700 font-extrabold">Stock</span>
              <span className="text-secondary font-extrabold">View</span>
            </h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <a
                  href="#"
                  className="text-sm text-secondary hover:underline hover:text-red-500"
                >
                  Forgot your password?
                </a>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mr-4 py-2 px-4 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
            <div className="mt-2 text-center">
              <a
                onClick={() => setSignUpModal(true)}
                href="#"
                className="text-sm text-slate-800 hover:underline hover:text-secondary"
              >
                Don't have an account?
              </a>
            </div>
          </motion.div>
        </div>
      )}

      {showSignUpModal && (
        <SignUp showModal={showSignUpModal} setShowModal={setSignUpModal} />
      )}
      <ToastContainer />
    </>
  );
};

export default Login;
