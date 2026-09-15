// Register page
"use client";

import { FormProvider } from "@/context/form/FormProvider";
import RegisterContent from "@/features/users/register/logic/LogicRegister";
import { userAuth } from "@/lib/validators/auth/auth.schema";
 
 

 

 

 

export default function Register() {
  return (
    <div className="bg-red">
      
     <FormProvider
  schema={userAuth}
  defaultValues={{
    name: "",
    email: "",
    phoneNumber: "",
    code: "",
  }}
>
      <RegisterContent />


         </FormProvider>

    </div>
  );
}
