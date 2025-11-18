import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StyledComponentsRegistry } from "./lib/registry";
import { StyledThemeProvider } from "./components/theme-provider";
import { LayoutWrapper, MainContent } from "./components/layout-wrapper";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EducaMais",
  description: "Plataforma EducaMais",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StyledComponentsRegistry>
          <StyledThemeProvider>
            <LayoutWrapper>
              <Header />
              <MainContent>{children}</MainContent>
              <Footer />
            </LayoutWrapper>
          </StyledThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
