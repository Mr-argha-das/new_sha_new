export type CompanyHeaderData = {
  name: string;
  logoUrl?: string | null;
  addressLines?: string | null;
  phone?: string;
  mobile?: string;
  email?: string;
  website?: string;
  extraIds?: Record<string, string | number | undefined> | null;
};

export const companyHeaderCss = `
  .header {
    border: 2px solid #000;
    display: flex;
    justify-content: space-between;
    padding: 8px;
    gap: 12px;
  }
  .logo { width: 150px; height: 80px; object-fit: contain; }
  .company-info { font-size: 11px; line-height: 1.3; }
  .company-name { font-weight: bold; font-size: 12px; }
`;

export function buildCompanyHeaderHTML(company: CompanyHeaderData): string {
  const name = company.name ?? '';
  return `
  <div class="header">
    <div>
      ${company.logoUrl ? `<img class="logo" src="${company.logoUrl}" />` : ''}
    </div>
    <div class="company-info">
      <div class="company-name">${name}</div>
      ${company.addressLines
      ? `<div>${company.addressLines
        .split(',')
        .map((segment, i, arr) => {
          if ((i + 1) % 3 === 0 || i === arr.length - 1)
            return segment.trim() + '<br>';
          return segment.trim() + ', ';
        })
        .join('')}</div>`
      : ''
    }
      ${company.phone ? `<div>Phone: ${company.phone}</div>` : ''}
      ${company.mobile ? `<div>Mobile: ${company.mobile}</div>` : ''}
      ${company.email ? `<div>E-mail: ${company.email}</div>` : ''}
      ${Object.entries(company.extraIds ?? {}).length
      ? Object.entries(company.extraIds ?? {})
        .reduce<string[][]>((rows, [k, v], i) => {
          if (i % 3 === 0) rows.push([]);
          (rows[rows.length - 1] as string[])?.push(`${k}: ${v}`);
          return rows;
        }, [])
        .map((row: string[]) => `<div>${row.join(' | ')}</div>`)
        .join('')
      : ''
    }
    </div>
  </div>`;
}
