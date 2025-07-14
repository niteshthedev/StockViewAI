import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiBase } from "../../utils/getAPIBase.js";

const API_BASE = getApiBase();

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [prices, setPrices] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/stock.json");
        const data = await res.json();

        const filtered = data.filter((stock) =>
          ["PAYTM", "EIEL", "SWIGGY", "PNGJL", "KROSS", "IGIL"].includes(
            stock["Security Id"],
          ),
        );

        setStocks(filtered);

        const pricePromises = filtered.map((stock) =>
          fetch(`${API_BASE}/stock/${stock["Security Id"]}`)
            .then((res) => res.json())
            .then((priceData) => ({
              id: stock["Security Id"],
              price: priceData.priceInfo.lastPrice,
            }))
            .catch((err) => {
              console.error(
                "Error fetching price for",
                stock["Security Id"],
                err,
              );
              return null;
            }),
        );

        const results = await Promise.all(pricePromises);
        const newPrices = {};
        results.forEach((item) => {
          if (item) {
            newPrices[item.id] = item.price;
          }
        });

        setPrices(newPrices);
      } catch (error) {
        console.error("Error loading stocks:", error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (stockId) => {
    navigate(`/stock/${stockId}`);
  };

  const getPriceChangeClass = (currentPrice, previousPrice) => {
    if (currentPrice > previousPrice) {
      return {
        className: "text-green-600",
        change: `+${(currentPrice - previousPrice).toFixed(2)}`,
      };
    } else if (currentPrice < previousPrice) {
      return {
        className: "text-red-600",
        change: `-${(previousPrice - currentPrice).toFixed(2)}`,
      };
    }
    return { className: "text-gray-600", change: "" };
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.map((stock) => {
          const currentPrice = prices[stock["Security Id"]];
          const { className, change } = getPriceChangeClass(
            currentPrice,
            currentPrice, // Compare to itself since no previous price logic here
          );

          return (
            <div
              key={stock["Security Id"]}
              onClick={() => handleClick(stock["Security Id"])}
              className="cursor-pointer bg-white p-4 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <h2 className="text-lg font-semibold text-secondary mb-1">
                {stock["Issuer Name"]}
              </h2>
              <p className="text-xs text-gray-600">
                {stock["Industry New Name"]}
              </p>
              <p className="mt-3 text-lg font-bold">
                {currentPrice !== undefined ? (
                  <span className="text-gray-800">₹ {currentPrice}</span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-400 h-5">
                    {[...Array(3)].map((_, i) => (
                      <span
                        key={i}
                        className="text-xl animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      >
                        .
                      </span>
                    ))}
                  </span>
                )}
                {currentPrice !== undefined && (
                  <span className={`ml-2 text-sm ${className}`}>{change}</span>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
