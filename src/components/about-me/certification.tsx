"use client";

import { css } from "@/styled-system/css";
import dayjs from "dayjs";
import { useInView } from "motion/react";
import * as motion from "motion/react-client";
import { useRef } from "react";
import CareerCard, {
    type certification,
} from "~/components/about-me/certification-card";

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

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.ul ref={ref}>
            {cert
                .filter((it) =>
                    it.expiresAt ? it.expiresAt?.isAfter(dayjs()) : true,
                )
                .map((cert, index) => (
                    <motion.li
                        key={cert.id}
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{
                            delay: 0.4 * (index + 1),
                        }}
                        className={css({
                            paddingBottom: "8px",
                        })}
                    >
                        <CareerCard certification={cert} />
                    </motion.li>
                ))}
        </motion.ul>
    );
};
