import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy Birthday, Priya · September 03",
  description: "A little universe of memories, magic, and birthday love. From Simon & Olive.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><head><link rel="preconnect" href="https://www.youtube.com"/><link rel="preconnect" href="https://i.ytimg.com"/></head><body>{children}</body></html>;
}
