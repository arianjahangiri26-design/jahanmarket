// app/admin/categories/create-category/page.jsx
import { Suspense } from "react";
import CreateCategoryLogic from "@/components/admin/Category/create/createCategory";

const CreateCategory = () => {
  return (
    <div>
      <Suspense fallback={<div>در حال بارگذاری...</div>}>
        <CreateCategoryLogic />
      </Suspense>
    </div>
  );
};

export default CreateCategory;
