import type { Metadata } from "next";
import "./globals.css";
import { css } from "@/styled-system/css";
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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            {/*og*/}

            <body className={`${css({ textStyle: "body" })} ${fonts}`}>
                {children}
            </body>
        </html>
    );
}
