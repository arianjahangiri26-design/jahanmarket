import { FiInstagram, FiSend, FiTwitter } from "react-icons/fi";

export const footerLinks = {
  customerService: [
    { title: "تماس با ما", href: "/contact" },
    { title: "پاسخ به پرسش‌های متداول", href: "/faq" },
    { title: "شرایط استفاده", href: "/terms" },
    { title: "حریم خصوصی", href: "/privacy" },
  ],
  about: [
    { title: "درباره ما", href: "/about" },
    { title: "فرصت‌های شغلی", href: "/careers" },
    { title: "فروش در جهان مارکت", href: "/sell" },
    { title: "گزارش باگ", href: "/report-bug" },
  ],
  social: [
    { title: "اینستاگرام", href: "/instagram" },
    { title: "تلگرام", href: "/telegram" },
    { title: "توییتر", href: "/twitter" },
  ],
};

export const companyInfo = {
  name: "جهان مارکت",
  description: "خرید آنلاین با اطمینان و اعتماد. ما بهترین خدمات را برای شما فراهم می‌کنیم.",
  contact: {
    phone: "۰۲۱-۱۲۳۴۵۶۷۸",
    email: "info@jahanmarket.com",
    address: "تهران، ایران",
  },
  copyright: "© ۱۴۰۳ جهان مارکت. تمامی حقوق محفوظ است.",
};

  export  const socialIcons = {
  اینستاگرام: <FiInstagram className="h-4 w-4" />,
  تلگرام: <FiSend className="h-4 w-4" />,
  توییتر: <FiTwitter className="h-4 w-4" />,
};