 
 "use client";
 
 
import EditUserLogic from "@/components/admin/users/edite/EditeUsers";
 
   
import { updateUserSchema } from "@/lib/validators/admin/users/user.validation";
import { FormProvider } from "react-hook-form";
 

 
 

const EditeUser = () => {
  return (
  <FormProvider  schema={updateUserSchema}  defaultValues={{
            phoneNumber: "",
            name: "",
            email: "",
          }}>

<EditUserLogic/>

 </FormProvider>
  );
};

export default EditeUser;