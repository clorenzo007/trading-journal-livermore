import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "trades_table_state_v1";

/**
 * Custom Hook: useAdvancedTable
 * 
 * Manages complex table state:
 * - Column Filtering: Filters rows based on column-specific comparison (text, range).
 * - Multi-Column Sorting: Sorts rows by multiple keys (priority based on order).
 * - Persistence: Saves table state to localStorage.
 */
export function useAdvancedTable(rows, columns) {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [columnFilters, setColumnFilters] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw).columnFilters || {};
      } catch {
        return {};
      }
    }
    return {};
  });
  const [sorting, setSorting] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw).sorting || [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Persist state
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ columnFilters, sorting })
    );
  }, [columnFilters, sorting]);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      return columns.every((col) => {
        const f = columnFilters[col.key];
        if (!f) return true;

        const value = row[col.key];

        if (typeof f === "string") {
          return String(value ?? "")
            .toLowerCase()
            .includes(f.toLowerCase());
        }

        if (f.min !== undefined && Number(value) < Number(f.min)) return false;
        if (f.max !== undefined && Number(value) > Number(f.max)) return false;

        return true;
      });
    });
  }, [rows, columnFilters, columns]);

  const sorted = useMemo(() => {
    if (!sorting.length) return filtered;

    return [...filtered].sort((a, b) => {
      for (const s of sorting) {
        const av = a[s.key];
        const bv = b[s.key];
        if (av === bv) continue;

        if (av > bv) return s.dir === "asc" ? 1 : -1;
        if (av < bv) return s.dir === "asc" ? -1 : 1;
      }
      return 0;
    });
  }, [filtered, sorting]);

  const toggleSort = (key, multi) => {
    setSorting((prev) => {
      const existing = prev.find((s) => s.key === key);
      let next = multi ? [...prev] : [];

      if (!existing) {
        next.push({ key, dir: "asc" });
      } else if (existing.dir === "asc") {
        existing.dir = "desc";
      } else {
        next = next.filter((s) => s.key !== key);
      }
      return [...next];
    });
  };

  return {
    rows: sorted,
    filtersVisible,
    setFiltersVisible,
    columnFilters,
    setColumnFilters,
    sorting,
    toggleSort,
  };
}
