import { registerSendOtpSchema } from "@/lib/validators/auth/auth.schema"

 
 

  
registerSendOtpSchema
   
  
  
   export default  function OtpVerify () {
  
  return (
      <div>
      <FormProvider
    schema={se}
    defaultValues={{
      name: "",
      email: "",
      phoneNumber: "",
      code: "",
    }}
  >
   <OtpForm /> 
  </FormProvider>
  
      </div>
  )
  
  }