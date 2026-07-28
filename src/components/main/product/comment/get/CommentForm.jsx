"use client";

import React from "react";
import { FaSpinner } from "react-icons/fa"; // وارد کردن آیکون Spinner

// فرض می‌کنیم هر کامنت این ساختار را دارد:
// { id: string, text: string, author: string, date: string, avatar?: string }

export default function CommentDisplay({ comments = [], commentsLoading = false }) {
  if (commentsLoading) {
    return (
      <div className="flex h-40 items-center justify-center"  >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow-sm animate-pulse">
          {/* استفاده از FaSpinner از react-icons */}
          <FaSpinner className="h-5 w-5" />
        </div>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-slate-500" >
        هنوز هیچ دیدگاهی برای این محصول ثبت نشده است.
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-6" dir="rtl">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            {comment.avatar ? (
              <img
                src={comment.avatar}
                alt={comment.author}
                className="h-12 w-12 rounded-2xl object-cover"
                width={48}
                height={48}
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-xl font-bold text-slate-700">
                {comment.author ? comment.author.charAt(0).toUpperCase() : "?"}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></div>
          </div>

          {/* Comment Content */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-extrabold text-slate-900">
                  {comment?.author || "کاربر ناشناس"}
                </h4>
                <span className="text-xs font-medium text-slate-400">
                  • {comment?.date || "تاریخ نامشخص"}
                </span>
              </div>
              {/* Optional: Rating stars could go here */}
            </div>
            <p className="text-sm leading-7 text-slate-700">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}