import { css } from "@/styled-system/css";
import type dayjs from "dayjs";

export default function CareerCard({
    certification,
}: { certification: certification }) {
    return (
        <div
            className={css({
                display: "flex",
                maxWidth: "800px",
                margin: "0 auto",
                height: "64px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
                borderRadius: "xl",
                background: "var(--colors-color-palette-8)/60",
            })}
        >
            <div
                className={css({
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "32px",
                })}
            >
                <div>{certification.issuedAt.format("YYYY-MM")}</div>
                <div>{certification.name}</div>
            </div>
        </div>
    );
}

export type certification = {
    issuedAt: dayjs.Dayjs;
    expiresAt: dayjs.Dayjs | null;
    id: string;
    name: string;
};
