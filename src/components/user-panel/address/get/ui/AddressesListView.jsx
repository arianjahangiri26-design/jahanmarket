"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Card, Modal, Spinner } from "@heroui/react";
import { AlertCircle, Edit3, MapPin, Plus, Trash2 } from "lucide-react";

export default function AddressesListView({
  addresses = [],
  loading = false,
  serverError = "",
  deletingId = "",
  onDelete,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const isDeleting = Boolean(deletingId);

  const handleOpenDeleteModal = (address) => {
    setSelectedAddress(address);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    if (isDeleting) return;

    setIsOpen(false);
    setSelectedAddress(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAddress?._id || typeof onDelete !== "function") return;

    try {
      await onDelete(selectedAddress._id);
      setIsOpen(false);
      setSelectedAddress(null);
    } catch {
      // در صورت خطا، مودال باز باقی می‌ماند
    }
  };

  if (loading && addresses.length === 0) {
    return (
      <div
        dir="rtl"
        className="flex min-h-48 w-full flex-col items-center justify-center gap-2 px-4"
      >
        <Spinner size="md" color="primary" />

        <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
          در حال دریافت آدرس‌ها...
        </p>
      </div>
    );
  }

  return (
    <section
      dir="rtl"
      className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8"
    >
      {/* Section Header */}
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-gradient-to-l from-blue-50/80 to-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-blue-900/40 dark:from-blue-950/30 dark:to-slate-900">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <MapPin size={18} />
            <span className="text-xs font-bold">اطلاعات ارسال</span>
          </div>

          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 sm:text-2xl">
            آدرس‌های من
          </h1>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            آدرس‌های ارسال سفارش‌ها را مدیریت کنید.
          </p>
        </div>

        {/* دکمه کشیده با Link نیتیو Next.js و رنگ آبی پررنگ جذاب */}
        <Link
          href="/user-panel/setting/addresses/create"
          className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 active:scale-[0.98] sm:w-auto"
        >
          <Plus size={19} />
          <span>افزودن آدرس جدید</span>
        </Link>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-danger-200 bg-danger-50 p-3.5 text-sm leading-6 text-danger-700 dark:border-danger-800 dark:bg-danger-900/20">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Empty State */}
      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/30 px-5 py-10 text-center dark:border-blue-900/50 dark:bg-blue-950/20">
          <MapPin className="mx-auto mb-3 text-blue-500" size={40} />

          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            هنوز آدرسی ثبت نشده است
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            برای ارسال سریع‌تر سفارش، آدرس خود را ثبت کنید.
          </p>

          <Link
            href="/user-panel/setting/addresses/create"
            className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
          >
            <Plus size={19} />
            <span>ثبت آدرس جدید</span>
          </Link>
        </div>
      ) : (
        /* گرید عریض‌تر با فاصله‌گذاری بیشتر بین کارت‌ها */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {addresses.map((address) => {
            const addressId = address._id;
            const isCurrentDeleting = deletingId === addressId;

            return (
              <Card
                key={addressId}
                className="min-w-0 border border-blue-100 bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900"
              >
                {/* Card Header */}
                <Card.Header className="flex min-w-0 gap-3.5 px-5 pb-1 pt-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <MapPin size={22} />
                  </div>

                  <div className="min-w-0 flex-1 text-right">
                    <h2 className="truncate text-lg font-bold text-slate-800 dark:text-slate-100">
                      {address.province}، {address.city}
                    </h2>

                    <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                      پلاک: {address.plaque || "-"}
                    </p>
                  </div>
                </Card.Header>

                {/* Card Content */}
                <Card.Content className="px-5 py-3">
                  <p className="min-h-14 break-words rounded-xl bg-blue-50/50 p-3 text-sm leading-6 text-slate-600 dark:bg-blue-950/20 dark:text-slate-300">
                    {address.fullAddress}
                  </p>
                </Card.Content>

                {/* Card Footer */}
                <Card.Footer className="flex justify-end gap-3 border-t border-blue-50 px-5 py-3 dark:border-slate-800">
                  <Link
                    href={`/user-panel/setting/addresses/${addressId}`}
                    className="inline-flex h-10 w-32 items-center justify-center gap-1.5 rounded-xl bg-blue-50 px-4 text-sm font-bold text-blue-700 transition-all hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60"
                  >
                    <Edit3 size={17} />
                    <span>ویرایش</span>
                  </Link>

                  <Button
                    size="md"
                    variant="light"
                    color="danger"
                    radius="lg"
                    isDisabled={isDeleting}
                    isLoading={isCurrentDeleting}
                    onPress={() => handleOpenDeleteModal(address)}
                    startContent={!isCurrentDeleting && <Trash2 size={17} />}
                    className="h-10 w-32 px-4 text-sm font-bold"
                  >
                    حذف
                  </Button>
                </Card.Footer>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="mx-3 w-[calc(100%-1.5rem)] max-w-md text-right sm:mx-0 sm:w-full">
              <Modal.CloseTrigger />

              <Modal.Header className="px-5 pb-1 pt-5 sm:px-6 sm:pt-6">
                <Modal.Heading className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  حذف آدرس
                </Modal.Heading>
              </Modal.Header>

              <Modal.Body className="px-5 text-base leading-7 text-slate-600 dark:text-slate-300 sm:px-6">
                آیا از حذف آدرس «
                <strong className="text-blue-600 dark:text-blue-400">
                  {selectedAddress?.province}، {selectedAddress?.city}
                </strong>
                » اطمینان دارید؟
              </Modal.Body>

              <Modal.Footer className="flex flex-col-reverse gap-3 px-5 pb-5 sm:flex-row sm:justify-end sm:px-6">
                <Button
                  variant="flat"
                  size="lg"
                  isDisabled={isDeleting}
                  onPress={handleCloseModal}
                  className="h-11 w-full px-5 text-sm font-bold sm:w-auto"
                >
                  انصراف
                </Button>

                <Button
                  color="danger"
                  size="lg"
                  isLoading={isDeleting}
                  onPress={handleConfirmDelete}
                  className="h-11 w-full px-5 text-sm font-bold sm:w-auto"
                >
                  حذف آدرس
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </section>
  );
}
