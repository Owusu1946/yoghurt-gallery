"use client";

import { AccraAreaCombobox } from "@/components/checkout/accra-area-combobox";
import { ghanaRegions } from "@/data/ghana-regions";
import { isGreaterAccraRegion } from "@/lib/orders";
import type { CheckoutFormErrors, CheckoutFormInput } from "@/lib/orders";
import { cn } from "@/lib/cn";

const fieldClass =
  "mt-2 w-full border border-brand/20 bg-white px-4 py-3 text-sm text-brand outline-none transition-colors placeholder:text-brand/35 focus:border-brand";

const labelClass =
  "text-[10px] font-semibold uppercase tracking-[0.28em] text-brand";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-700">{message}</p>;
}

type DeliveryLocationFieldsProps = {
  form: CheckoutFormInput;
  errors: CheckoutFormErrors;
  onFieldChange: <K extends keyof CheckoutFormInput>(
    key: K,
    value: CheckoutFormInput[K],
  ) => void;
};

export function DeliveryLocationFields({
  form,
  errors,
  onFieldChange,
}: DeliveryLocationFieldsProps) {
  const inAccra = isGreaterAccraRegion(form.regionId);

  function handleRegionChange(regionId: string) {
    onFieldChange("regionId", regionId);
    if (!isGreaterAccraRegion(regionId)) {
      onFieldChange("accraAreaId", "");
    } else {
      onFieldChange("townOrCity", "");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className={labelClass}>Delivery location</p>
        <p className="mt-1 text-sm text-brand/55">
          We deliver across Ghana. Accra customers can pick their area from the
          list.
        </p>
      </div>

      <div>
        <label htmlFor="regionId" className={labelClass}>
          Region
        </label>
        <select
          id="regionId"
          name="regionId"
          required
          value={form.regionId}
          onChange={(e) => handleRegionChange(e.target.value)}
          className={cn(fieldClass, "cursor-pointer")}
        >
          <option value="" disabled>
            Select region
          </option>
          {ghanaRegions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.label}
            </option>
          ))}
        </select>
        <FieldError message={errors.regionId} />
      </div>

      {inAccra ? (
        <AccraAreaCombobox
          value={form.accraAreaId}
          onChange={(areaId) => onFieldChange("accraAreaId", areaId)}
          error={errors.accraAreaId}
        />
      ) : form.regionId ? (
        <div>
          <label htmlFor="townOrCity" className={labelClass}>
            City / town
          </label>
          <input
            id="townOrCity"
            name="townOrCity"
            type="text"
            required
            value={form.townOrCity}
            onChange={(e) => onFieldChange("townOrCity", e.target.value)}
            className={fieldClass}
            placeholder="e.g. Kumasi, Tamale, Cape Coast"
          />
          <FieldError message={errors.townOrCity} />
        </div>
      ) : null}

      <div>
        <label htmlFor="address" className={labelClass}>
          House address
        </label>
        <textarea
          id="address"
          name="address"
          required
          rows={2}
          value={form.address}
          onChange={(e) => onFieldChange("address", e.target.value)}
          className={cn(fieldClass, "resize-y min-h-[4.5rem]")}
          placeholder="House number, street name, estate or building"
        />
        <FieldError message={errors.address} />
      </div>

      <div>
        <label htmlFor="landmark" className={labelClass}>
          Closest landmark
        </label>
        <input
          id="landmark"
          name="landmark"
          type="text"
          required
          value={form.landmark}
          onChange={(e) => onFieldChange("landmark", e.target.value)}
          className={fieldClass}
          placeholder="e.g. near Melcom, opposite the police station, behind the church"
        />
        <p className="mt-1.5 text-xs text-brand/45">
          A well-known place near your home so our rider can find you easily.
        </p>
        <FieldError message={errors.landmark} />
      </div>
    </div>
  );
}
