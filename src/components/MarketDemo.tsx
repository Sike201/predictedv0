"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TradingViewChart } from "@/components/TradingViewChart";
import { AnimatedMetric } from "@/components/AnimatedMetric";
import {
  MARKET,
  type PredictionMode,
  computeMetrics,
  formatForecastLabel,
  formatMultiplier,
  formatPercent,
  formatUsd,
  resolveForecastRange,
} from "@/lib/probability";

const MODES: { id: PredictionMode; label: string }[] = [
  { id: "range", label: "Range" },
  { id: "above", label: "Above" },
  { id: "below", label: "Below" },
];

function priceToPercent(price: number): number {
  const pct =
    ((price - MARKET.minPrice) / (MARKET.maxPrice - MARKET.minPrice)) * 100;
  return Math.max(0, Math.min(100, pct));
}

function percentToPrice(percent: number): number {
  const t = Math.max(0, Math.min(100, percent)) / 100;
  return Math.round(
    MARKET.minPrice + t * (MARKET.maxPrice - MARKET.minPrice)
  );
}

interface PredictionSliderProps {
  mode: PredictionMode;
  rangeLow: number;
  rangeHigh: number;
  threshold: number;
  onRangeChange: (low: number, high: number) => void;
  onThresholdChange: (value: number) => void;
}

function PredictionSlider({
  mode,
  rangeLow,
  rangeHigh,
  threshold,
  onRangeChange,
  onThresholdChange,
}: PredictionSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef({ low: rangeLow, high: rangeHigh });
  const onRangeChangeRef = useRef(onRangeChange);
  const onThresholdChangeRef = useRef(onThresholdChange);
  const [dragging, setDragging] = useState<"low" | "high" | "single" | null>(
    null
  );

  rangeRef.current = { low: rangeLow, high: rangeHigh };
  onRangeChangeRef.current = onRangeChange;
  onThresholdChangeRef.current = onThresholdChange;

  const lowPct = priceToPercent(rangeLow);
  const highPct = priceToPercent(rangeHigh);
  const thresholdPct = priceToPercent(threshold);

  const updateFromClientX = useCallback(
    (clientX: number, handle: "low" | "high" | "single") => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      const price = percentToPrice(pct);
      const minGap = 20;

      if (handle === "single") {
        onThresholdChangeRef.current(
          Math.max(MARKET.minPrice, Math.min(MARKET.maxPrice, price))
        );
        return;
      }

      const { low, high } = rangeRef.current;

      if (handle === "low") {
        const newLow = Math.max(
          MARKET.minPrice,
          Math.min(price, high - minGap)
        );
        rangeRef.current = { low: newLow, high };
        onRangeChangeRef.current(newLow, high);
      } else {
        const newHigh = Math.min(
          MARKET.maxPrice,
          Math.max(price, low + minGap)
        );
        rangeRef.current = { low, high: newHigh };
        onRangeChangeRef.current(low, newHigh);
      }
    },
    []
  );

  const updateFromClientXRef = useRef(updateFromClientX);
  updateFromClientXRef.current = updateFromClientX;

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) =>
      updateFromClientXRef.current(e.clientX, dragging);
    const onUp = () => setDragging(null);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging]);

  const fillStyle =
    mode === "range"
      ? {
          left: `${lowPct}%`,
          width: `${Math.max(0, Math.min(100 - lowPct, highPct - lowPct))}%`,
        }
      : mode === "above"
        ? {
            left: `${thresholdPct}%`,
            width: `${Math.max(0, 100 - thresholdPct)}%`,
          }
        : { left: "0%", width: `${Math.max(0, thresholdPct)}%` };

  const handles: { id: "low" | "high" | "single"; pct: number }[] =
    mode === "range"
      ? [
          { id: "low", pct: lowPct },
          { id: "high", pct: highPct },
        ]
      : [{ id: "single", pct: thresholdPct }];

  return (
    <div className="slider-zone">
      <div className="slider-track-inset">
        <div
          ref={trackRef}
          className="slider-track"
          role="group"
          aria-label="Forecast price selection"
        >
          <div className="slider-track-bg" aria-hidden />
          <div className="slider-track-fill" style={fillStyle} />
          {handles.map(({ id, pct }) => (
            <button
              key={id}
              type="button"
              className={`slider-handle ${dragging === id ? "slider-handle-dragging" : ""}`}
              style={{ left: `${pct}%` }}
              onPointerDown={(e) => {
                e.preventDefault();
                setDragging(id);
              }}
              aria-label={`Adjust ${id} forecast`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function MarketDemo() {
  const [mode, setMode] = useState<PredictionMode>("range");
  const [rangeLow, setRangeLow] = useState<number>(MARKET.defaultRangeLow);
  const [rangeHigh, setRangeHigh] = useState<number>(MARKET.defaultRangeHigh);
  const [threshold, setThreshold] = useState<number>(MARKET.defaultThreshold);

  const { low, high } = resolveForecastRange(
    mode,
    rangeLow,
    rangeHigh,
    threshold
  );
  const metrics = computeMetrics(low, high);
  const forecastLabel = formatForecastLabel(mode, low, high, threshold);

  const applyMode = (next: PredictionMode) => {
    setMode(next);
    if (next === "range") {
      setRangeLow(300);
      setRangeHigh(700);
    } else {
      setThreshold(500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="prediction-focal w-full min-w-0"
    >
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1.55fr_1fr] lg:items-center lg:gap-7">
        <div className="min-w-0 w-full">
          <TradingViewChart />
        </div>

        <div className="controls-panel flex w-full min-w-0 flex-col gap-5 px-1 sm:px-0 sm:gap-4 lg:gap-4">
          <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => applyMode(m.id)}
                className={`mode-pill mode-pill-compact rounded-full px-3.5 py-2 text-[12px] font-medium tracking-wide transition-all duration-200 sm:px-3 sm:py-1.5 ${
                  mode === m.id ? "mode-pill-active" : "hover:bg-white/12"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <p className="text-shadow-soft text-center text-[1.35rem] font-semibold leading-tight tracking-[-0.03em] text-white tabular-nums sm:text-xl lg:text-left lg:text-[1.35rem]">
            {forecastLabel}
          </p>

          <PredictionSlider
            mode={mode}
            rangeLow={rangeLow}
            rangeHigh={rangeHigh}
            threshold={threshold}
            onRangeChange={(low, high) => {
              setRangeLow(low);
              setRangeHigh(high);
            }}
            onThresholdChange={setThreshold}
          />

          <div className="metrics-grid grid grid-cols-3 gap-2 border-t border-white/15 pt-4 sm:gap-3 lg:gap-4">
            <AnimatedMetric
              label="Win probability"
              value={formatPercent(metrics.winProbability)}
              shortLabel="Win prob."
            />
            <AnimatedMetric
              label="Potential return"
              value={formatMultiplier(metrics.potentialReturn)}
              shortLabel="Return"
            />
            <AnimatedMetric
              label="Receive if correct"
              value={formatUsd(metrics.receiveIfCorrect)}
              shortLabel="If correct"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
