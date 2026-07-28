"use client";
 
import FormProvider from "@/context/form/FormProvider";
import LoginContent from "@/features/users/login/logic/LogicLogin";
import { loginSchema } from "@/lib/validators/auth/auth.schema";
 

  

  

   
  
  
   export default  function LoginPage () {
  
  return (
      <div>
    <FormProvider  schema={loginSchema}  defaultValues={{
        phoneNumber: "",
        code: "",
      }}>
   <LoginContent/> 
  </FormProvider>
  
      </div>
  )
  
  }