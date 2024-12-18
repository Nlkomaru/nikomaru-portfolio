import { css } from "@/styled-system/css";
import Scene from "~/components/Scene";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";

export default function Home() {
    return (
        <div>
            <Scene />

            <Header />
            <Footer />
        </div>
    );
}
