import { iranSans } from "@/lib/fonts";
import "@/app/globals.css";
import { HeroProviders } from "@/components/providers/heroProviders";
 

export const metadata = {
  title: "جهان مارکت",
  description: "خرید آنلاین با اطمینان و اعتماد",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={iranSans.variable}>
      
      <body className="min-h-screen  font-sans">
        <HeroProviders>
          {children} 
        </HeroProviders>
      </body>
    
    </html>
  );
}
