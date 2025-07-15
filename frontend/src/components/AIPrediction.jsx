import { useEffect, useState } from "react";
import { getApiBase } from "../utils/getAPIBase.js";
import { MutatingDots } from "react-loader-spinner";

const API_BASE = getApiBase();

const AIPrediction = ({ stock }) => {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [followQ, setFollowQ] = useState("");
  const [answerLoading, setAnswerLoading] = useState(false);

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
    } catch {
      setError("AI prediction failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const askAI = async (q = question) => {
    if (!q.trim()) return;
    setAnswerLoading(true);
    setModalOpen(true);
    try {
      const res = await fetch(`${API_BASE}/stock/ask/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setAnswer(data.result || "No answer received.");
    } catch {
      setAnswer("Something went wrong. Try again.");
    } finally {
      setAnswerLoading(false);
    }
  };

  useEffect(() => {
    fetchAI();
  }, [stock]);

  const formatAIResponse = (text) => {
    const lines = text.trim().split("\n").filter(Boolean);
    const elements = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();
      const next = lines[i + 1]?.trim() || "";

      if (/^\*\*(.+?): \*$/.test(line)) {
        const heading = line.match(/^\*\*(.+?): \*$/)?.[1]?.trim();
        elements.push(
          <div key={i} className="mt-4">
            <div className="font-bold italic text-gray-900">{heading}:</div>
            <div className="text-sm text-gray-700 mt-1">
              {parseStyledText(next)}
            </div>
          </div>,
        );
        i += 2;
      } else {
        elements.push(
          <div key={i} className="text-sm text-gray-700 mt-2">
            {parseStyledText(line)}
          </div>,
        );
        i++;
      }
    }
    return elements;
  };

  const parseStyledText = (line) => {
    const tokens = [];
    let pattern =
      /(\*\*(.+?)\*\*|\*(.+?)\*|\u20B9\d+(\.\d+)?|\bbuy\b|\bsell\b|\bhold\b)/gi;
    let last = 0;
    let match;

    while ((match = pattern.exec(line)) !== null) {
      const before = line.slice(last, match.index);
      if (before) tokens.push(before);

      const raw = match[0];
      if (/^\*\*(.+?)\*\*$/.test(raw)) {
        tokens.push(
          <span key={match.index} className="font-semibold text-gray-800">
            {raw.replace(/\*\*/g, "")}
          </span>,
        );
      } else if (/^\*(.+?)\*$/.test(raw)) {
        tokens.push(
          <span key={match.index} className="italic text-gray-600">
            {raw.replace(/\*/g, "")}
          </span>,
        );
      } else if (/\u20B9\d+(\.\d+)?/.test(raw)) {
        tokens.push(
          <span key={match.index} className="text-green-600 font-medium">
            {raw}
          </span>,
        );
      } else if (/buy/i.test(raw)) {
        tokens.push(
          <span
            key={match.index}
            className="text-green-700 font-bold uppercase"
          >
            {raw}
          </span>,
        );
      } else if (/sell/i.test(raw)) {
        tokens.push(
          <span key={match.index} className="text-red-600 font-bold uppercase">
            {raw}
          </span>,
        );
      } else if (/hold/i.test(raw)) {
        tokens.push(
          <span
            key={match.index}
            className="text-yellow-600 font-bold uppercase"
          >
            {raw}
          </span>,
        );
      }
      last = pattern.lastIndex;
    }
    const remaining = line.slice(last);
    if (remaining) tokens.push(remaining);
    return tokens;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6 space-y-6">
      <h2 className="text-xl font-bold text-secondary">AI Stock Prediction</h2>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <MutatingDots
            height={100}
            width={100}
            color="#69A79C"
            secondaryColor="#ff0000"
            radius={12.5}
            visible={true}
          />
        </div>
      )}

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

          <div className="bg-gray-50 rounded-lg p-4 border space-y-1">
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
              <strong>Best Buy Price:</strong>{" "}
              <span className="text-green-600 font-semibold">
                ₹{aiData.bestBuyPrice}
              </span>
            </p>
            <p>
              <strong>Best Sell Price:</strong>{" "}
              <span className="text-green-600 font-semibold">
                ₹{aiData.bestSellPrice}
              </span>
            </p>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 border">
            <h4 className="font-semibold mb-2">Company Overview:</h4>
            <p className="text-gray-700">{aiData.summary}</p>
          </div>

          <div className="pt-4">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              type="text"
              placeholder="Ask any financial question..."
              className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              onKeyDown={(e) => e.key === "Enter" && askAI()}
            />
          </div>
        </>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl h-[400px] relative shadow-xl flex flex-col overflow-hidden">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-2 text-secondary">
              AI Response
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar">
              {answerLoading ? (
                <div className="flex justify-center items-center h-full">
                  <MutatingDots
                    height={100}
                    width={100}
                    color="#69A79C"
                    secondaryColor="#ff0000"
                    radius={12.5}
                    visible={true}
                  />
                </div>
              ) : (
                formatAIResponse(answer)
              )}
            </div>
            <div className="mt-4 pt-2 border-t">
              <input
                value={followQ}
                onChange={(e) => setFollowQ(e.target.value)}
                className="w-full border px-3 py-2 rounded text-sm focus:ring focus:ring-blue-300"
                type="text"
                placeholder="Ask more..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    askAI(followQ);
                    setFollowQ("");
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPrediction;
