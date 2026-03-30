export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isPhone(value: string) {
  return /^[\d\s()+-]{7,20}$/.test(value.trim());
}

export function minLength(value: string, length: number) {
  return value.trim().length >= length;
}

export function required(value: string | number | null | undefined) {
  return String(value ?? '').trim().length > 0;
}
