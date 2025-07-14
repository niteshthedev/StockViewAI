import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { MutatingDots } from "react-loader-spinner";
import { getApiBase } from "../utils/getAPIBase.js";

const API_BASE = getApiBase();

const StockGraph = ({ symbol }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeChart = () => {
    if (!chartContainerRef.current) return null;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        backgroundColor: "transparent",
        textColor: "#000",
      },
      grid: {
        vertLines: { color: "#e0e0e0" },
        horzLines: { color: "#e0e0e0" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 5,
        barSpacing: 6,
        fixLeftEdge: true,
        fixRightEdge: false,
        lockVisibleTimeRangeOnResize: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: "#d1d4dc",
      },
    });

    const series = chart.addCandlestickSeries({
      upColor: "#69a79c",
      borderUpColor: "#4fff00",
      wickUpColor: "#69a79c",
      downColor: "#ff0000",
      borderDownColor: "#ff0000",
      wickDownColor: "#FF0000",
    });

    chartRef.current = chart;
    seriesRef.current = series;
  };

  useEffect(() => {
    // Initial chart setup
    initializeChart();

    return () => {
      chartRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!symbol) return;
    setIsLoading(true);

    // Remove old series and add a new one for fresh data
    if (chartRef.current) {
      chartRef.current.removeSeries(seriesRef.current);
      seriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: "#69a79c",
        borderUpColor: "#4fff00",
        wickUpColor: "#69a79c",
        downColor: "#ff0000",
        borderDownColor: "#ff0000",
        wickDownColor: "#FF0000",
      });
    }

    fetch(`${API_BASE}/stock/graph/${symbol}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0 && seriesRef.current) {
          seriesRef.current.setData(data);
          chartRef.current.timeScale().fitContent();
          chartRef.current.timeScale().scrollToPosition(0, false);
        }
      })
      .catch((err) => {
        console.error("Error fetching graph data:", err);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
  }, [symbol]);

  return (
    <div className="relative w-full h-[400px]">
      <div ref={chartContainerRef} className="w-full h-full" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-20">
          <MutatingDots
            height="100"
            width="100"
            color="#69A79C"
            secondaryColor="red"
            radius="12.5"
            ariaLabel="mutating-dots-loading"
            visible={true}
          />
        </div>
      )}

      <div className="absolute bottom-7 left-0 mb-4 mr-4 z-10">
        <span className="text-gray-300 text-sm opacity-80 bg-opacity-50 p-2 rounded hover:text-black">
          ©{" "}
          <a
            href="https://www.tradingview.com/lightweight-charts/"
            target="_blank"
            rel="noreferrer"
            className="text-gray-300 hover:text-black"
          >
            TradingView Lightweight Charts
          </a>
        </span>
      </div>
    </div>
  );
};

export default StockGraph;
