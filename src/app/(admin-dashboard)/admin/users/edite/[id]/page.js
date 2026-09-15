 
 "use client";
import EditUserLogic from "@/components/admin/users/edite-users/EditeUsers";
import FormProvider from "@/context/form/FormProvider";
 
import { updateUserSchema } from "@/lib/validators/admin/users/user.validation";
 


 

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