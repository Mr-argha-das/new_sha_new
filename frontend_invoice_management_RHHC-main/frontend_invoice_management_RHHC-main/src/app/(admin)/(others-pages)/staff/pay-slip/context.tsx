'use client';

import { createContext, useContext, useMemo, useState } from 'react';

export type PayslipAdvancedFilters = {
    staff_id?: number | '';
    from_date?: string | '';
    to_date?: string | '';
    invoice_status?: 'draft' | 'finalised' | '';
};

type PayslipContextValue = {
    filters: PayslipAdvancedFilters;
    setFilters: (next: PayslipAdvancedFilters) => void;
    resetFilters: () => void;
};

const PayslipContext = createContext<PayslipContextValue | null>(null);

export const usePayslipContext = (): PayslipContextValue => {
    const ctx = useContext(PayslipContext);
    if (!ctx) throw new Error('usePayslipContext must be used within PayslipProvider');
    return ctx;
};

export const PayslipProvider = ({ children }: { children: React.ReactNode }) => {
    const [filters, setFiltersState] = useState<PayslipAdvancedFilters>({});

    const setFilters = (next: PayslipAdvancedFilters) => setFiltersState(next);
    const resetFilters = () => setFiltersState({});

    const value = useMemo(
        () => ({ filters, setFilters, resetFilters }),
        [filters],
    );

    return <PayslipContext.Provider value={value}>{children}</PayslipContext.Provider>;
};

