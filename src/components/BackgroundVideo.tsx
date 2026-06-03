"use client";

export function BackgroundVideo() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        src="/background.mp4"
      />
      <div className="absolute inset-0 backdrop-blur-[1px]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </div>
  );
}
