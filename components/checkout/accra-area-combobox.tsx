"use client";

import { accraAreaGroups, accraAreas, findAccraArea } from "@/data/accra-areas";
import { authFieldClass, authLabelClass } from "@/components/auth/form-styles";
import { AuthFieldError } from "@/components/auth/auth-field-error";
import { cn } from "@/lib/cn";
import { ChevronDown, Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

type AccraAreaComboboxProps = {
  value: string;
  onChange: (areaId: string) => void;
  error?: string;
};

export function AccraAreaCombobox({
  value,
  onChange,
  error,
}: AccraAreaComboboxProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);

  const selected = findAccraArea(value);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return accraAreaGroups;

    return accraAreaGroups
      .map((group) => ({
        ...group,
        areas: group.areas.filter((area) =>
          area.label.toLowerCase().includes(q),
        ),
      }))
      .filter((group) => group.areas.length > 0);
  }, [query]);

  const flatFiltered = useMemo(
    () => filteredGroups.flatMap((g) => g.areas),
    [filteredGroups],
  );

  useEffect(() => {
    setHighlightIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  function selectArea(areaId: string) {
    onChange(areaId);
    const area = findAccraArea(areaId);
    setQuery(area?.label ?? "");
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (!open && (event.key === "ArrowDown" || event.key === "Enter")) {
      setOpen(true);
      return;
    }

    if (!open) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && flatFiltered[highlightIndex]) {
      event.preventDefault();
      selectArea(flatFiltered[highlightIndex].id);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={`${listboxId}-input`} className={authLabelClass}>
        Area in Accra
      </label>
      <div className="relative mt-2">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand/40"
          strokeWidth={1.25}
        />
        <input
          id={`${listboxId}-input`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          autoComplete="off"
          value={open ? query : (selected?.label ?? query)}
          placeholder="Search areas — e.g. Dansoman, Osu, Tema"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setQuery(selected?.label ?? query);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={cn(authFieldClass, "mt-0 pl-10 pr-10")}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setOpen((o) => !o)}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-brand/50"
          aria-label={open ? "Close area list" : "Open area list"}
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
            strokeWidth={1.25}
          />
        </button>
      </div>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto border border-brand/15 bg-white py-1 shadow-sm"
        >
          {flatFiltered.length === 0 ? (
            <li className="px-4 py-3 text-sm text-brand/55">
              No areas match &ldquo;{query}&rdquo;
            </li>
          ) : (
            filteredGroups.map((group) => (
              <li key={group.label}>
                <p className="sticky top-0 bg-brand/[0.04] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/45">
                  {group.label}
                </p>
                <ul>
                  {group.areas.map((area) => {
                    const flatIndex = flatFiltered.findIndex(
                      (a) => a.id === area.id,
                    );
                    const isHighlighted = flatIndex === highlightIndex;
                    const isSelected = area.id === value;

                    return (
                      <li key={area.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onMouseEnter={() => setHighlightIndex(flatIndex)}
                          onClick={() => selectArea(area.id)}
                          className={cn(
                            "w-full px-4 py-2.5 text-left text-sm text-brand transition-colors",
                            isHighlighted && "bg-brand/[0.06]",
                            isSelected && "font-semibold",
                          )}
                        >
                          {area.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))
          )}
        </ul>
      ) : null}

      <input type="hidden" name="accraAreaId" value={value} required />

      {!value && !open ? (
        <p className="mt-1.5 text-xs text-brand/45">
          {accraAreas.length} areas across Greater Accra
        </p>
      ) : null}

      <AuthFieldError message={error} />
    </div>
  );
}
