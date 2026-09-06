import Header from "@/components/layout/header/header";
import Footer from "@/components/layout/footer/Footer";
import "@/app/globals.css";
import { SessionProviderWrapper } from "@/components/providers/auth/sesstionProvider";
import { seoConfig } from "@/lib/seo/seo-config";
export const metadata = {
  metadataBase: new URL(seoConfig.siteUrl), // بسیار مهم: آدرس پایه برای تمام لینک‌ها و عکس‌های سئو
  title: {
    default: seoConfig.defaultTitle,
    template: `%s | ${seoConfig.siteName}`, // قالب تایتل: "عنوان صفحه | جهان مارکت"
  },
  description: seoConfig.defaultDescription,
  openGraph: {
    siteName: seoConfig.siteName,
    locale: 'fa_IR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: seoConfig.twitterUsername,
  },
};

export default function RootLayout({ children }) {
  return (
    <SessionProviderWrapper>
      {/* اعمال تم آبی گرم و عالی روی بدنه اصلی بخش main */}
      <div dir="rtl" className="flex min-h-screen flex-col bg-[#F8FAFC] text-[#0A2540] antialiased selection:bg-[#0B3C5D]/10 selection:text-[#0B3C5D]">
        {/* هدر سایت */}
        <Header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md" />

        {/* بخش محتوای اصلی صفحات */}
        <main className="flex-grow">{children}</main>

        {/* فوتر سایت */}
        <Footer className="border-t border-[#E2E8F0] bg-white" />
      </div>
    </SessionProviderWrapper>
  );
}
