"use client";
import { css } from "@/styled-system/css";
import type React from "react";
import { useEffect, useState } from "react";
import WorksCard from "~/components/works/works-card";

const emblaSlide = css({
    flex: "0 0 var(--slide-size)",
    minWidth: "0",
    paddingLeft: "var(--slide-spacing)",
});

const emblaContainer = css({
    display: "flex",
    touchAction: "pan-y pinch-zoom",
    marginLeft: "calc(var(--slide-spacing) * -1)",
});

const WorksList: React.FC = () => {
    const [data, setData] = useState<Works[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/products");
            const result = await response.json<Works[]>();
            setData(result);
        };

        fetchData();
    }, []);

    return (
        <div className={emblaContainer}>
            {data.map((works) => (
                <div className={emblaSlide} key={works.id}>
                    <WorksCard works={works} />
                </div>
            ))}
        </div>
    );
};

export default WorksList;
