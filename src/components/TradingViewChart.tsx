"use client";

import { useEffect, useRef, useState } from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";

type Candle = {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
};

async function fetchMonthlyCandles(): Promise<Candle[]> {
  const res = await fetch(
    "https://api.binance.com/api/v3/klines?symbol=SOLUSDT&interval=1M&limit=1000",
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to load market data");

  const rows: (string | number)[][] = await res.json();

  return rows.map((k) => ({
    time: Math.floor(Number(k[0]) / 1000) as UTCTimestamp,
    open: parseFloat(String(k[1])),
    high: parseFloat(String(k[2])),
    low: parseFloat(String(k[3])),
    close: parseFloat(String(k[4])),
  }));
}

export function TradingViewChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(255, 255, 255, 0.85)",
        fontFamily: "Sohne, var(--font-inter), Inter, system-ui, sans-serif",
        fontSize: 10,
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.1)" },
        horzLines: { color: "rgba(255, 255, 255, 0.1)" },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.08, bottom: 0.06 },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        fixLeftEdge: true,
        rightOffset: 8,
        minBarSpacing: 0.5,
      },
      crosshair: {
        vertLine: {
          color: "rgba(255,255,255,0.25)",
          labelBackgroundColor: "rgba(0,0,0,0.65)",
        },
        horzLine: {
          color: "rgba(255,255,255,0.25)",
          labelBackgroundColor: "rgba(0,0,0,0.65)",
        },
      },
      handleScroll: { mouseWheel: false, pressedMouseMove: true },
      handleScale: { mouseWheel: false, pinch: true },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "rgba(255, 255, 255, 0.95)",
      downColor: "rgba(255, 255, 255, 0.45)",
      borderUpColor: "#ffffff",
      borderDownColor: "rgba(255, 255, 255, 0.55)",
      wickUpColor: "rgba(255, 255, 255, 0.85)",
      wickDownColor: "rgba(255, 255, 255, 0.45)",
    });

    chartRef.current = chart;

    chart.applyOptions({
      layout: {
        background: { type: ColorType.Solid, color: "rgba(0, 0, 0, 0)" },
      },
    });

    const transparentize = () => {
      container
        .querySelectorAll<HTMLElement>("div, canvas, table, td")
        .forEach((el) => {
          el.style.background = "transparent";
          el.style.backgroundColor = "transparent";
        });
    };
    transparentize();
    const mo = new MutationObserver(transparentize);
    mo.observe(container, { childList: true, subtree: true, attributes: true });

    const load = async () => {
      try {
        const candles = await fetchMonthlyCandles();
        series.setData(candles);
        chart.timeScale().fitContent();
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    };

    load();
    const refresh = window.setInterval(load, 120_000);

    return () => {
      mo.disconnect();
      window.clearInterval(refresh);
      chart.remove();
      chartRef.current = null;
    };
  }, []);

  return (
    <div className="tradingview-mount relative h-[200px] w-full sm:h-[210px] lg:h-[195px]">
      {status === "loading" && (
        <div
          className="pointer-events-none absolute inset-0 animate-pulse bg-white/[0.04]"
          aria-hidden
        />
      )}
      {status === "error" && (
        <p className="text-shadow-soft absolute inset-0 flex items-center justify-center text-[14px] text-white/85">
          Chart unavailable
        </p>
      )}
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full"
        aria-label="Solana monthly price chart"
      />
    </div>
  );
}
