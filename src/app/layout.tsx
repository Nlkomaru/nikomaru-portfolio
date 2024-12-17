import type { Metadata } from "next";
import "./globals.css";
import { css } from "@/styled-system/css";
import { poppins, zenKakuGothicNew } from "~/app/fonts";

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
            <body
                className={`${css({ textStyle: "body" })} ${zenKakuGothicNew.variable} ${poppins.variable}`}
            >
                {children}
            </body>
        </html>
    );
}
