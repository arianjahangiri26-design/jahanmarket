 "use client";

import CreateUserLogic from "@/components/admin/users/create-user/CreateUsers";

 
import { FormProvider } from "@/context/form/FormProvider";
import { createUserSchema } from "@/lib/validators/admin/users/user.validation";



 

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