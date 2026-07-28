"use client";

import { useRef } from "react";
import { useFetch } from "@/hooks/crud/UseCrud";
import AdminTable from "@/shared/admin/AdminTable";

export default function CommentsListLogic() {
  const { request, data, loading } = useFetch();
  const hasLoaded = useRef(false);

  const loadComments = async () => {
    await request({
      method: "GET",
      url: "/api/admin/commet-product",
    });
  };

  if (!hasLoaded.current) {
    hasLoaded.current = true;
    loadComments();
  }

  const removeComment = async (commentId) => {
    const confirmed = confirm("آیا از حذف این کامنت اطمینان دارید؟");
    if (!confirmed) return;

    const res = await request({
      method: "DELETE",
      url: `/api/admin/commet-product/${commentId}`,
    });

    if (res?.data?.success || res?.success) {
      loadComments();
    }
  };

  const toggleCommentApproval = async (comment) => {
    const nextStatus = comment?.isApproved !== "تأیید شده";
    const confirmed = confirm(
      nextStatus
        ? "آیا این کامنت تأیید شود؟"
        : "آیا این کامنت از حالت تأیید خارج شود؟"
    );

    if (!confirmed) return;

    const res = await request({
      method: "PATCH",
      url: `/api/admin/commet-product/${comment._id}`,
      data: { isApproved: nextStatus },
    });

    if (res?.data?.success || res?.success) {
      loadComments();
    }
  };

  const comments = data?.message?.data || data?.data || [];

  const tableData = comments.map((comment) => ({
    ...comment,
    text: comment?.text?.length > 70 ? `${comment.text.slice(0, 70)}...` : comment.text,
    isApproved: comment?.isApproved ? "تأیید شده" : "در انتظار تأیید",
    createdAt: comment?.createdAt
      ? new Date(comment.createdAt).toLocaleDateString("fa-IR")
      : "-",
  }));

  const columns = [
    { key: "text", label: "متن کامنت" },
    { key: "author.name", label: "نویسنده" },
    { key: "product.name", label: "محصول" },
    { key: "isApproved", label: "وضعیت" },
    { key: "createdAt", label: "تاریخ ثبت" },
  ];

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="animate-pulse text-sm font-semibold text-blue-600">
          در حال بارگذاری لیست کامنت‌ها...
        </p>
      </div>
    );
  }

  return (
    <AdminTable
      columns={columns}
      data={tableData}
      actions={(comment) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleCommentApproval(comment)}
            className={`text-xs font-semibold transition ${
              comment?.isApproved === "تأیید شده"
                ? "text-yellow-600 hover:text-yellow-800"
                : "text-green-600 hover:text-green-800"
            }`}
          >
            {comment?.isApproved === "تأیید شده" ? "لغو تأیید" : "تأیید"}
          </button>

          <button
            type="button"
            onClick={() => removeComment(comment._id)}
            className="text-xs font-semibold text-red-500 transition hover:text-red-700"
          >
            حذف
          </button>
        </div>
      )}
    />
  );
}
