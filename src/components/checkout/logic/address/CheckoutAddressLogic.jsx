// src/components/checkout/CheckoutAddressLogic.jsx
"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFetch } from "@/hooks/crud/UseCrud";
import { CheckoutAddressDesign } from "../../ui/address/CheckoutAddressDesign";

/**
 * Logic-only component for managing checkout addresses.
 * Handles API interaction, state management, and auto-selecting the first address.
 */
export function CheckoutAddressLogic({
  selectedAddressId,
  onSelectAddress,
}) {
  const { request, loading } = useFetch();

  const [addresses, setAddresses] = useState([]);

  // Prevent auto-selecting an address more than once
  const hasAutoSelected = useRef(false);

  /**
   * Log the addresses after React updates the state.
   */
  useEffect(() => {
    console.log("Addresses state after update:", addresses);
  }, [addresses]);

  /**
   * Fetch the user's addresses from the server.
   */
  const loadAddresses = useCallback(async () => {
    try {
      const result = await request({
        url: "/api/user-panel/addresses",
        method: "GET",
      });

      console.log("API response:", result);
      console.log("Fetched addresses:", result?.data?.data);

      const fetchedAddresses = result?.data?.data;

      if (!Array.isArray(fetchedAddresses)) {
        console.error(
          "The addresses data is not an array:",
          fetchedAddresses
        );

        setAddresses([]);
        return;
      }

      // Save fetched addresses in the component state
      setAddresses(fetchedAddresses);

      // Automatically select the first address if no address is selected
      if (
        fetchedAddresses.length > 0 &&
        !selectedAddressId &&
        !hasAutoSelected.current
      ) {
        hasAutoSelected.current = true;
        onSelectAddress(fetchedAddresses[0]._id);
      }
    } catch (error) {
      console.error("Failed to load checkout addresses:", error);
      setAddresses([]);
    }
  }, [request, selectedAddressId, onSelectAddress]);

  /**
   * Load addresses when the component is mounted.
   */
  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  return (
    <CheckoutAddressDesign
      addresses={addresses}
      loading={loading}
      selectedAddressId={selectedAddressId}
      onSelectAddress={onSelectAddress}
    />
  );
}
