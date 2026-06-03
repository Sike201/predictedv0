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
        className="paper-link fixed top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] z-20 rounded-full px-3.5 py-1.5 text-[12px] font-medium tracking-wide text-white/90 lg:top-5 lg:right-6"
      >
        Paper
      </motion.a>

      <div className="page-shell relative flex min-h-[100dvh] w-full flex-col items-center overflow-x-hidden px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(3.25rem,env(safe-area-inset-top))] sm:px-6 sm:pb-10 sm:pt-14 lg:h-screen lg:max-h-screen lg:justify-center lg:overflow-hidden lg:px-12 lg:py-6 lg:pt-6">
        <div className="content-cluster flex w-full max-w-[880px] flex-col items-center gap-6 sm:gap-7 lg:gap-6">
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full shrink-0 px-1 text-center sm:px-0"
          >
            <h1 className="mx-auto max-w-[20rem] text-[1.5rem] leading-[1.12] font-semibold tracking-[-0.04em] text-white sm:max-w-2xl sm:text-[1.85rem] lg:max-w-3xl lg:text-[2.35rem] lg:leading-[1.08] xl:text-[2.65rem]">
              Finally, prediction markets built for any range.
            </h1>

            <p className="mt-3 text-[12px] font-medium tracking-[0.02em] text-white/82 sm:mt-4 sm:text-[13px]">
              Solana Price on Dec 31, 2027
            </p>
          </motion.header>

          <div className="relative z-10 w-full min-w-0 shrink-0">
            <MarketDemo />
          </div>

          <div className="relative z-10 w-full min-w-0 shrink-0 px-1 sm:px-0">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </>
  );
}
