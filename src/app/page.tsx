import { css } from "@/styled-system/css";
import { AboutMe } from "~/components/aboutme";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import Scene from "~/components/scene";

export default function Home() {
    return (
        <div>
            <Scene />

            <Header />
            <AboutMe />
            <Footer />
        </div>
    );
}
