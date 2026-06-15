import type { Locale } from "../../../../../paraglide/runtime";

function parseAboutDate(value: string): { date: Date; hasDay: boolean } {
    const [year, month, day] = value.split("-").map(Number);

    if (!year || !month || month < 1 || month > 12 || (day !== undefined && (day < 1 || day > 31))) {
        throw new Error(`Invalid date value: ${value}`);
    }

    return {
        date: new Date(Date.UTC(year, month - 1, day ?? 1)),
        hasDay: day !== undefined,
    };
}

export function formatAboutDate(value: string, locale: Locale): string {
    const { date, hasDay } = parseAboutDate(value);

    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: hasDay ? "numeric" : undefined,
        timeZone: "UTC",
    }).format(date);
}

export function formatAboutPeriod(
    startDate: string,
    endDate: string | null,
    locale: Locale,
    presentLabel: string,
): string {
    const start = formatAboutDate(startDate, locale);

    if (endDate === startDate) {
        return start;
    }

    return `${start} — ${endDate ? formatAboutDate(endDate, locale) : presentLabel}`;
}
