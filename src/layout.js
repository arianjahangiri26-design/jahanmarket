import { iranSans } from "@/lib/fonts";
import "@/app/globals.css";
import { HeroProviders } from "./components/providers/heroProviders";
 

 

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={iranSans.variable}>
      <body className="min-h-screen bg-red font-sans">
       <HeroProviders>
          {children} 
 </HeroProviders>
      </body>
    </html>
  );
}
