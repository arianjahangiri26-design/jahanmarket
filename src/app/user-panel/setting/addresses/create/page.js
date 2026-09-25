import CreateAddressLogic from "@/components/user-panel/address/create/CreateAddressLogic";

export const metadata = {
  title: "افزودن آدرس جدید",
  robots: { index: false, follow: false, nocache: true },
};

export default function CreateAddressPage() {
  return <CreateAddressLogic />;
}
