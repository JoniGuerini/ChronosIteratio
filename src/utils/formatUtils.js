import Decimal from 'break_eternity.js';

const STANDARD_SUFFIXES = ['', 'K', 'M', 'B', 'T'];

export const formatNumber = (val, options = { precision: 0, growthRate: null }) => {
    // Ensure we are working with a Decimal object
    const decimal = val instanceof Decimal ? val : new Decimal(val || 0);

    // Determine the sign and work with absolute value
    const absDecimal = decimal.abs();

    // Handle numbers smaller than 1,000,000 (No abbreviation, just commas)
    if (absDecimal.lt(1000000)) {
        // Floor to prevent rounding up (e.g. 3.9 should stay 3)
        if (absDecimal.lt(1000)) {
            return Math.floor(decimal.toNumber()).toLocaleString();
        }
        // Format with commas: 123,456
        return decimal.floor().toNumber().toLocaleString();
    }

    // Handle large numbers with suffixes (Starts at 1,000,000 = 10^6 = Index 2)
    // Index 0 = < 1000 (handled above)
    // Index 1 = K (10^3) -> K is actually index 1 in STANDARD_SUFFIXES
    // Wait, let's align indices:
    // log10 / 3:
    // 3..5 -> 1 -> K
    // 6..8 -> 2 -> M
    // 9..11 -> 3 -> B
    // 12..14 -> 4 -> T
    // 15..17 -> 5 -> AA

    const exponent = absDecimal.log10();
    const suffixIndex = Math.floor(exponent / 3);

    // Determine suffix
    let suffix = '';

    if (suffixIndex < STANDARD_SUFFIXES.length) {
        // Use standard K, M, B, T
        suffix = STANDARD_SUFFIXES[suffixIndex];
    } else {
        // Use Generalized Alphabet System starting from Quadrillions (10^15 = Index 5)
        // Index 5 -> AA
        // We want to map suffixIndices to a bijective base-26 system
        // "AA" corresponds to value 27 in standard bijective (A=1...Z=26, AA=27)
        // So offset needed is: (suffixIndex - 5) + 27

        // Calculate value for bijective system
        let n = (suffixIndex - 5) + 27;
        let suffixStr = "";

        // Standard Bijective Algorithm (1-based to A-Z)
        while (n > 0) {
            n--; // Adjust to 0-based for modulo
            suffixStr = String.fromCharCode(65 + (n % 26)) + suffixStr;
            n = Math.floor(n / 26);
        }

        // Cap at 5 letters (ZZZZZ) to prevent UI overflow
        if (suffixStr.length > 5) {
            // Fallback to scientific for numbers beyond ZZZZZ
            return decimal.toExponential(2).replace('+', '');
        }

        suffix = suffixStr;
    }

    const divisor = Decimal.pow(10, suffixIndex * 3);
    const mantissa = decimal.div(divisor);

    // Dynamic precision based on growth rate
    let precision = options.precision;
    let minPrecision = 0;

    // If growthRate is provided and we're showing abbreviated numbers
    if (options.growthRate && options.growthRate instanceof Decimal) {
        const growthMagnitude = options.growthRate.abs();
        const currentMagnitude = divisor;

        if (growthMagnitude.gte(currentMagnitude)) {
            precision = 0;
            minPrecision = 0;
        } else {
            precision = 3;
            minPrecision = 3;
        }
    }

    return mantissa.toNumber().toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }) + ' ' + suffix;
};

export const formatTime = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) {
        const m = Math.floor(seconds / 60);
        const s = Math.round(seconds % 60);
        return `${m}m ${s}s`;
    }
    if (seconds < 86400) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    }
    if (seconds < 604800) { // < 7 days
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        return `${d}d ${h}h`;
    }
    if (seconds < 2592000) { // < 30 days (1 month)
        const w = Math.floor(seconds / 604800);
        const d = Math.floor((seconds % 604800) / 86400);
        return `${w}w ${d}d`;
    }
    if (seconds < 31536000) { // < 365 days (1 year)
        const mo = Math.floor(seconds / 2592000);
        const d = Math.floor((seconds % 2592000) / 86400);
        return `${mo}mo ${d}d`;
    }

    if (seconds < 31536000000) { // < 1000 years (1 Millennium)
        const y = Math.floor(seconds / 31536000);
        const mo = Math.floor((seconds % 31536000) / 2592000);
        return `${y}y ${mo}mo`;
    }

    const Mil = Math.floor(seconds / 31536000000);
    const y = Math.floor((seconds % 31536000000) / 31536000);
    return `${Mil}Mil ${y}y`;
};
