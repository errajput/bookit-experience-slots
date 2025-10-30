import "./globals.css";
import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Providers from "@/providers";

export const metadata = {
  title: "BookIt",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
