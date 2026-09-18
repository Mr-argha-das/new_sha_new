export interface DashboardInvoiceSummary {
  totalAmount: number;
  monthlySummary: Record<string, number>;
  latestInvoices: Array<{
    id: number;
    invoice_number: string;
    invoice_date: string;
    total_amount: number;
    invoice_status: string;
  }>;
}

export interface DashboardData {
  invoiceData: DashboardInvoiceSummary;
  totalUserCount: number;
}

export interface StaffDashboardSummary {
  filters: {
    from_date: string;
    to_date: string;
  };
  todaysTaskCount: number;
  paymentSummary: {
    received: number;
    remaining: number;
  };
  monthlyCompletedTasks: Record<string, number>;
}

