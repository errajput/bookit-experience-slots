import "./globals.css";
import { ReactNode, Suspense } from "react";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "BookIt",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
