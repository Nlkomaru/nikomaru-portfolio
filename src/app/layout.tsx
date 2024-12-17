import type { Metadata } from "next";
import "./globals.css";
import { css } from "@/styled-system/css";
import { fonts } from "./fonts";

export const metadata: Metadata = {
    title: "にこまるのポートフォリオ",
    description: "にこまるのポートフォリオです。",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body className={`${css({ textStyle: "body" })} ${fonts}`}>
                {children}
            </body>
        </html>
    );
}
