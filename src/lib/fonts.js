import localFont from "next/font/local";

export const iranSans = localFont({
  src: [
    {
      path: "../../public/fonts/IRANSansWeb_UltraLight.woff",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSansWeb_Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSansWeb.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSansWeb_Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSansWeb_Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-iran-sans",
  display: "swap",
});

