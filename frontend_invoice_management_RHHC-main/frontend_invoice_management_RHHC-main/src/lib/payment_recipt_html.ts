import { buildCompanyHeaderHTML, companyHeaderCss } from '@/lib/companyHeaderHTML';

export type ReceiptPayload = {
  company?: {
    name: string;
    logoUrl?: string;
    addressLines?: string;
    phone?: string;
    mobile?: string;
    email?: string;
    extraIds?: Record<string, string | number | undefined> | null;
    isoCertificateUrl?: string;
  };
  receiptNo: string;
  date: string; // dd.mm.yyyy
  from: string;
  rupees: string;
  againstBillNo?: string;
  chequeOrDraftNo?: string; // deprecated in favor of paymentMethod + otherDetails
  onAccountOf?: string;
  bankName?: string;
  stampUrl?: string;
  // New fields to support method-specific rendering
  paymentMethod?: string;
  otherDetails?: {
    cheque_no?: string;
    bank_name?: string;
    transaction_id?: string;
    card_last4?: string;
    upi_id?: string;
    utr_number?: string;
  } | null;
};

export function buildReceiptHTML(data: ReceiptPayload) {
  const css = `
    @page { size: A4; margin: 12mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #000; }
    .sheet { width: 100%; max-width: 210mm; margin: 0 auto; border: 2px solid #000; padding: 12px; }
    ${companyHeaderCss}
    .iso-certificate { max-height: 60px; max-width:140px; min-height:40px; min-width:90px; opacity: 0.85; }
    .title { text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 12px; letter-spacing: 1px; }
    .details { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; }
    .details td { border: 1px solid #000; padding: 6px; vertical-align: top; }
    .label { font-weight: bold; width: 150px; }
    .stamp-box { text-align: right; margin-top: 40px; }
    .stamp { width: 130px; height: 130px; object-fit: contain; opacity: 0.85; }
  `;

  return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Payment Receipt</title>
  <style>${css}</style>
</head>
<body>
  <div class="sheet">
    <!-- Header -->
    ${buildCompanyHeaderHTML(data.company ?? { name: '' })}

    <!-- Title -->
    <div class="title">PAYMENT RECEIPT</div>

    <!-- Receipt Details -->
    <table class="details">
      <tr>
        <td class="label">Receipt No.</td>
        <td>${data.receiptNo}</td>
        <td class="label">Date</td>
        <td>${data.date}</td>
      </tr>
      <tr>
        <td class="label">Received From</td>
        <td colspan="3">${data.from}</td>
      </tr>
      <tr>
        <td class="label">Rupees</td>
        <td colspan="3">${data.rupees}</td>
      </tr>
      <tr>
        <td class="label">Against Bill No.</td>
        <td colspan="3">${data.againstBillNo ?? ''}</td>
      </tr>
      ${data.onAccountOf
      ? `<tr>
        <td class="label">On Account Of</td>
        <td colspan="3">${data.onAccountOf}</td>
      </tr>`
      : ''
    }

      ${(() => {
      const method = data.paymentMethod;
      const d = data.otherDetails || {};
      const preferBank = d.bank_name || '-';
      if (!method) {
        // Backward compatibility: show legacy fields if method not provided
        const bankRow = preferBank
          ? `<tr>
            <td class="label">Bank Name</td>
            <td colspan="3">${preferBank}</td>
          </tr>`
          : '';
        return bankRow;
      }

      const methodRow = `<tr>
          <td class="label">Payment Method</td>
          <td colspan="3">${method.replace('_', ' ').toUpperCase()}</td>
        </tr>`;

      if (method === 'cheque') {
        return (
          methodRow +
          `
          <tr>
            <td class="label">Bank Name</td>
            <td>${preferBank}</td>
            <td class="label">Cheque No</td>
            <td>${d.cheque_no || '-'}</td>
          </tr>`
        );
      }

      if (method === 'bank_transfer') {
        return (
          methodRow +
          `
          <tr>
            <td class="label">Bank Name</td>
            <td>${preferBank}</td>
            <td class="label">Transaction ID</td>
            <td>${d.transaction_id || '-'}</td>
          </tr>`
        );
      }

      if (method === 'card') {
        return (
          methodRow +
          `
          <tr>
            <td class="label">Bank Name</td>
            <td>${preferBank}</td>
            <td class="label">Card Last 4</td>
            <td>${d.card_last4 || '-'}</td>
          </tr>`
        );
      }

      if (method === 'upi') {
        return (
          methodRow +
          `
          <tr>
            <td class="label">UPI ID</td>
            <td>${d.upi_id || '-'}</td>
            <td class="label">UTR Number</td>
            <td>${d.utr_number || '-'}</td>
          </tr>`
        );
      }

      // cash / other
      return methodRow;
    })()}
    </table>

    <!-- Stamp -->
    <div class="stamp-box">
      ${data.stampUrl ? `<img class="stamp" src="${data.stampUrl}" />` : '<div style="width:100px;height:100px;border:1px dashed #aaa;display:inline-flex;align-items:center;justify-content:center;font-size:10px;">STAMP</div>'}
    </div>
  </div>
</body>
</html>
`;
}
