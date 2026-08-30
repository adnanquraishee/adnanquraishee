import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Grain from "@/components/Grain";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Scene from "@/components/webgl/Scene";
import Preloader from "@/components/Preloader";
import Transition from "@/components/Transition";
import { site } from "@/content/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.intro,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.intro,
    type: "website",
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable}`}
      // The inline script below adds `js` before hydration, so the server and
      // client class lists legitimately differ on this element.
      suppressHydrationWarning
    >
      <head>
        {/* Runs before first paint. Flags scripting as available (the reveal
            styles key off html.js so a no-JS render stays fully visible), and
            turns off the browser's scroll restoration — with Lenis owning the
            scroll position, a restored offset reopened pages part-way down. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');" +
              "if('scrollRestoration' in history)history.scrollRestoration='manual';",
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <SmoothScroll />
        <Scene withHero />
        <Preloader />
        <Transition />
        <Grain />
        <Cursor />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main" className="relative z-10">
          {children}
        </main>
        {modal}
        <Footer />
      </body>
    </html>
  );
}
