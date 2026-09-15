import { MEGA_MENU_ITEMS } from "@/constants/layout/avatar/mega-menu/MegaMenuAvatar";
import Link from "next/link";
 
 
export default function MegaMenu() {
  return (
    <nav className="flex items-center gap-6">
      {MEGA_MENU_ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="text-sm font-medium text-default-700 transition hover:text-default-900"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
