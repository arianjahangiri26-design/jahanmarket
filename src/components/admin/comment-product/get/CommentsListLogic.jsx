"use client";

import { useEffect } from "react";
import { useFetch } from "@/hooks/crud/UseCrud";
import AdminTable from "@/shared/admin/AdminTable";

export default function CommentsListLogic() {
  const { request, data, loading } = useFetch();

  const loadComments = async () => {
    await request({
      method: "GET",
      url: "/api/admin/comment-product",
    });
  };

  useEffect(() => {
    loadComments();
  }, []);

  const removeComment = async (commentId) => {
    const confirmed = confirm("آیا از حذف این کامنت اطمینان دارید؟");
    if (!confirmed) return;

    const res = await request({
      method: "DELETE",
      url: `/api/admin/comment-product/${commentId}`,
    });

    if (res?.data?.success || res?.success) {
      loadComments();
    }
  };

  const toggleCommentApproval = async (comment) => {
    // بررسی وضعیت (چه بولین باشد و چه استرینگ)
    const isCurrentlyApproved =
      comment?.isApproved === true || comment?.isApproved === "تأیید شده";
    const nextStatus = !isCurrentlyApproved;

    const confirmed = confirm(
      nextStatus
        ? "آیا این کامنت تأیید شود؟"
        : "آیا این کامنت از حالت تأیید خارج شود؟"
    );

    if (!confirmed) return;

    const res = await request({
      method: "PATCH",
      url: `/api/admin/comment-product/${comment._id}`,
      data: { isApproved: nextStatus },
    });

    if (res?.data?.success || res?.success) {
      loadComments();
    }
  };

  // استخراج ایمن آرایه کامنت‌ها
  const rawComments = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.message?.data)
    ? data.message.data
    : Array.isArray(data)
    ? data
    : [];

  const tableData = rawComments.map((comment) => ({
    ...comment,
    text:
      comment?.text?.length > 70
        ? `${comment.text.slice(0, 70)}...`
        : comment?.text || "-",
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
        <p className="animate-pulse text-sm font-semibold text-blue-500">
          در حال بارگذاری لیست کامنت‌ها...
        </p>
      </div>
    );
  }

  return (
    <AdminTable
      columns={columns}
      data={tableData}
      actions={(comment) => {
        const isApproved =
          comment?.isApproved === true || comment?.isApproved === "تأیید شده";

        return (
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => toggleCommentApproval(comment)}
              className={`text-xs font-semibold transition cursor-pointer ${
                isApproved
                  ? "text-amber-400 hover:text-amber-300"
                  : "text-emerald-400 hover:text-emerald-300"
              }`}
            >
              {isApproved ? "لغو تأیید" : "تأیید"}
            </button>

            <button
              type="button"
              onClick={() => removeComment(comment._id)}
              className="text-xs font-semibold text-rose-400 transition hover:text-rose-300 cursor-pointer"
            >
              حذف
            </button>
          </div>
        );
      }}
    />
  );
}
