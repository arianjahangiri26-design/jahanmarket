"use client";

import { useState, useCallback } from "react";
import { useSingleImageSlot } from "./useSingleImageSlot";

export function useBannerAdsImageManager({
  initialDesktop = "",
  initialMobile = "",
} = {}) {
  const desktopSlot = useSingleImageSlot(initialDesktop);
  const mobileSlot = useSingleImageSlot(initialMobile);
  const [removeMobile, setRemoveMobile] = useState(false);

  const markMobileForRemoval = useCallback(() => {
    mobileSlot.clearSelection();
    setRemoveMobile(true);
  }, [mobileSlot]);

  const handleMobileChange = useCallback(
    (e) => {
      setRemoveMobile(false);
      mobileSlot.handleInputChange(e);
    },
    [mobileSlot]
  );

  const setMobileFile = useCallback(
    (file) => {
      setRemoveMobile(false);
      mobileSlot.setFile(file);
    },
    [mobileSlot]
  );

  const syncInitialImages = useCallback(
    ({ desktop = "", mobile = "" }) => {
      desktopSlot.syncInitialUrl(desktop);
      mobileSlot.syncInitialUrl(mobile);
      setRemoveMobile(false);
    },
    [desktopSlot, mobileSlot]
  );

  const buildFormData = useCallback(
    (values) => {
      const formData = new FormData();

      Object.entries(values).forEach(([key, val]) => {
        if (key === "desktopImage" || key === "mobileImage") return;
        if (val === undefined || val === null) {
          formData.append(key, "");
        } else if (typeof val === "boolean") {
          formData.append(key, String(val));
        } else if (val instanceof Date) {
          formData.append(key, val.toISOString());
        } else {
          formData.append(key, String(val));
        }
      });

      if (desktopSlot.file) {
        formData.append("desktopImage", desktopSlot.file);
      }

      if (mobileSlot.file) {
        formData.append("mobileImage", mobileSlot.file);
      }

      if (removeMobile) {
        formData.append("removeMobileImage", "true");
      }

      return formData;
    },
    [desktopSlot.file, mobileSlot.file, removeMobile]
  );

  return {
    desktop: desktopSlot,
    mobile: mobileSlot,
    removeMobile,
    markMobileForRemoval,
    handleMobileChange,
    setMobileFile,
    syncInitialImages,
    buildFormData,
  };
}
