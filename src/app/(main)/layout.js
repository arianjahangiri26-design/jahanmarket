import Header from "@/components/layout/header/header";
import Footer from "@/components/layout/footer/Footer";
 
import "@/app/globals.css";
import { SessionProviderWrapper } from "@/components/providers/auth/sesstionProvider";
 
 
 

export const metadata = {
  title: "جهان مارکت - خرید آنلاین با اطمینان",
  description: "خرید آنلاین با اطمینان و اعتماد",
};

export default function RootLayout({ children }) {
  return (
<SessionProviderWrapper>
    
 <div>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      </div>
      </SessionProviderWrapper>
  );
}
