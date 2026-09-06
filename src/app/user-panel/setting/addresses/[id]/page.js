import EditAddressLogic from "@/components/user-panel/address/edit/EditAddressLogic";

 
export const metadata = {
  title: "ویرایش آدرس",
  robots: { index: false, follow: false, nocache: true },
};

export default function EditAddressPage() {
  return <EditAddressLogic />;
}
