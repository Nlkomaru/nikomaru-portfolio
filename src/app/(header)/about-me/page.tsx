import { css } from "@/styled-system/css";
import { styled } from "@/styled-system/jsx";
import { Certification } from "~/components/about-me/certification";
import { loremJapanese } from "~/lib/util";

export default function Home() {
    return (
        <div
            className={css({
                maxWidth: "1024px",
                margin: "auto",
            })}
        >
            <Heading2>Skills</Heading2>
            {loremJapanese(200)}

            <Heading2>Career</Heading2>
            {loremJapanese(200)}

            <Heading2>Certification</Heading2>
            <Certification />
        </div>
    );
}

const Heading2 = styled("h2", {
    base: {
        fontSize: {
            base: "20px",
            md: "24px",
            lg: "32px",
        },
        marginBottom: "8px",
    },
});
