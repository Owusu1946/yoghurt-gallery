"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import {
  getAdminSettings,
  saveAdminSettings,
  subscribeAdminSettings,
} from "@/lib/admin-settings";
import { formatGhs } from "@/lib/format-ghs";
import { toast } from "@/lib/toast";
import { useEffect, useState } from "react";

const labelClass =
  "text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/60";
const fieldClass =
  "mt-2 w-full border border-brand/20 bg-white px-3 py-2.5 text-sm text-brand outline-none focus:border-brand";

export function AdminSettingsPanel() {
  const [basePrice, setBasePrice] = useState("");
  const [printFee, setPrintFee] = useState("");

  useEffect(() => {
    function load() {
      const settings = getAdminSettings();
      setBasePrice(String(settings.customTeeBasePrice));
      setPrintFee(String(settings.customPrintFee));
    }
    load();
    return subscribeAdminSettings(load);
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const customTeeBasePrice = Number(basePrice);
    const customPrintFee = Number(printFee);

    if (
      !Number.isFinite(customTeeBasePrice) ||
      customTeeBasePrice <= 0 ||
      !Number.isFinite(customPrintFee) ||
      customPrintFee < 0
    ) {
      toast.error("Invalid pricing", {
        description: "Enter positive numbers for customizer fees.",
      });
      return;
    }

    saveAdminSettings({
      customTeeBasePrice: Math.round(customTeeBasePrice),
      customPrintFee: Math.round(customPrintFee),
    });
    toast.success("Settings saved", {
      description: "Customizer pricing updated for this browser.",
    });
  }

  const previewTotal =
    (Number(basePrice) || 0) + (Number(printFee) || 0);

  return (
    <AdminShell>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-6 border border-brand/10 p-5 sm:p-6"
      >
        <div>
          <label htmlFor="base-price" className={labelClass}>
            Custom tee base price (GHS)
          </label>
          <input
            id="base-price"
            type="number"
            min={1}
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="print-fee" className={labelClass}>
            Print fee per side (GHS)
          </label>
          <input
            id="print-fee"
            type="number"
            min={0}
            value={printFee}
            onChange={(e) => setPrintFee(e.target.value)}
            className={fieldClass}
          />
        </div>

        <p className="text-sm text-brand/60">
          Example single-side custom tee:{" "}
          <span className="font-semibold text-brand">
            {formatGhs(previewTotal)}
          </span>
        </p>

        <button
          type="submit"
          className="border border-brand bg-brand px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90"
        >
          Save settings
        </button>
      </form>
    </AdminShell>
  );
}
