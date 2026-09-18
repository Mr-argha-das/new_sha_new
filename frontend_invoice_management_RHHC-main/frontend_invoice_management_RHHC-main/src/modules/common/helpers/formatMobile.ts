export function formatMobile(number: string) {
  if (!number) return null;
  let mobile = String(number).replace(/\D/g, '');

  if (mobile.startsWith('91') && mobile.length > 10) {
    mobile = mobile.slice(2);
  }

  if (mobile.length === 10) {
    return `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`;
  } else {
    const mid = Math.ceil(mobile.length / 2);
    return `+91 ${mobile.slice(0, mid)} ${mobile.slice(mid)}`;
  }
}
