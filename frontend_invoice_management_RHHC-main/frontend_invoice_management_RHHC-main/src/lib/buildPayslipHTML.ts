import { formatINR } from '@/modules/common/helpers/helper';
import { buildCompanyHeaderHTML, companyHeaderCss } from '@/lib/companyHeaderHTML';

export type PayslipHTMLPayload = {
  company: {
    name: string;
    logoUrl?: string | null;
    addressLines?: string | null;
    phone?: string;
    mobile?: string;
    email?: string;
    extraIds?: Record<string, string | number | undefined> | null;
    stampUrl?: string | null;
  };
  meta: {
    title?: string; // "STAFF PAYSLIP"
    staffName: string;
    periodFrom: string; // dd.mm.yyyy
    periodTo: string; // dd.mm.yyyy
    payslipNo?: string | number;
    generatedOn?: string;
  };
  summary: {
    totalHours: number;
    hourlyRate: number;
    grossTotal: number;
    deduction: number;
    netTotal: number;
    currency?: string; // default ₹
  };
};

const css = `
  @page { 
    size: A4; 
    margin: 8mm 6mm 10mm 6mm; 
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 13px; color: #000; line-height: 1.3; }
  .sheet { width: 100%; max-width: 210mm; margin: 0 auto; }
  ${companyHeaderCss}
  .title { border: 2px solid #000; border-top: none; text-align: center; padding: 8px; font-weight: bold; font-size: 14px; letter-spacing: 1px; }
  .meta { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 10px; }
  .meta .box { border: 2px solid #000; padding: 8px; min-height: 48px; }
  .label { font-weight: bold; }
  .table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 10px; }
  .table th, .table td { border: 1px solid #000; padding: 4px 6px; vertical-align: middle; }
  .table th { background: #f0f0f0; text-align: center; }
  .table td.nowrap { white-space: nowrap; }
  .group-title { margin-top: 12px; font-weight: bold; }
  .summary { border: 2px solid #000; padding: 8px; margin-top: 12px; font-size: 14px; }
  .summary-row { display: flex; justify-content: space-between; margin: 4px 0; }
  .summary-row.total { border-top: 1px solid #000; padding-top: 6px; font-weight: bold; }
  .no-data { font-size: 10px; font-style: italic; margin-top: 6px; }
  .stamp-box { text-align: right; margin-top: 40px; }
  .stamp { width: 130px; height: 130px; object-fit: contain; opacity: 0.85; }`;

export function buildPayslipHTML(data: PayslipHTMLPayload) {
  return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${data.meta.title ?? 'Staff Payslip'}</title>
  <style>${css}</style>
  </head>
  <body>
    <div class="sheet">
      ${buildCompanyHeaderHTML(data.company)}

      <div class="title">${data.meta.title ?? 'STAFF PAYSLIP'}</div>

      <div class="meta">
        <div class="box">
          <div class="label">STAFF:</div>
          <div>${data.meta.staffName}</div>
        </div>
        <div class="box">
          <div class="label">PERIOD:</div>
          <div>${data.meta.periodFrom} → ${data.meta.periodTo}</div>
        </div>
        <div class="box">
          ${data.meta.payslipNo ? `<div class="label">PAYSLIP NO: </div><div>${data.meta.payslipNo}</div>` : ''}
         
        </div>
      </div>

      <div class="summary">
        <div class="summary-row">
          <span>Total Hours</span>
          <span>${Number(data.summary.totalHours || 0).toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Staff Hourly Rate</span>
          <span>${formatINR(data.summary.hourlyRate, false)}</span>
        </div>
        <div class="summary-row">
          <span>Gross Total</span>
          <span>${formatINR(data.summary.grossTotal, false)}</span>
        </div>
        <div class="summary-row">
          <span>Quick Pays Deduction</span>
          <span>- ${formatINR(data.summary.deduction, false)}</span>
        </div>
        <div class="summary-row total">
          <span>Net Total</span>
          <span>${formatINR(data.summary.netTotal, true)}</span>
        </div>
      </div>
      <div class="stamp-box">
      ${data.company.stampUrl ? `<img class="stamp" src="${data.company.stampUrl}" />` : '<div style="width:100px;height:100px;border:1px dashed #aaa;display:inline-flex;align-items:center;justify-content:center;font-size:10px;">STAMP</div>'}
    </div>
    </div>
  </body>
</html>
`;
}
