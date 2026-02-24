declare module "*paraglide/runtime" {
    export type Locale = "en" | "ja";

    export function getLocale(): Locale;
    export function setLocale(locale: Locale, options?: { reload?: boolean }): void | Promise<void>;

    export function isLocale(value: unknown): value is Locale;
    export function extractLocaleFromUrl(url: string | URL): Locale | undefined;

    export function localizeUrl(url: string | URL, options?: { locale?: Locale }): URL;
    export function deLocalizeUrl(url: string | URL): URL;

    export function localizeHref(href: string, options?: { locale?: Locale }): string;
    export function deLocalizeHref(href: string): string;
}

declare module "*paraglide/messages" {
    export const m: Record<string, () => string>;
}

declare module "*paraglide/server" {
    export function paraglideMiddleware<TResponse>(
        request: Request,
        resolve: () => TResponse | Promise<TResponse>,
    ): Promise<TResponse>;
}
