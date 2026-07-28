import Link from "next/link";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiChevronLeft,
} from "react-icons/fi";
import { footerLinks, companyInfo, socialIcons } from "@/constants/layout/footer";



const FooterSection = ({ title, links, social = false }) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:shadow-[0_20px_45px_rgba(37,99,235,0.18)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-400/10 opacity-80" />
      <div className="relative">
        <h4 className="mb-5 text-lg font-bold text-white">
          <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            {title}
          </span>
        </h4>

        <ul className="space-y-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group/link flex items-center justify-between rounded-2xl border border-transparent bg-slate-900/40 px-4 py-3 text-sm text-slate-300 transition-all duration-300 hover:border-blue-400/20 hover:bg-slate-800/70 hover:text-blue-300"
              >
                <span className="flex items-center gap-2">
                  {social && socialIcons[link.title] ? (
                    <span className="text-cyan-300">{socialIcons[link.title]}</span>
                  ) : null}
                  {link.title}
                </span>

                <FiChevronLeft className="h-4 w-4 text-slate-500 transition-transform duration-300 group-hover/link:-translate-x-1 group-hover/link:text-blue-300" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ContactItem = ({ icon, children, colorClass }) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-300 shadow-inner shadow-white/5 transition-all duration-300 hover:border-blue-400/20 hover:bg-slate-800/70">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass} shadow-lg`}
      >
        {icon}
      </div>
      <span>{children}</span>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-blue-500/10 bg-slate-950 text-white">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.10),transparent_30%)]" />
      </div>

      {/* Main footer */}
      <div className="relative container mx-auto px-4 py-14 lg:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {/* Company info */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:shadow-[0_20px_45px_rgba(37,99,235,0.18)]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-400/10 opacity-80" />

            <div className="relative">
              <div className="mb-4 inline-flex rounded-2xl border border-blue-400/20 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 px-4 py-2 shadow-inner shadow-blue-400/10">
                <h3 className="text-xl font-extrabold tracking-tight text-white">
                  {companyInfo.name}
                </h3>
              </div>

              <p className="mb-6 text-sm leading-7 text-slate-300">
                {companyInfo.description}
              </p>

              <div className="space-y-3">
                <ContactItem
                  icon={<FiPhone className="h-4 w-4 text-blue-200" />}
                  colorClass="bg-blue-500/20"
                >
                  {companyInfo.contact.phone}
                </ContactItem>

                <ContactItem
                  icon={<FiMail className="h-4 w-4 text-cyan-200" />}
                  colorClass="bg-cyan-500/20"
                >
                  {companyInfo.contact.email}
                </ContactItem>

                <ContactItem
                  icon={<FiMapPin className="h-4 w-4 text-indigo-200" />}
                  colorClass="bg-indigo-500/20"
                >
                  {companyInfo.contact.address}
                </ContactItem>
              </div>
            </div>
          </div>

          <FooterSection
            title="خدمات مشتریان"
            links={footerLinks.customerService}
          />

          <FooterSection title="درباره ما" links={footerLinks.about} />

          <FooterSection
            title="شبکه‌های اجتماعی"
            links={footerLinks.social}
            social
          />
        </div>
      </div>

      {/* bottom bar */}
      <div className="relative border-t border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6 lg:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-slate-400 md:text-right">
              {companyInfo.copyright}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/terms"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition-all duration-300 hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300"
              >
                شرایط استفاده
              </Link>
              <Link
                href="/privacy"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                حریم خصوصی
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
