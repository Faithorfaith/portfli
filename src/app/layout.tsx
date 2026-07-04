import type { Metadata } from "next";
import { Newsreader, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/settings";
import { OpeningOverlayProvider } from "@/components/OpeningOverlayProvider";
import { ToastProvider } from "@/components/ToastProvider";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OpenShelf — a calm shelf of books, free to read",
  description: "Every book here was submitted by a reader and reviewed before it earned its place on the shelf.",
};

// Every page reads live, per-guest state (site settings, save/tip/report counts),
// so nothing here should be frozen into a build-time static snapshot.
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  return (
    <html lang="en" className={`${newsreader.variable} ${instrumentSans.variable}`}>
      <body
        style={{
          fontFamily: "var(--font-instrument-sans), system-ui, sans-serif",
          color: "#1C1915",
          minHeight: "100vh",
        }}
      >
        <ToastProvider>
          <OpeningOverlayProvider settings={settings}>{children}</OpeningOverlayProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
