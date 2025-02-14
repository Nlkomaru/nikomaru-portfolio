"use client";

import type dayjs from "dayjs";
import * as motion from "motion/react-client";

export const Career = () => {
    const careers: careers[] = [];

    return (
        <motion.ul>
            {careers.map((cert, index) => (
                <motion.li
                    key={cert.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        delay: 0.4 * (index + 1) + 1,
                    }}
                >
                    {`${cert.startedAt.format("YYYY-MM")} ${cert.name}`}
                </motion.li>
            ))}
        </motion.ul>
    );
};

type careers = {
    startedAt: dayjs.Dayjs;
    endedAt: dayjs.Dayjs | null;
    id: string;
    name: string;
};
