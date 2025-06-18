// Kenyan Shilling (KSH) currency utilities

export const CURRENCY = {
  CODE: "KSH",
  SYMBOL: "KSh",
  NAME: "Kenyan Shilling",
  DECIMAL_PLACES: 2,
  THOUSAND_SEPARATOR: ",",
  DECIMAL_SEPARATOR: "."
} as const;

/**
 * Format amount in Kenyan Shillings
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatKSH(
  amount: number,
  options: {
    showSymbol?: boolean;
    showCode?: boolean;
    decimals?: number;
  } = {}
): string {
  const {
    showSymbol = true,
    showCode = false,
    decimals = CURRENCY.DECIMAL_PLACES
  } = options;

  // Format the number with thousand separators
  const formattedAmount = new Intl.NumberFormat('en-KE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  let result = formattedAmount;

  if (showSymbol) {
    result = `${CURRENCY.SYMBOL} ${result}`;
  }

  if (showCode) {
    result = `${result} ${CURRENCY.CODE}`;
  }

  return result;
}

/**
 * Parse KSH string to number
 * @param kshString - String representation of KSH amount
 * @returns Parsed number or null if invalid
 */
export function parseKSH(kshString: string): number | null {
  if (!kshString || typeof kshString !== 'string') {
    return null;
  }

  // Remove currency symbols and codes
  let cleanString = kshString
    .replace(/KSh\s?/gi, '')
    .replace(/KSH\s?/gi, '')
    .replace(/,/g, '')
    .trim();

  const parsed = parseFloat(cleanString);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Convert amount to words (for invoices, receipts)
 * @param amount - Amount in KSH
 * @returns Amount in words
 */
export function amountToWords(amount: number): string {
  if (amount === 0) return "Zero Shillings";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const scales = ["", "Thousand", "Million", "Billion"];

  function convertHundreds(num: number): string {
    let result = "";

    if (num >= 100) {
      result += ones[Math.floor(num / 100)] + " Hundred ";
      num %= 100;
    }

    if (num >= 20) {
      result += tens[Math.floor(num / 10)] + " ";
      num %= 10;
    }

    if (num > 0) {
      result += ones[num] + " ";
    }

    return result.trim();
  }

  function convertNumber(num: number): string {
    if (num === 0) return "";

    let result = "";
    let scaleIndex = 0;

    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) {
        const chunkWords = convertHundreds(chunk);
        result = chunkWords + (scales[scaleIndex] ? " " + scales[scaleIndex] : "") + " " + result;
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return result.trim();
  }

  const shillings = Math.floor(amount);
  const cents = Math.round((amount - shillings) * 100);

  let result = convertNumber(shillings) + " Shilling" + (shillings !== 1 ? "s" : "");

  if (cents > 0) {
    result += " and " + convertNumber(cents) + " Cent" + (cents !== 1 ? "s" : "");
  }

  return result;
}

/**
 * Common KSH amounts for reference
 */
export const COMMON_AMOUNTS = {
  ANNUAL_SUBSCRIPTION_BASIC: 35000, // KSh 35,000
  ANNUAL_SUBSCRIPTION_PREMIUM: 120000, // KSh 120,000
  ANNUAL_SUBSCRIPTION_ENTERPRISE: 360000, // KSh 360,000
  MONTHLY_SUBSCRIPTION_BASIC: 3000, // KSh 3,000
  MONTHLY_SUBSCRIPTION_PREMIUM: 10000, // KSh 10,000
  MONTHLY_SUBSCRIPTION_ENTERPRISE: 30000, // KSh 30,000
  FAMILY_PACKAGE_MONTHLY: 5000, // KSh 5,000
  FAMILY_PACKAGE_ANNUAL: 50000, // KSh 50,000
} as const;

export type CurrencyCode = typeof CURRENCY.CODE;
export type CurrencySymbol = typeof CURRENCY.SYMBOL;