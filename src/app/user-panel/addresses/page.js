import AddressesListLogic from "@/components/user-panel/address/get/AddressesListLogic";

export const metadata = {
  title: "آدرس‌های من",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function UserAddressesPage() {
  return <AddressesListLogic />;
}
