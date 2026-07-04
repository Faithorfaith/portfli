"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type Ctx = { showToast: (message: string) => void };

const ToastContext = createContext<Ctx | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; key: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const counter = useRef(0);

  const showToast = useCallback((message: string) => {
    if (timer.current) clearTimeout(timer.current);
    counter.current += 1;
    setToast({ message, key: counter.current });
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          key={toast.key}
          style={{
            position: "fixed",
            bottom: 30,
            left: "50%",
            zIndex: 120,
            background: "#141210",
            color: "#FBF9F5",
            fontSize: 13,
            padding: "12px 22px",
            borderRadius: 999,
            animation: "osToast 2.6s ease forwards",
            boxShadow: "0 16px 40px -16px rgba(0,0,0,.4)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
