import { css } from "@/styled-system/css";
import WorksCard from "~/components/works/card/works-card";
import { getWorks } from "~/lib/works";

export default async function Works() {
    const works = await getWorks();
    return (
        <>
            <h1
                className={css({
                    fontSize: "xl",
                    margin: "32px 0px",
                })}
            >
                今までに関わったプロジェクト
            </h1>
            <div
                className={css({
                    display: "grid",
                    gridTemplateColumns: {
                        base: "1fr",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                    },
                    gap: "1rem",
                })}
            >
                {works.map((work) => (
                    <WorksCard key={work.id} works={work} />
                ))}
            </div>
        </>
    );
}
