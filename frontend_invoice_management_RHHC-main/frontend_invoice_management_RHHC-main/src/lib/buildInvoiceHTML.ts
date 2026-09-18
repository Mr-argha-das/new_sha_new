import { formatINR } from '@/modules/common/helpers/helper';
import { buildCompanyHeaderHTML, companyHeaderCss } from '@/lib/companyHeaderHTML';

export type LineItem = {
  id?: string | number;
  description: string;
  hoursPerDay?: number;
  rate: number;
  days: number;
  quantity?: number;
  amount?: number;
};

export type InvoicePayload = {
  company: {
    name: string;
    logoUrl?: string | null;
    addressLines: string | null;
    phone?: string;
    mobile?: string;
    email?: string;
    website?: string;
    extraIds?: Record<string, string | number | undefined> | null;
    isoCertificateUrl?: string | null;
  };
  meta: {
    title?: string;
    invoiceNo: string;
    invoiceDate: string;
    period: { from: string };
    serviceType?: string;
    originalOrDuplicate?: 'ORIGINAL' | 'DUPLICATE' | '';
  };
  client: {
    name: string;
    addressLines?: string[];
    age?: string;
    gender?: string;
    cityState?: string;
    mobile?: string;
    email?: string;
  };
  groups: {
    services?: LineItem[];
    equipmentsOnRent?: LineItem[];
    equipmentSold?: LineItem[];
    transportation?: number;
    otherCharges?: number;
    last_invoice_due?: number;
    discount_amount?: number;
    security_deposit?: number;
    is_deposit_counted?: number;
  };
  bank: {
    beneficiary: string;
    bank: string;
    accountNo: string;
    ifsc: string;
    paymentTerms?: string;
  };
  qrCodeDataUrl?: string | null;
  stampUrl?: string | null;
  currency?: string;
};

const css = `
  @page { size: A4; margin: 8mm 6mm 10mm; }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: Arial, sans-serif;
    font-size: 13px;
    color: #000;
  }

  .sheet { width: 100%; max-width: 210mm; margin: auto; }

  ${companyHeaderCss}

  /* Title */
  .title {
    border: 2px solid #000;
    border-top: none;
    text-align: center;
    padding: 8px;
    font-size: 14px;
    font-weight: bold;
  }

  /* Details */
  .details { display: flex; margin-top: 8px; }

  .client {
    flex: 1;
    border: 2px solid #000;
    padding: 8px;
    display: flex;
    gap: 12px;
  }

  .client-part { flex: 1; font-size: 12px; }

  .invoice {
    flex: 1;
    border: 2px solid #000;
    border-left: none;
    padding: 8px;
    font-size: 12px;
  }

  .invoice div { line-height: 1.3; }
  .label { font-weight: bold; }

  /* Table */
  .table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    font-size: 13px;
  }

  .table th, .table td {
    border: 1px solid #000;
    padding: 4px 6px;
  }

  .table th { background: #eee; text-align: center; }

  .group { font-weight: bold; }
  .subtotal { font-weight: bold; }

  /* Footer */
  .footer {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-top: 8px;
  }

    .footer-box {
    border: 2px solid #000;
    padding: 6px;
    min-height: 120px;
    max-height: 200px !important;
  }

  .bank-detail{
    font-size: 12px;
    line-height: 1.4;
    }

    .footer-title {
      font-size: 11px;
      font-weight: bold;
      margin-bottom: 4px;
      text-align: center;
    }

    .footer-subtext {
      font-size: 10px;
      font-weight: bold;
      margin-top: 4px;
      text-align: center;
    }

    .qr-img,
    .stamp-img {
      width: 100%;
      height: 80%;
      object-fit: contain;
    }
    /* Utilities */
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .bold { font-weight: bold; }
    .mt4 { margin-top: 4px; }
    .mt8 { margin-top: 8px; }
    .flex-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
`;

const num = (v: unknown) => Number(v) || 0;

function sum(items?: LineItem[]) {
  return (items ?? []).reduce(
    (acc, it) =>
      acc +
      num(
        it.amount ??
          it.rate *
            it.days *
            (it.quantity ?? 1) *
            (num(it.hoursPerDay) || 1),
      ),
    0,
  );
}

function buildRows(
  items: LineItem[] | undefined,
  type: 'service' | 'equipment',
) {
  if (!items?.length) return '';

  return items
    .map((it, idx) => {
      const hours = num(it.hoursPerDay) || 0;
      const amount = it.amount ?? it.rate * it.days * (it.quantity ?? 1) * (hours || 1);
      return `
        <tr>
          <td class="text-center">${it.id ?? idx + 1}</td>
          <td>${it.description}</td>
          <td class="text-center">${type === 'service' ? (hours || '') : (hours || '')}</td>
          <td class="text-right">${it.rate}</td>
          <td class="text-center">${it.quantity ?? 1}</td>
          <td class="text-center">${it.days}</td>
          <td class="text-right">${formatINR(amount, false)}</td>
        </tr>
      `;
    })
    .join('');
}

export function buildInvoiceHTML(data: InvoicePayload) {
  const servicesTotal = sum(data.groups.services);
  const rentTotal = sum(data.groups.equipmentsOnRent);
  const soldTotal = sum(data.groups.equipmentSold);
  const itemsSubTotal = servicesTotal + rentTotal + soldTotal;

  const transportation = num(data.groups.transportation);
  const otherCharges = num(data.groups.otherCharges);
  const lastDue = num(data.groups.last_invoice_due);
  const discount = num(data.groups.discount_amount);
  const deposit = num(data.groups.security_deposit);
  const depositCounted = num(data.groups.is_deposit_counted);

  const grand =
    servicesTotal +
    rentTotal +
    soldTotal +
    transportation +
    otherCharges +
    lastDue -
    discount -
    (depositCounted ? deposit : 0);

  const serviceRows = buildRows(data.groups.services, 'service');
  const rentRows = buildRows(data.groups.equipmentsOnRent, 'equipment');
  const sellRows = buildRows(data.groups.equipmentSold, 'equipment');
  const hasServices = !!data.groups.services?.length;
  const hasRent = !!data.groups.equipmentsOnRent?.length;
  const hasSold = !!data.groups.equipmentSold?.length;

  const originalChecked = data.meta.originalOrDuplicate === 'ORIGINAL'
    ? '✓'
    : '';
  const duplicateChecked = data.meta.originalOrDuplicate === 'DUPLICATE'
    ? '✓'
    : '';

  return `
  <!doctype html>
  <html>
  <head>
  <meta charset="utf-8" />
  <title>Invoice</title>
  <style>${css}</style>
  </head>
  <body>
  <div class="sheet">

  ${buildCompanyHeaderHTML(data.company)}

  <div class="title">${data.meta.title ?? 'SERVICE INVOICE'}</div>

  <div class="details">
    <div class="client">
      <div class="client-part">
        <div class="bold">${data.client.name}</div>
        ${(data.client.addressLines ?? []).map(l => `<div>${l}</div>`).join('')}
      </div>
      <div class="client-part">
        ${data.client.age ? `<div> <span class="bold">Age</span>: ${data.client.age}</div>` : ''}
        ${data.client.gender ? `<div> <span class="bold">Gender</span>: ${data.client.gender}</div>` : ''}
      </div>
    </div>

    <div class="invoice">
      <div><span class="label">Invoice No:</span> ${data.meta.invoiceNo}</div>
      <div><span class="label">Date:</span> ${data.meta.invoiceDate}</div>
      <div><span class="label">Period:</span> ${data.meta.period.from}</div>
      <div><span class="label">Service:</span> ${data.meta.serviceType ?? 'NURSING'}</div>
      <div class="mt4">Original: ${originalChecked}</div>
      <div>Duplicate: ${duplicateChecked}</div>
    </div>
  </div>

  <table class="table">
  <thead>
  <tr>
  <th>S.N</th>
  <th>Description</th>
  <th>Hours/Day</th>
  <th>Rate</th>
  <th>Qty</th>
  <th>Days</th>
  <th>AMOUNT (₹)</th>
  </tr>
  </thead>
  <tbody>

  ${hasServices
        ? `
  <tr><td colspan="7" class="group">(A) SERVICES</td></tr>
  ${serviceRows}
  <tr class="subtotal"><td colspan="6" class="text-right">Total</td><td class="text-right">${formatINR(servicesTotal, false)}</td></tr>
  `
        : ''}

  ${hasRent
        ? `
  <tr><td colspan="7" class="group">(B) EQUIPMENTS ON RENT</td></tr>
  ${rentRows}
  <tr class="subtotal"><td colspan="6" class="text-right">Total</td><td class="text-right">${formatINR(rentTotal, false)}</td></tr>

  `
        : ''}

  ${hasSold
        ? `
  <tr><td colspan="7" class="group">(C) EQUIPMENTS SOLD</td></tr>
  ${sellRows}
  <tr class="subtotal"><td colspan="6" class="text-right">Total</td><td class="text-right">${formatINR(soldTotal, false)}</td></tr>
  `
        : ''}

  <tr class="subtotal">
    <td colspan="6" class="text-right">Sub Total</td>
    <td class="text-right">${formatINR(itemsSubTotal, false)}</td>
  </tr>

  <tr><td colspan="6" class="text-right">Transportation</td><td class="text-right">${formatINR(transportation, false)}</td></tr>
  <tr><td colspan="6" class="text-right">Other Charges</td><td class="text-right">${formatINR(otherCharges, false)}</td></tr>
  <tr><td colspan="6" class="text-right">Last Due</td><td class="text-right">${formatINR(lastDue, false)}</td></tr>

  ${discount > 0
        ? `<tr><td colspan="6" class="text-right">Discount</td><td class="text-right">${formatINR(discount, false)}</td></tr>`
        : ''
      }

  ${depositCounted
        ? `<tr><td colspan="6" class="text-right">Security Deposit</td><td class="text-right">- ${formatINR(deposit, false)}</td></tr>`
        : ''
      }

  <tr class="subtotal">
  <td colspan="6" class="text-right bold">Net Payable</td>
  <td class="text-right bold">${formatINR(grand, false)}</td>
  </tr>


  </tbody>
  </table>

  <div class="footer">
    <div class="footer-box bank-detail">
      <div class="bold">Bank Details:</div>
      <div>${data.bank.beneficiary}</div>
      <div>${data.bank.bank}</div>
      <div>A/C: ${data.bank.accountNo}</div>
      <div>IFSC: ${data.bank.ifsc}</div>
    </div>

    <div class="footer-box flex-center">
          <div class="footer-title">Scan and pay here</div>
          <img
            class="qr-img"
            src="${data.qrCodeDataUrl}"
          />
          <div class="footer-subtext">For, ${data.company.name}</div>
        </div>
        <div class="footer-box text-center flex-center">
          <img
            class="stamp-img"
            src="${data.company.isoCertificateUrl}"
          />
          <div class="footer-title mt8">ISO Certificate</div>
        </div>
        <div class="footer-box text-center flex-center">
          <img
            class="stamp-img"
            src="${data.stampUrl}"
          />
          <div class="footer-title mt8">Stamp</div>
        </div>
  </div>

  </div>
  </body>
  </html>
`;
}