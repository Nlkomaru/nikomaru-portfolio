import { baseLocale, urlPatterns } from "../paraglide/runtime";

// Ensure non-base locales are matched before the base locale.
for (const pattern of urlPatterns) {
    pattern.localized.sort(([a], [b]) => {
        if (a === baseLocale && b !== baseLocale) {
            return 1;
        }
        if (b === baseLocale && a !== baseLocale) {
            return -1;
        }
        return 0;
    });
}
