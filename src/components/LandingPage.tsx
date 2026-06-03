"use client";

import { motion } from "framer-motion";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { MarketDemo } from "@/components/MarketDemo";
import { WaitlistForm } from "@/components/WaitlistForm";

export function LandingPage() {
  return (
    <>
      <BackgroundVideo />

      <motion.a
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        href="/unified-liquidity-for-continuous-prediction-markets-v0.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="paper-link fixed top-4 right-4 z-20 rounded-full px-3.5 py-1.5 text-[12px] font-medium tracking-wide text-white/90 lg:top-5 lg:right-6"
      >
        Paper
      </motion.a>

      <div className="relative flex min-h-[100dvh] flex-col items-center justify-center px-5 py-8 sm:px-8 lg:h-screen lg:max-h-screen lg:min-h-0 lg:overflow-hidden lg:px-12 lg:py-6">
        <div className="content-cluster flex w-full max-w-[880px] flex-col items-center gap-5 lg:gap-6">
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full shrink-0 text-center"
          >
            <h1 className="mx-auto max-w-[20rem] text-[1.65rem] leading-[1.1] font-semibold tracking-[-0.04em] text-white sm:max-w-2xl sm:text-[2rem] lg:max-w-3xl lg:text-[2.35rem] lg:leading-[1.08] xl:text-[2.65rem]">
              Finally, prediction markets built for any range.
            </h1>

            

            <p className="mt-3 text-[12px] font-medium tracking-[0.02em] text-white/82 lg:mt-4 lg:text-[13px]">
              Solana Price on Dec 31, 2027
            </p>
          </motion.header>

          <div className="relative z-10 w-full shrink-0">
            <MarketDemo />
          </div>

          <div className="relative z-10 w-full shrink-0 pt-1">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </>
  );
}
