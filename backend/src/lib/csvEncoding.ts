const UTF8_BOM = '\uFEFF';

function encodeCsvField(value: string | number | null | undefined): string {
  const text = value === null || value === undefined ? '' : String(value);
  const needsQuotes = /[",\r\n]/.test(text);
  const escaped = text.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

export function encodeCsvRow(values: string[]): string {
  return `${values.map(encodeCsvField).join(',')}\r\n`;
}

export function encodeCsvDocument(header: string[], rows: string[][]): string {
  const lines = [encodeCsvRow(header), ...rows.map(encodeCsvRow)];
  return `${UTF8_BOM}${lines.join('')}`;
}
