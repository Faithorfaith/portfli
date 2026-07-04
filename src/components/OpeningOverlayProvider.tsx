"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { serif } from "@/lib/theme";
import type { SiteSettings } from "@/lib/settings";

type OpeningBookInfo = { title: string; author: string; bg: string; ink: string };

type Ctx = { beginRead: (book: OpeningBookInfo, href: string) => void };

const OpeningOverlayContext = createContext<Ctx | null>(null);

export function useOpeningOverlay() {
  const ctx = useContext(OpeningOverlayContext);
  if (!ctx) throw new Error("useOpeningOverlay must be used within OpeningOverlayProvider");
  return ctx;
}

export function OpeningOverlayProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  const [opening, setOpening] = useState<OpeningBookInfo | null>(null);
  const router = useRouter();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const beginRead = useCallback(
    (book: OpeningBookInfo, href: string) => {
      if (settings.reduceMotion) {
        router.push(href);
        return;
      }
      timers.current.forEach(clearTimeout);
      setOpening(book);
      timers.current = [
        setTimeout(() => router.push(href), 950),
        setTimeout(() => setOpening(null), 1500),
      ];
    },
    [router, settings.reduceMotion]
  );

  const swing = settings.openStyle !== "zoom only";

  return (
    <OpeningOverlayContext.Provider value={{ beginRead }}>
      {children}
      {opening && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "#EDE8DF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "osOverlaySeq 1.5s ease forwards",
            pointerEvents: "none",
          }}
        >
          <div style={{ perspective: 2000 }}>
            <div
              style={{
                position: "relative",
                width: 228,
                height: 338,
                transformStyle: "preserve-3d",
                animation: `${swing ? "osBookGrow" : "osBookZoom"} 1.5s cubic-bezier(.55,.05,.3,1) forwards`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#FBF7EF",
                  borderRadius: "2px 6px 6px 2px",
                  boxShadow: "0 30px 60px -30px rgba(60,45,20,.6)",
                  padding: "30px 24px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    opacity: 0.5,
                    backgroundImage:
                      "repeating-linear-gradient(rgba(51,48,42,.22) 0px, rgba(51,48,42,.22) 1px, transparent 1px, transparent 13px)",
                    backgroundPosition: "0 8px",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 82%",
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transformOrigin: "left center",
                  animation: `${swing ? "osCoverOpen" : "osCoverStay"} 1.5s cubic-bezier(.6,.05,.3,1) forwards`,
                  backfaceVisibility: "hidden",
                  background: opening.bg,
                  color: opening.ink,
                  borderRadius: "2px 6px 6px 2px",
                  boxShadow: "inset 6px 0 10px -4px rgba(0,0,0,.35)",
                  display: "flex",
                  flexDirection: "column",
                  padding: "30px 22px 26px 30px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontFamily: serif, fontSize: 25, lineHeight: 1.16, marginTop: 36 }}>
                  {opening.title}
                </div>
                <div
                  style={{
                    marginTop: "auto",
                    fontSize: 10,
                    letterSpacing: ".15em",
                    textTransform: "uppercase",
                    opacity: 0.72,
                  }}
                >
                  {opening.author}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </OpeningOverlayContext.Provider>
  );
}
