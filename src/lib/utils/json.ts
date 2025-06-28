export function safeJsonParse(value: string | null | undefined, fallback: any = null) {
  if (!value) return fallback;
  
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function formatJsonArray(value: string | null | undefined): string {
  const parsed = safeJsonParse(value, []);
  return Array.isArray(parsed) ? parsed.join(', ') : value || '';
}
