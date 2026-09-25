import { Button } from "@heroui/react";
import { ShoppingCart } from "lucide-react";

export const AddToCartButton = ({
  loading = false,
  error = null,
  onAddToCart,
}) => {
  // Normalize error value to support string and object error shapes.
  const errorMessage =
    typeof error === "string"
      ? error
      : error?.error || error?.message || null;

  return (
    <div className="flex w-full flex-col gap-2">
      <Button
        type="button"
        // Beautiful vibrant blue theme with custom styling
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 ease-in-out py-6 rounded-xl border border-blue-400/20"
        isLoading={loading}
        isDisabled={loading}
        onPress={onAddToCart}
        // Custom loading spinner color matching the text
        spinner={
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        }
      >
        {!loading && <ShoppingCart className="w-5 h-5 ml-2 animate-pulse" />}
        {loading ? "در حال افزودن به سبد..." : "افزودن به سبد خرید"}
      </Button>

      {errorMessage && (
        <div 
          role="alert" 
          aria-live="polite" 
          className="flex items-center gap-2 mt-1 px-3 py-2 bg-rose-50 border border-rose-100 rounded-lg text-xs font-semibold text-rose-600 animate-fadeIn"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          {errorMessage}
        </div>
      )}
    </div>
  );
};
