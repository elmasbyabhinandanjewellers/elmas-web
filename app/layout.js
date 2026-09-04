import "./globals.css";
import Script from "next/script";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import BottomAppBar from "@/components/BottomAppBar";

export const metadata = {
  title:
    "Elmas by Abhinandan Jewellers | 999 Pure Silver Décor, Gifting & Corporate Gifts",
  description:
    "Explore Elmas by Abhinandan Jewellers — 999 pure silver décor, god idols, corporate gifts, bulk gifting, and wedding return gifts. Crafted for those who leave a mark.",
  keywords: [
    "999 pure silver décor",
    "silver corporate gifts",
    "bulk silver gifting",
    "wedding return gifts silver",
    "silver god idols",
    "silver home décor",
    "Elmas by Abhinandan Jewellers",
    "premium silver gifts Delhi",
    "bulk return gifts for wedding",
    "silver gifts for shaadi",
    "corporate bulk gifting Delhi",
    "silver accessories India",
    "silver wall clock",
    "luxury silver gifts",
  ],
  authors: [{ name: "Elmas by Abhinandan Jewellers" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Elmas by Abhinandan Jewellers",
    title:
      "Elmas by Abhinandan Jewellers | 999 Pure Silver Décor, Gifting & Corporate Gifts",
    description:
      "Explore Elmas by Abhinandan Jewellers — 999 pure silver décor, god idols, corporate gifts, bulk gifting, and wedding return gifts. Crafted for those who leave a mark.",
    images: [
      // {
      //   url: "https://res.cloudinary.com/dxsnvcwif/image/upload/v1777913972/products/42_Turqoiuse_Purse_beads/image_1.webp",
      //   width: 1200,
      //   height: 630,
      //   alt: "Elmas Jewellers",
      // },
    ],
  },
  icons: {
    icon: [
      {
        url: "/favicon.webp",
        type: "image/webp",
      },
      {
        url: "/favicon.ico",
      },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1b4332",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),
            dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5KXZ5GX6');
          `}
        </Script>

        {/* GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PQBPNKHK62"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PQBPNKHK62');
          `}
        </Script>

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1526485519024296');
            fbq('track', 'PageView');
          `}
        </Script>

        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"){e.stopImmediatePropagation();e.preventDefault()}},true);',
          }}
        />
      </head>

      <body className="font-sans bg-cream-100">
        {/* Google Tag Manager noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5KXZ5GX6"
            height="0"
            width="0"
            style={{
              display: "none",
              visibility: "hidden",
            }}
          />
        </noscript>

        {/* Meta Pixel noscript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1526485519024296&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <Providers>
          <Navbar />
          <main className="pb-20 md:pb-0">{children}</main>
          <Footer />
          <BottomAppBar />
        </Providers>
      </body>
    </html>
  );
}