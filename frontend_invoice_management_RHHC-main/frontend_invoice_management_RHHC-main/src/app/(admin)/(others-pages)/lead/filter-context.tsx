'use client';

import { createContext, useContext, useMemo, useState } from 'react';

export type LeadAdvancedFilters = {
    customer_id?: number | '';
    start_date?: string | '';
    end_date?: string | '';
    status?: 'draft' | 'finalised' | 'onhold' | 'invalid' | '';
    lead_status?: 'created' | 'inProgress' | 'completed' | '';
};

type LeadFilterContextValue = {
    filters: LeadAdvancedFilters;
    setFilters: (next: LeadAdvancedFilters) => void;
    resetFilters: () => void;
};

const LeadFilterContext = createContext<LeadFilterContextValue | null>(null);

export const useLeadFilterContext = (): LeadFilterContextValue => {
    const ctx = useContext(LeadFilterContext);
    if (!ctx) throw new Error('useLeadFilterContext must be used within LeadFilterProvider');
    return ctx;
};

export const LeadFilterProvider = ({ children }: { children: React.ReactNode }) => {
    const [filters, setFiltersState] = useState<LeadAdvancedFilters>({});

    const setFilters = (next: LeadAdvancedFilters) => setFiltersState(next);
    const resetFilters = () => setFiltersState({});

    const value = useMemo(
        () => ({ filters, setFilters, resetFilters }),
        [filters],
    );

    return <LeadFilterContext.Provider value={value}>{children}</LeadFilterContext.Provider>;
};

