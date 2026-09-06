 "use client";

 

  
 
import CreateUserLogic from "@/components/admin/users/create/CreateUsers";
import { createUserSchema } from "@/lib/validators/admin/users/user.validation";
import { FormProvider } from "react-hook-form";

 

 

const CreateUser = () => {
  return (
        <FormProvider  schema={createUserSchema}  defaultValues={{
            phoneNumber: "",
            code: "",
          }}>

<CreateUserLogic/>


          </FormProvider>
  );
};

export default CreateUser;