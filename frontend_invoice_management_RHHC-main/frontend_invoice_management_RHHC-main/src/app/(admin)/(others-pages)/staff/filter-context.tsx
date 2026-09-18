'use client';

import { createContext, useContext, useMemo, useState } from 'react';

export type StaffAdvancedFilters = {
    has_vehicle?: 0 | 1 | '';
    has_driving_license?: 0 | 1 | '';
    designation?: string | '';
    police_verification?: 0 | 1 | '';
    medical_verification?: 0 | 1 | '';
    status?: string | '';
};

type StaffFilterContextValue = {
    filters: StaffAdvancedFilters;
    setFilters: (next: StaffAdvancedFilters) => void;
    resetFilters: () => void;
};

const StaffFilterContext = createContext<StaffFilterContextValue | null>(null);

export const useStaffFilterContext = (): StaffFilterContextValue => {
    const ctx = useContext(StaffFilterContext);
    if (!ctx) throw new Error('useStaffFilterContext must be used within StaffFilterProvider');
    return ctx;
};

export const StaffFilterProvider = ({ children }: { children: React.ReactNode }) => {
    const [filters, setFiltersState] = useState<StaffAdvancedFilters>({});

    const setFilters = (next: StaffAdvancedFilters) => setFiltersState(next);
    const resetFilters = () => setFiltersState({});

    const value = useMemo(
        () => ({ filters, setFilters, resetFilters }),
        [filters],
    );

    return <StaffFilterContext.Provider value={value}>{children}</StaffFilterContext.Provider>;
};

