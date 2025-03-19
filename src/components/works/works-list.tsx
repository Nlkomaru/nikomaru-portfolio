"use client";

import { css } from "@/styled-system/css";
import type React from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import FakeWorksList from "~/components/works/fake-works-list";
import WorksCard from "~/components/works/works-card";
import type { Works } from "~/lib/type";
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

const fetcher = async (url: string): Promise<Works[]> =>
    fetch(url).then((res) => res.json());

const WorksList: React.FC = () => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const { data } = useSWR<Works[]>(
        isClient ? "/api/products" : null,
        fetcher,
        {
            suspense: true,
        },
    );

    if (!data) {
        return <FakeWorksList />;
    }

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
