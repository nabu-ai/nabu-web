import { ThemeProvider } from "@/context/ThemeContext";
import "../styles/globals.css";
// import { proximaNova } from "./fonts";
import { Outfit } from 'next/font/google';
import { SidebarProvider } from "@/context/SidebarContext";
import { Toaster } from "@/components/ui/toast";
import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";
import { ReactQueryProvider } from "@/lib/context";
const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata = {
  title: "Nabu",
  description: "Lobby UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <Suspense fallback={<Loader />}>
            <ReactQueryProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </ReactQueryProvider>
          </Suspense>
          {/* <Toaster /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
