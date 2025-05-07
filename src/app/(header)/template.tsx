import { css } from "@/styled-system/css";
import { Header } from "~/components/header/header";
import Scene from "~/components/scene";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Scene />
            <Header />
            <div
                className={css({
                    margin: "0 auto",
                    maxWidth: "1600px",
                    padding: "0 32px",
                })}
            >
                {children}
            </div>
        </>
    );
}
