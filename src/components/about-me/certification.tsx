"use client";

import { css } from "@/styled-system/css";
import dayjs from "dayjs";
import * as motion from "motion/react-client";
import { flex } from "../../../styled-system/patterns";

// 資格情報の型を定義するのだ
type Certification = {
    issuedAt: dayjs.Dayjs;
    expiresAt: dayjs.Dayjs | null;
    id: string;
    name: string;
};

// 資格情報の配列を定義するのだ
const certifications: Certification[] = [
    {
        issuedAt: dayjs("2019-07-01"),
        expiresAt: null,
        id: "test-of-world-heritage-study-3rd-grade",
        name: "世界遺産検定 3級",
    },
    {
        issuedAt: dayjs("2022-06-27"),
        expiresAt: null,
        id: "fundamental-information-technology-engineer-examination",
        name: "基本情報技術者試験",
    },
    {
        issuedAt: dayjs("2023-06-29"),
        expiresAt: null,
        id: "applied-information-technology-engineer-examination",
        name: "応用情報技術者試験",
    },
];

// 取得日でソートする関数を定義するのだ
const sortCertificationsByDate = (
    certifications: Certification[],
): Certification[] => {
    return certifications.sort((a, b) =>
        a.issuedAt.isBefore(b.issuedAt) ? -1 : 1,
    ); // 取得日が早い方を前にするのだ
};

export const Certification = () => {
    const sortedCertifications = sortCertificationsByDate(certifications);

    return (
        <motion.div
            className={css({
                paddingTop: "8px",
            })}
        >
            {sortedCertifications.map((cert, index) => (
                <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
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
                            {cert.issuedAt.format("YYYY年MM月")}
                        </div>
                        <div
                            className={css({
                                fontSize: "xl",
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
