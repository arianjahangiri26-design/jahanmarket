// Register page
"use client";

import RegisterContent from "@/features/users/register/logic/LogicRegister";
import { userAuth } from "@/lib/validators/auth/auth.schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Register() {
  const methods = useForm({
    resolver: zodResolver(userAuth),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      code: "",
    },
  });

  return (
    <div>
      <FormProvider {...methods}>
        <RegisterContent />
      </FormProvider>
    </div>
  );
}