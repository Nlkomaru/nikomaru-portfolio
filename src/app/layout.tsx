import type { Metadata } from "next";
import "./globals.css";
import { css } from "@/styled-system/css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
import { fonts } from "./fonts";

export const metadata: Metadata = {
    title: "にこまるのポートフォリオ",
    description: "にこまるのポートフォリオです。",
    openGraph: {
        title: "にこまるのポートフォリオ",
        description: "にこまるのポートフォリオです。",
        type: "website",
        locale: "ja_JP",
        images: ["https://nikomaru.dev/ogp.png"],
    },
};

export const experimental_ppr = true;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja" suppressHydrationWarning>
            {/*og*/}

            <body className={`${css({ textStyle: "body" })} ${fonts}`}>
                <ThemeProvider
                    defaultTheme={"light"}
                    enableSystem={false}
                    value={{
                        light: "light",
                        dark: "dark",
                    }}
                >
                    {children}
                    <SpeedInsights />
                </ThemeProvider>
            </body>
        </html>
    );
}
