import { css } from "@/styled-system/css";
import Scene from "~/components/Scene";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";

export default function Home() {
    return (
        <div>
            <Scene />
            {/*<div*/}
            {/*    className={css({*/}
            {/*        position: "absolute",*/}
            {/*        top: "-562",*/}
            {/*        left: "-363",*/}
            {/*        width: "1628px",*/}
            {/*        height: "1640px",*/}
            {/*        flexShrink: 0,*/}
            {/*        borderRadius: "1640px",*/}
            {/*        opacity: 0.5,*/}
            {/*        background: "#51AC49",*/}
            {/*    })}*/}
            {/*></div>*/}
            <Header />

            <Footer />
        </div>
    );
}
