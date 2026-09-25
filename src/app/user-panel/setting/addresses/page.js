import AddressesListLogic from "@/components/user-panel/address/get/logic/AddressesListLogic";

 

export const metadata = {
  title: "آدرس‌های من",
  robots: { index: false, follow: false, nocache: true },
};

export default function AddressesPage() {
  return <AddressesListLogic />;
}
