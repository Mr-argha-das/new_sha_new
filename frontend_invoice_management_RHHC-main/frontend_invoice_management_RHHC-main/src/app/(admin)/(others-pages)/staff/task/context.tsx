'use client';

import { createContext, useContext, useMemo, useState } from 'react';

export type TaskTabKey = 'all' | 'past' | 'today' | 'future';

export type TaskAdvancedFilters = {
    status?: 'todo' | 'inProgress' | 'done' | '';
    paymentStatus?: 0 | 1 | '';
    staff_id?: number | '';
    customer_id?: number | '';
    service_id?: number | '';
    start_date?: string | '';
    end_date?: string | '';
};

type TaskContextValue = {
    activeTab: TaskTabKey;
    setActiveTab: (tab: TaskTabKey) => void;
    filters: TaskAdvancedFilters;
    setFilters: (next: TaskAdvancedFilters) => void;
    resetFilters: () => void;
};

const TaskContext = createContext<TaskContextValue | null>(null);

export const useTaskContext = (): TaskContextValue => {
    const ctx = useContext(TaskContext);
    if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
    return ctx;
};

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeTab, setActiveTab] = useState<TaskTabKey>('today');
    const [filters, setFiltersState] = useState<TaskAdvancedFilters>({});

    const setFilters = (next: TaskAdvancedFilters) => setFiltersState(next);
    const resetFilters = () => setFiltersState({});

    const value = useMemo(
        () => ({ activeTab, setActiveTab, filters, setFilters, resetFilters }),
        [activeTab, filters],
    );

    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};


