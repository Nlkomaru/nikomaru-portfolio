"use client";
import { css } from "@/styled-system/css";
import { flex } from "@/styled-system/patterns";
import dayjs from "dayjs";
import { useInView } from "motion/react";
import * as motion from "motion/react-client";
import { useRef } from "react";

// キャリア情報の型を定義するのだ
type Career = {
    startedAt: dayjs.Dayjs;
    endedAt: dayjs.Dayjs | null;
    id: string;
    name: string;
};

// キャリア情報の配列を定義するのだ
const careers: Career[] = [
    {
        startedAt: dayjs("2019-04-01"),
        endedAt: dayjs("2023-03-31"),
        id: "1",
        name: "愛知県立愛知総合工科高等学校",
    },
    {
        startedAt: dayjs("2023-04-01"),
        endedAt: dayjs("2027-03-31"),
        id: "2",
        name: "信州大学 工学部 電子情報システム工学科",
    },
    {
        startedAt: dayjs("2021-12-31"),
        endedAt: null,
        id: "3",
        name: "もりのパーティ デベロッパー",
    },
];

// 開始日でソートする関数を定義するのだ
const sortCareersByStartDate = (careers: Career[]): Career[] => {
    return careers.sort((a, b) => (a.startedAt.isBefore(b.startedAt) ? -1 : 1)); // 開始日が早い方を前にするのだ
};

export const Career = () => {
    const sortedCareers = sortCareersByStartDate(careers);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            className={css({
                paddingTop: "8px",
            })}
            ref={ref}
        >
            {sortedCareers.map((cert, index) => (
                <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                        delay: 0.4 * (index + 1) + 1,
                    }}
                    className={flex({
                        gap: "2",
                        alignItems: "flex-start",
                        position: "relative",
                        pb: "4",
                    })}
                >
                    <div
                        className={css({
                            flex: "1",
                        })}
                    >
                        <div
                            className={css({
                                fontSize: "sm",
                                color: "gray.600",
                                mb: "1",
                            })}
                        >
                            {`${cert.startedAt.format("YYYY年MM月")} ~ ${cert.endedAt?.isBefore(dayjs()) ? cert.endedAt.format("YYYY年MM月") : "現在"}`}
                        </div>
                        <div
                            className={css({
                                fontSize: "xl",
                                fontWeight: "500",
                                color: "gray.900",
                            })}
                        >
                            {cert.name}
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};
