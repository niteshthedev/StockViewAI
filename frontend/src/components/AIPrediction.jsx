import { useEffect, useState } from "react";
import { getApiBase } from "../utils/getAPIBase.js";
const API_BASE = getApiBase();

const AIPrediction = ({ stock }) => {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAI = async () => {
    if (!stock) return;

    setLoading(true);
    setError(null);
    setAiData(null);

    try {
      const res = await fetch(`${API_BASE}/stock/ai/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stock),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAiData(data);
    } catch (err) {
      setError("AI prediction failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAI();
  }, [stock]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6 space-y-6">
      <h2 className="text-xl font-bold text-secondary">AI Stock Prediction</h2>

      {loading && <p className="text-gray-400">Loading AI analysis...</p>}

      {!loading && error && (
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button
            onClick={fetchAI}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && aiData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-green-600">
                Pros
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {aiData.pros?.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-red-600">Cons</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {aiData.cons?.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border">
            <p>
              <strong>Recommendation:</strong>{" "}
              <span
                className={`font-bold uppercase ${
                  aiData.recommendation === "buy"
                    ? "text-green-600"
                    : aiData.recommendation === "sell"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {aiData.recommendation}
              </span>
            </p>
            <p>
              <strong>Best Buy Price:</strong> ₹{aiData.bestBuyPrice || "N/A"}
            </p>
            <p>
              <strong>Best Sell Price:</strong> ₹{aiData.bestSellPrice || "N/A"}
            </p>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 border">
            <h4 className="font-semibold mb-2">Company Overview:</h4>
            <p className="text-gray-700">{aiData.summary}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default AIPrediction;
