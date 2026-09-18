'use client';

import { createContext, useContext, useMemo, useState } from 'react';

export type InvoiceAdvancedFilters = {
    lead_id?: number | '';
    customer_id?: number | '';
    invoice_status?: 'draft' | 'published' | 'cancelled' | '';
    payment_status?: 'paid' | 'unpaid' | 'partial' | 'carry-forward' | '';
    from_date?: string | '';
    to_date?: string | '';
    is_deposit_counted?: 0 | 1 | '';
    has_rent_products?: 0 | 1 | '';
};

type InvoiceFilterContextValue = {
    filters: InvoiceAdvancedFilters;
    setFilters: (next: InvoiceAdvancedFilters) => void;
    resetFilters: () => void;
};

const InvoiceFilterContext = createContext<InvoiceFilterContextValue | null>(null);

export const useInvoiceFilterContext = (): InvoiceFilterContextValue => {
    const ctx = useContext(InvoiceFilterContext);
    if (!ctx) throw new Error('useInvoiceFilterContext must be used within InvoiceFilterProvider');
    return ctx;
};

export const InvoiceFilterProvider = ({ children }: { children: React.ReactNode }) => {
    const [filters, setFiltersState] = useState<InvoiceAdvancedFilters>({});

    const setFilters = (next: InvoiceAdvancedFilters) => setFiltersState(next);
    const resetFilters = () => setFiltersState({});

    const value = useMemo(
        () => ({ filters, setFilters, resetFilters }),
        [filters],
    );

    return <InvoiceFilterContext.Provider value={value}>{children}</InvoiceFilterContext.Provider>;
};

