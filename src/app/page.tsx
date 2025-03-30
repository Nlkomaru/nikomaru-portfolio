import { AboutMe } from "~/components/aboutme";
import { Footer } from "~/components/footer";
import { RootHeader } from "~/components/header/root-header";
import Scene from "~/components/scene";
import Works from "~/components/works/works";

export default function Home() {
    return (
        <>
            <Scene />
            <RootHeader />
            <AboutMe />
            <Works />
            <Footer />
        </>
    );
}
