 
import { HeroProviders } from "@/components/providers/heroProviders";
import AdminFilters from "@/components/admin/filter/AdminFilters"; // کامپوننت جدید


export default function Layout({ children }) {
  return (
    <HeroProviders>



      <div  >

        <AdminFilters />

        {children}
      </div>



    </HeroProviders>
  );
}
