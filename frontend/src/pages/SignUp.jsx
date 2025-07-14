import React, { useState } from "react";
import { motion } from "framer-motion";
import Login from "./Login";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getApiBase } from "../utils/getAPIBase.js";

const API_BASE = getApiBase();

const SignUp = ({ showModal, setShowModal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showLoginModal, setLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!agreeTerms) {
      toast.error("You must agree to the terms and conditions!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/api/user/register`, {
        name,
        email,
        password,
      });

      toast.success("Account Created Successfully! 🎉");
      setTimeout(() => setShowModal(false), 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed! Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-filter backdrop-blur">
          <ToastContainer position="top-right" autoClose={3000} />
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
            <form onSubmit={handleSignUp}>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
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
                  Create Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              {password && (
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="form-checkbox"
                    required
                  />
                  <span className="ml-2 text-sm hover:underline hover:text-green-500">
                    I agree to all terms and conditions
                  </span>
                </label>
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
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
              </div>
            </form>
            <div className="mt-2 text-center">
              <a
                onClick={() => setLoginModal(true)}
                href="#"
                className="text-sm text-slate-800 hover:underline hover:text-secondary"
              >
                Already have an account?
              </a>
            </div>
          </motion.div>
        </div>
      )}
      {showLoginModal && (
        <Login showModal={showLoginModal} setShowModal={setLoginModal} />
      )}
    </>
  );
};

export default SignUp;
