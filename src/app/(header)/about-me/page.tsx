import { css } from "@/styled-system/css";
import { AboutMe } from "~/components/aboutme";

export default function Home() {
    return (
        <div
            className={css({
                maxWidth: "1024px",
                margin: "auto",
            })}
        >
            <AboutMe />
        </div>
    );
}
