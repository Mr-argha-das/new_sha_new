'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { getStaffPaySlipById } from '../../api';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

export enum PayslipSection {
    GeneralInformation = 'General Information',
}

type Activity = {
    id: number;
    customer_name: string;
    service_name?: string;
    from_date_time: string;
    to_date_time: string;
    start_date_time: string;
    end_date_time: string;
    status: string;
    total_hour: number | string;
};

type QuickPay = { id: number; date: string; description?: string; amount: number | string };

type InvoiceDetail = {
    invoice: {
        id: number;
        user_id?: number;
        staff_name: string;
        from_date: string;
        to_date: string;
        invoice_status: string;
        hour_price?: number | string;
        total_hours?: number | string;
        total_price?: number | string;
        deduct_price?: number | string;
    };
    activities?: Activity[];
    staffQuickPays?: QuickPay[];
};

export type PayslipContextType = {
    invoice: InvoiceDetail | null;
    loading: boolean;
    activeSection: PayslipSection | null;
    setActiveSection: React.Dispatch<React.SetStateAction<PayslipSection | null>>;

};

export const PayslipContext = React.createContext<PayslipContextType | undefined>(undefined);

export const PayslipProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
    const params = useParams();
    const id = String(params?.id || '');
    const { token } = useAuth();
    const [activeSection, setActiveSection] = React.useState<PayslipSection | null>(null);

    const {
        data: response,
        isFetching,
    } = useQuery({
        queryKey: ['getStaffPaySlipById', id],
        queryFn: () => getStaffPaySlipById(id).then((response) => response.data),
        enabled: !!id && !!token,
    });

    return (
        <PayslipContext.Provider value={{
            invoice: response?.data ?? null,
            loading: isFetching,
            activeSection,
            setActiveSection,
        }}>
            {children}
        </PayslipContext.Provider>
    );
};

export const usePayslip = () => {
    const ctx = React.useContext(PayslipContext);
    if (!ctx) throw new Error('usePayslip must be used within PayslipProvider');
    return ctx;
};
