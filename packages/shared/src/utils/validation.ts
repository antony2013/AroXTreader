export function isValidPrice(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

export function isValidQuantity(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

export function isValidSymbol(symbol: string): boolean {
  return /^[A-Z0-9_-]+$/.test(symbol);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function assertNever(value: never, message: string): never {
  throw new Error(`${message}: ${JSON.stringify(value)}`);
}
