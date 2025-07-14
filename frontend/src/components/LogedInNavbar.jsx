import React, { useState, useEffect, useRef } from "react";
import {
  IoMdLogOut,
  IoMdList,
  IoMdCalculator,
  IoMdClose,
} from "react-icons/io";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useStock } from "../context/StockContext";
import CalculatorModal from "./ModalComp/CalculatorModal";
import { getApiBase } from "../utils/getAPIBase";

const API_BASE = getApiBase();

const LNavbar = ({ user }) => {
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [stock, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const profileImage = null;
  const navigate = useNavigate();
  const { setSelectedStock } = useStock();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setFilteredStocks([]);
        setSearchVisible(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    fetch("/stock.json")
      .then((res) => res.json())
      .then((data) => setStocks(data))
      .catch((err) => console.error("Failed to fetch stocks: ", err));
  }, []);

  useEffect(() => {
    const searchStock = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setFilteredStocks([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const filtered = stock.filter(
        (stock) =>
          stock["Issuer Name"]
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          stock["Security Id"]
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          stock["Sector Name"]
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );

      setFilteredStocks(filtered.slice(0, 11));
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(searchStock);
  }, [searchQuery, stock]);

  const fetchWishlist = async () => {
    if (!storedUser?.email) return;

    try {
      const res = await fetch(
        `${API_BASE}/stock/wishlist/${storedUser.email}`,
      );
      const data = await res.json();
      setWishlist(data);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  };

  const handleStockClick = (stock) => {
    setSearchQuery("");
    setFilteredStocks([]);
    setSelectedStock(stock);
    setSearchVisible(false);
    navigate(`/stock/${encodeURIComponent(stock["Security Id"])}`);
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter" && filteredStocks.length > 0) {
      e.preventDefault();
      handleStockClick(filteredStocks[0]);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully! 🚪");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const profileInitial = storedUser?.name.charAt(0).toUpperCase();

  return (
    <>
      <nav className="sticky top-0 z-50 shadow-sm w-full bg-white backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="container py-4 px-5 flex justify-between items-center"
        >
          <a href="/">
            <h1 className="font-bold text-2xl">
              Stock<span className="text-secondary font-extrabold">View</span>
            </h1>
          </a>

          <div
            className="relative w-full flex flex-col items-center"
            ref={menuRef}
          >
            <form
              className={`lg:flex w-1/3 ${searchVisible ? "block" : "hidden"}`}
            >
              <input
                ref={searchRef}
                type="text"
                placeholder="Search Your Favourite Stocks/MF/ETFs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleEnterKey}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              {filteredStocks.length > 0 && (
                <div
                  className="absolute mt-11 w-1/3 max-h-72 overflow-y-auto bg-white bg-opacity-90 backdrop-blur-lg shadow-lg rounded-lg z-50 no-scrollbar"
                  style={{ border: "1px solid #ddd" }}
                  ref={dropdownRef}
                >
                  {filteredStocks.map((stock, index) => (
                    <div
                      key={index}
                      className="stock-item p-2 border-b border-secondary last:border-b-0 hover:bg-secondary hover:text-dark cursor-pointer"
                      onClick={() => handleStockClick(stock)}
                    >
                      <h3>
                        {stock["Issuer Name"]}{" "}
                        <span className="text-secondary hover:text-white">
                          ({stock["Security Id"]})
                        </span>
                      </h3>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <button onClick={() => setSearchVisible(true)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </button>
            </div>

            <div className="relative">
              <button onClick={() => setShowDropdown(!showDropdown)}>
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white">
                    {profileInitial}
                  </div>
                )}
              </button>

              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50"
                >
                  <button
                    onClick={() => {
                      setWishlistModalOpen(true);
                      fetchWishlist();
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100"
                  >
                    <IoMdList />
                    Wishlist
                  </button>

                  <button
                    onClick={() => setIsCalcOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100"
                  >
                    <IoMdCalculator />
                    Calculator
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 w-full text-red-600 hover:bg-gray-100"
                  >
                    <IoMdLogOut />
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </nav>

      {wishlistModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-sm relative">
            <button
              onClick={() => setWishlistModalOpen(false)}
              className="absolute top-2 right-4 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-secondary mb-4">
              My Wishlist
            </h2>
            {wishlist.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                No items in wishlist.
              </p>
            ) : (
              <ul className="space-y-2">
                {wishlist.map((item) => (
                  <li
                    key={item.stockId}
                    className="hover:bg-gray-100 p-2 rounded-md cursor-pointer transition"
                    onClick={() => {
                      setWishlistModalOpen(false);
                      navigate(`/stock/${item.stockId}`);
                    }}
                  >
                    {item.stockName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {searchVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex justify-center items-start pt-20 px-4"
          ref={searchRef}
        >
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl p-10 relative">
            <button
              className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={() => setSearchVisible(false)}
            >
              <IoMdClose />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleEnterKey}
              placeholder="Search stocks..."
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:border-secondary focus:outline-none"
              autoFocus
            />
            {isLoading && (
              <div className="text-center text-gray-400">Loading...</div>
            )}
            <ul>
              {filteredStocks.map((stock) => (
                <li
                  key={stock["Security Id"]}
                  onClick={() => handleStockClick(stock)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
                >
                  {stock["Issuer Name"]} ({stock["Security Id"]})
                </li>
              ))}
              {!isLoading &&
                filteredStocks.length === 0 &&
                searchQuery !== "" && (
                  <li className="px-3 py-2 text-gray-500 text-center">
                    No results found.
                  </li>
                )}
            </ul>
          </div>
        </div>
      )}

      <CalculatorModal
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
      />
      <ToastContainer />
    </>
  );
};

export default LNavbar;
