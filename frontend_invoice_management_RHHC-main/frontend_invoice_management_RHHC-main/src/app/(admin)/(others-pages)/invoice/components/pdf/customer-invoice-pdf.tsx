'use client';

import { useAuth } from '@/context/AuthContext';
import { buildInvoiceHTML } from '@/lib/buildInvoiceHTML';
import { capitalizeFirstLetter } from '@/modules/common/helpers/capitalizeWords';
import { toDDMMYYYY } from '@/modules/common/helpers/dateFormat';
import { getFullFileUrl } from '@/modules/common/helpers/helper';
import { AccountSettings } from '@/modules/common/models/accountSettings';
import { Button, ButtonProps } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';

type InvoiceItem = {
  item_type: 'service' | 'product';
  deal_type?: 'rent' | 'sell' | null;
  item_name: string;
  unit_price: number;
  hours_per_day?: number | null;
  quantity: number;
  days: number;
};

type InvoiceData = {
  invoice_number: string;
  invoice_date: string;
  // due_date: string;
  customer_name: string;
  customer_address: string;
  customer_city: string;
  customer_state: string;
  customer_age?: number;
  customer_gender?: string;
  customer_mobile?: string;
  customer_email?: string;
  transportation?: number;
  otherCharges?: number;
  last_invoice_due?: number;
  discount_amount?: number;
  security_deposit?: number;
  is_deposit_counted?: number;
  items: InvoiceItem[];
};

type Props = {
  payload: InvoiceData;
  fileName?: string;
  buttonText?: string;
} & Omit<ButtonProps, 'onClick'>;

export default function CustomerInvoicePdf({
  payload,
  fileName = 'invoice.pdf',
  buttonText = 'Download PDF',
  ...buttonProps
}: Props) {
  const [downloading, setDownloading] = useState(false);
  const { accountSettings } = useAuth();

  function formatInvoiceData(
    data: InvoiceData,
    accountSettings: AccountSettings,
  ) {
    return {
      company: {
        name: accountSettings?.name,
        logoUrl: accountSettings.logo
          ? `${getFullFileUrl(accountSettings?.logo as string)}`
          : null,
        isoCertificateUrl: `${window.location.origin}/images/invoice/ISOCertification.png`,
        addressLines: accountSettings?.address_lines,
        mobile: accountSettings?.mobile,
        email: accountSettings?.email,
        extraIds: accountSettings?.extra_ids
          ? (accountSettings?.extra_ids as Record<
              string,
              string | number | undefined
            >)
          : null,
      },
      meta: {
        invoiceNo: data.invoice_number,
        invoiceDate: toDDMMYYYY(data.invoice_date),
        period: {
          from: toDDMMYYYY(data.invoice_date),
          // to: toDDMMYYYY(data.due_date),
        },
        serviceType: accountSettings?.service_type,
        originalOrDuplicate: '' as 'ORIGINAL' | 'DUPLICATE' | '',
      },
      client: {
        name: capitalizeFirstLetter(data.customer_name),
        addressLines: [
          capitalizeFirstLetter(data.customer_address),
          capitalizeFirstLetter(data.customer_city),
          capitalizeFirstLetter(data.customer_state),
        ].filter(Boolean),
        age: data.customer_age ? `${data.customer_age} YEARS` : '',
        gender: data.customer_gender ? data.customer_gender.toUpperCase() : '',
        mobile: data.customer_mobile,
        email: data.customer_email,
      },
      groups: {
        services: data.items
          .filter((item) => item.item_type === 'service')
          .map((item) => ({
            description: capitalizeFirstLetter(item.item_name),
            hoursPerDay: Number(item.hours_per_day ?? 0) || 0,
            rate: item.unit_price,
            days: item.days,
            quantity: item.quantity,
          })),
        equipmentsOnRent: data.items
          .filter(
            (item) => item.item_type === 'product' && item.deal_type === 'rent',
          )
          .map((item) => ({
            description: capitalizeFirstLetter(item.item_name),
            hoursPerDay: Number(item.hours_per_day ?? 0) || 0,
            rate: item.unit_price,
            days: item.days,
            quantity: item.quantity,
          })),
        equipmentSold: data.items
          .filter(
            (item) => item.item_type === 'product' && item.deal_type === 'sell',
          )
          .map((item) => ({
            description: capitalizeFirstLetter(item.item_name),
            hoursPerDay: Number(item.hours_per_day ?? 0) || 0,
            rate: item.unit_price,
            days: item.days,
            quantity: item.quantity,
          })),
        transportation: data.transportation ?? 0,
        otherCharges: data.otherCharges ?? 0,
        last_invoice_due: data.last_invoice_due ?? 0,
        discount_amount: data.discount_amount ?? 0,
        security_deposit: data.security_deposit ?? 0,
        is_deposit_counted: data.is_deposit_counted ?? 0,
      },
      bank: {
        beneficiary: accountSettings?.name || 'BENEFICIARY NAME',
        bank: accountSettings?.bank_details.bank_name || 'BANK NAME',
        accountNo:
          accountSettings?.bank_details.account_number || 'XXXXXXXXXXXX',
        ifsc: accountSettings?.bank_details.ifsc || 'IFSC0000',
        paymentTerms: 'EVERY 15 DAYS',
      },
      qrCodeDataUrl: accountSettings?.qr_scanner
        ? `${getFullFileUrl(accountSettings?.qr_scanner as string)}`
        : null,
      stampUrl:
        accountSettings?.use_stamp_image === 0
          ? getFullFileUrl(accountSettings?.stamp as string)
          : getFullFileUrl(accountSettings?.stamp_signature as string),
      currency: '₹',
    };
  }

  const handleClick = async () => {
    setDownloading(true);
    try {
      const formatedPayload = formatInvoiceData(
        payload,
        accountSettings as AccountSettings,
      );

      const pdfPayload = {
        htmlContent: buildInvoiceHTML(formatedPayload),
        fileName: 'invoice.pdf',
      };
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pdfPayload),
      });

      if (!res.ok) {
        toast.error(`Failed to generate PDF`);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('`Failed to generate PDF');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      onClick={handleClick}
      disabled={downloading}
      {...buttonProps}
      sx={{
        fontSize: '14px',
        height: '28px',
      }}
    >
      {downloading ? 'Generating PDF...' : buttonText}
    </Button>
  );
}
