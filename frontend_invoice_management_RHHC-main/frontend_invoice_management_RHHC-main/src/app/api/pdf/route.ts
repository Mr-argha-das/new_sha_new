// /app/api/pdf/route.ts
import { NextRequest } from 'next/server';
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";

export const runtime = 'nodejs';

type Payload = {
  htmlContent: string;
  fileName: string;
};

/** Use serverless Chromium only in Vercel/Lambda; on Windows local dev use Puppeteer's bundled Chromium. */
const isServerless =
  process.env.VERCEL === '1' || typeof process.env.AWS_LAMBDA_FUNCTION_NAME === 'string';

export async function POST(req: NextRequest) {
  const payload: Payload = await req.json();

  const launchOptions: Parameters<typeof puppeteer.launch>[0] = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };

  if (isServerless) {
    launchOptions.args = chromium.args;
    launchOptions.executablePath = await chromium.executablePath();
  }
  // Else: use Puppeteer's bundled Chromium (default executablePath)

  const browser = await puppeteer.launch(launchOptions);


  const page = await browser.newPage();

  // const html = buildInvoiceHTML(payload);
  const html = payload.htmlContent;
  await page.setContent(html, { waitUntil: 'networkidle0' });
  // await page.evaluateHandle('document.fonts?.ready?.then(()=>true)');

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', right: '8mm', bottom: '12mm', left: '8mm' },
  });

  await browser.close();
  return new Response(Buffer.from(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${payload.fileName}`,
    },
  });
}
