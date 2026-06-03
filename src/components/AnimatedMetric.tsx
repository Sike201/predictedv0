"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedMetricProps {
  label: string;
  value: string;
  shortLabel?: string;
}

export function AnimatedMetric({ label, value, shortLabel }: AnimatedMetricProps) {
  const prev = useRef(value);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (prev.current === value) return;
    prev.current = value;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 200);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="min-w-0 text-center lg:text-left">
      <p className="text-[9px] font-medium leading-tight tracking-[0.03em] text-white/82 uppercase sm:text-[10px] lg:hidden">
        {shortLabel ?? label}
      </p>
      <p className="hidden text-[10px] font-medium tracking-[0.04em] text-white/82 uppercase lg:block">
        {label}
      </p>
      <motion.p
        key={value}
        initial={false}
        animate={{ opacity: flash ? 0.85 : 1 }}
        transition={{ duration: 0.12 }}
        className="text-shadow-soft mt-1 text-base font-semibold leading-none tracking-[-0.02em] text-white tabular-nums sm:text-lg lg:mt-1 lg:text-xl"
      >
        {value}
      </motion.p>
    </div>
  );
}
