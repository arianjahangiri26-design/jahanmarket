import OrdersLogic from "@/components/user-panel/orders/logic/OrdersLogic";

export const metadata = {
  title: "سفارش‌های من",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function UserOrdersPage() {
  return <OrdersLogic />;
}
