// Register page
"use client";

 
import RegisterContent from "@/features/users/register/logic/LogicRegister";
import { userAuth } from "@/lib/validators/auth/auth.schema";
import { FormProvider } from "react-hook-form";
 
  

 

 

 

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
