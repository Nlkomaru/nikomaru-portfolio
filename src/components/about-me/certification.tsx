"use client";

import dayjs from "dayjs";
import * as motion from "motion/react-client";

export const Certification = () => {
    const cert: certification[] = [
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

    return (
        <motion.ul>
            {cert
                .filter((it) =>
                    it.expiresAt ? it.expiresAt?.isAfter(dayjs()) : true,
                )
                .map((cert, index) => (
                    <motion.li
                        key={cert.id}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            delay: 0.4 * (index + 1),
                        }}
                    >
                        {`${cert.issuedAt.format("YYYY-MM")} ${cert.name}`}
                    </motion.li>
                ))}
        </motion.ul>
    );
};

type certification = {
    issuedAt: dayjs.Dayjs;
    expiresAt: dayjs.Dayjs | null;
    id: string;
    name: string;
};
