import { iranSans } from "@/lib/fonts";
import "@/app/globals.css";
import { HeroProviders } from "@/components/providers/heroProviders";
import { CartProvider } from "@/context/cart/CartContext";
import { SessionProviderWrapper } from "@/components/providers/auth/sesstionProvider";
 

export const metadata = {
  title: "جهان مارکت",
  description: "خرید آنلاین با اطمینان و اعتماد",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={iranSans.variable}>
    
             <CartProvider> 
             <SessionProviderWrapper> 
      <body className="min-h-screen  font-sans">
        <HeroProviders>
   
          {children}
         
        </HeroProviders>
      </body> 
         </SessionProviderWrapper>

         </CartProvider>
    
    </html>
  );
}
