"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedMetricProps {
  label: string;
  value: string;
}

export function AnimatedMetric({ label, value }: AnimatedMetricProps) {
  const prev = useRef(value);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (prev.current !== value) {
      setFlash(true);
      prev.current = value;
      const t = setTimeout(() => setFlash(false), 350);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div className="text-center lg:text-left">
      <p className="text-[10px] font-medium tracking-[0.04em] text-white/82 uppercase lg:text-[10px]">
        {label}
      </p>
      <motion.p
        animate={{ opacity: flash ? 0.7 : 1 }}
        transition={{ duration: 0.2 }}
        className="text-shadow-soft mt-1 text-lg font-semibold tracking-[-0.02em] text-white tabular-nums lg:text-xl"
      >
        {value}
      </motion.p>
    </div>
  );
}
