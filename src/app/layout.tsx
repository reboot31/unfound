import type { Metadata } from "next";
import { Newsreader, Poppins, Geist } from "next/font/google";
import "./globals.css";

const display = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const body = Geist({
  variable: "--font-body",
  subsets: ["latin"],
});

// The wordmark only — geometric, lowercase, matching the logo.
const mark = Poppins({
  variable: "--font-mark",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Unfound — senior hiring, quietly",
  description:
    "A private introduction service for VP, Director and Head-of roles in India. Not a job board. Nobody can browse you.",
  metadataBase: new URL("https://unfoundhq.com"),
  openGraph: {
    title: "Unfound — senior hiring, quietly",
    description:
      "A private introduction service for VP, Director and Head-of roles in India. Not a job board. Nobody can browse you.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${mark.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
