'use client'

// import { ThemeProvider } from "next-themes";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";

const geistSans = Montserrat({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Benaiah Security Group",
//   description: "The future of security services.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isUserPage = pathname.startsWith("/auth") || pathname.startsWith('/dashboard');
  return (
      <html lang="en">
        <body
          className={`${geistSans.variable} antialiased`}
        >
          {/* <ThemeProvider attribute={'class'} defaultTheme="system" enableSystem> */}
            {!isUserPage && <Header />}
            {children}
            {!isUserPage && <Footer />}
          {/* </ThemeProvider> */}
        </body>
      </html>
  );
}
