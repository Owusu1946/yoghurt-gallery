import { gooeyToast } from "goey-toast";

type ToastOptions = Parameters<typeof gooeyToast.success>[1];

type BrandToastOptions = Pick<
  NonNullable<ToastOptions>,
  "fillColor" | "borderColor" | "borderWidth" | "preset" | "spring" | "bounce"
>;

const brandDefaults: BrandToastOptions = {
  fillColor: "#ffffff",
  borderColor: "rgba(139, 58, 31, 0.22)",
  borderWidth: 1.5,
  preset: "smooth",
};

function withBrand(options?: ToastOptions): ToastOptions {
  return { ...brandDefaults, ...options };
}

function firstError(errors: Record<string, string | undefined>): string | undefined {
  return Object.values(errors).find(Boolean);
}

export const toast = {
  success(title: string, options?: ToastOptions) {
    return gooeyToast.success(title, withBrand(options));
  },

  error(title: string, options?: ToastOptions) {
    return gooeyToast.error(title, withBrand(options));
  },

  warning(title: string, options?: ToastOptions) {
    return gooeyToast.warning(title, withBrand(options));
  },

  info(title: string, options?: ToastOptions) {
    return gooeyToast.info(title, withBrand(options));
  },

  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
      description?: {
        loading?: string;
        success?: string;
        error?: string;
      };
    },
    options?: BrandToastOptions,
  ) {
    return gooeyToast.promise(promise, {
      ...brandDefaults,
      ...options,
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      description: messages.description,
    });
  },

  validationErrors(errors: Record<string, string | undefined>, title = "Check your details") {
    const message = firstError(errors);
    if (!message) return;
    toast.warning(title, { description: message });
  },

  dismiss: gooeyToast.dismiss,
  update: gooeyToast.update,
};

export { gooeyToast };
