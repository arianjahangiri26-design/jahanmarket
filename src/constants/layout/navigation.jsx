// constants/layout/navigation.ts

export const navLinks = [
  {
    id: 'amazing',
    title: 'تخفیف‌های خانه',
    href: '/amazing',
  },
  {
    id: 'best-selling',
    title: 'پرفروش‌ها',
    href: '/best-selling',
  },
  {
    id: 'gift-card',
    title: 'کارت هدیه',
    href: '/gift-card',
  },
];

export const categories = [
  {
    id: 'digital',
    title: 'کالای دیجیتال',
    subCategories: [
      {
        title: 'موبایل',
        items: [
          { name: 'گوشی موبایل', href: '/mobile' },
          { name: 'لوازم جانبی موبایل', href: '/mobile-accessories' },
        ],
      },
      {
        title: 'کامپیوتر',
        items: [
          { name: 'لپ‌تاپ', href: '/laptop' },
          { name: 'قطعات کامپیوتر', href: '/computer-parts' },
        ],
      },
    ],
  },
  {
    id: 'home',
    title: 'خانه و آشپزخانه',
    subCategories: [
      {
        title: 'لوازم خانگی',
        items: [
          { name: 'یخچال', href: '/refrigerator' },
          { name: 'ماشین لباسشویی', href: '/washing-machine' },
        ],
      },
    ],
  },
];
