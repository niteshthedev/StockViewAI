import React, { useState } from "react";
import { toast } from "react-toastify";

const AlertForm = ({ stocks, onSetAlert }) => {
  const [selectedStock, setSelectedStock] = useState("");
  const [alertPrice, setAlertPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStock || !alertPrice) {
      toast.error("Please select a stock and enter a valid price.");
      return;
    }

    onSetAlert({ stock: selectedStock, price: alertPrice });
    toast.success(`Alert set for ${selectedStock} at $${alertPrice}`);
    setSelectedStock("");
    setAlertPrice("");
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Set Stock Alert</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select
          value={selectedStock}
          onChange={(e) => setSelectedStock(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select a stock</option>
          {stocks.map((stock) => (
            <option key={stock.name} value={stock.name}>
              {stock.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Enter alert price"
          value={alertPrice}
          onChange={(e) => setAlertPrice(e.target.value)}
          className="p-2 border rounded"
        />

        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          Set Alert
        </button>
      </form>
    </div>
  );
};

export default AlertForm;
