import {
  HiOutlineHome,
  HiOutlineSquares2X2,
  HiOutlineTag,
  HiOutlineUsers,
  HiOutlinePhoto,
  HiOutlineGift,
  HiOutlineBars3BottomLeft,
} from "react-icons/hi2";

export const adminMenu = [
  {
    title: "داشبورد",
    href: "/admin",
    icon: HiOutlineHome,
    description: "نمای کلی مدیریت",
  },
  {
    title: "مدیریت محصولات",
    icon: HiOutlineSquares2X2,
    description: "مدیریت کالاها",
    children: [
      {
        title: "لیست محصولات",
        href: "/admin/product",
      },
      {
        title: "افزودن محصول",
        href: "/admin/product/create",
      },
    ],
  },
  {
    title: "دسته‌بندی‌ها",
    icon: HiOutlineTag,
    description: "مدیریت دسته‌ها",
    children: [
      {
        title: "لیست دسته‌بندی‌ها",
        href: "/admin/categories",
      },
      {
        title: "افزودن دسته‌بندی",
        href: "/admin/categories/create-category",
      },
    ],
  },
  {
    title: "بنرهای تبلیغاتی",
    icon: HiOutlinePhoto,
    description: "مدیریت بنرها",
    children: [
      {
        title: "لیست بنرها",
        href: "/admin/banner-ads",
      },
      {
        title: "افزودن بنر",
        href: "/admin/banner-ads/creat-banner",
      },
    ],
  },
  {
    title: "منو",
    icon: HiOutlineBars3BottomLeft,
    description: "مدیریت منوها",
    children: [
      {
        title: "لیست منوها",
        href: "/admin/menu",
      },
      {
        title: "افزودن منو",
        href: "/admin/menu/creat-menu",
      },
    ],
  },
  {
    title: "کد تخفیف",
    icon: HiOutlineGift,
    description: "مدیریت تخفیف‌ها",
    children: [
      {
        title: "لیست کدها",
        href: "/admin/discounts-code",
      },
      {
        title: "افزودن کد تخفیف",
        href: "/admin/discounts-code/create-discount",
      },
    ],
  },
  {
    title: "کاربران",
    icon: HiOutlineUsers,
    description: "مدیریت حساب‌ها",
    children: [
      {
        title: "لیست کاربران",
        href: "/admin/users",
      },
      {
        title: "افزودن کاربر",
        href: "/admin/users/create",
      },
    ],
  },
];
