'use client';

import { createContext, useContext, useMemo, useState } from 'react';

export type TrackingHistoryAdvancedFilters = {
  deal_type?: 'rent' | 'sell' | '';
  from_date?: string | '';
  to_date?: string | '';
};

type TrackingHistoryFilterContextValue = {
  filters: TrackingHistoryAdvancedFilters;
  setFilters: (next: TrackingHistoryAdvancedFilters) => void;
  resetFilters: () => void;
};

const TrackingHistoryFilterContext = createContext<TrackingHistoryFilterContextValue | null>(null);

export const useTrackingHistoryFilterContext = (): TrackingHistoryFilterContextValue => {
  const ctx = useContext(TrackingHistoryFilterContext);
  if (!ctx) throw new Error('useTrackingHistoryFilterContext must be used within TrackingHistoryFilterProvider');
  return ctx;
};

export const TrackingHistoryFilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFiltersState] = useState<TrackingHistoryAdvancedFilters>({});

  const setFilters = (next: TrackingHistoryAdvancedFilters) => setFiltersState(next);
  const resetFilters = () => setFiltersState({});

  const value = useMemo(
    () => ({ filters, setFilters, resetFilters }),
    [filters],
  );

  return <TrackingHistoryFilterContext.Provider value={value}>{children}</TrackingHistoryFilterContext.Provider>;
};
