import { createFileRoute } from "@tanstack/react-router";
import { sva } from "styled-system/css";
import { getLocale } from "../../../../paraglide/runtime";
import AboutIntroduction from "./-components/about-introduction";
import AboutPersonalSections from "./-components/about-personal-sections";
import CareerTimeline from "./-components/career-timeline";
import QualificationList from "./-components/qualification-list";
import careersData from "./-data/careers.json";
import qualificationsData from "./-data/qualifications.json";
import { aboutData } from "./-functions/get-about-content";
import type { Career, LocalizedText, Qualification } from "./-types/about";

const aboutPageStyles = sva({
    slots: ["root", "container", "details"],
    base: {
        root: {
            maxW: "7xl",
            mx: "auto",
            minH: { base: "calc(100dvh - 3.5rem)", md: "100dvh" },
            flexGrow: 1,
            bg: "bg.canvas",
        },
        container: {
            display: "flex",
            flexDirection: "column",
            gap: { base: "18", md: "26" },
            px: { base: "4", md: "12" },
            py: { base: "12", md: "20" },
        },
        details: {
            display: "flex",
            flexDirection: "column",
            pt: { base: "16", md: "20" },
            gap: { base: "16", md: "20" },
        },
    },
});

const data = aboutData;
const careers = careersData as Career[];
const qualifications = qualificationsData as Qualification[];

export const Route = createFileRoute("/(site)/_main/about/")({
    head: () => {
        const locale = getLocale();
        const profile = data.profile[locale];

        return {
            meta: [
                {
                    title: `${profile.pageTitle} | Nikomaru Portfolio`,
                },
                {
                    name: "description",
                    content: profile.metaDescription,
                },
            ],
        };
    },
    component: AboutPage,
});

function localize(text: LocalizedText): string {
    return text[getLocale()];
}

function AboutPage() {
    const styles = aboutPageStyles();
    const locale = getLocale();
    const profile = data.profile[locale];

    return (
        <main className={styles.root}>
            <div className={styles.container}>
                <AboutIntroduction
                    avatarAlt={profile.avatarAlt}
                    aboutTitle={profile.sectionTitles.about}
                    intro={profile.intro}
                />

                <AboutPersonalSections
                    hobbyTitle={profile.sectionTitles.hobby}
                    stories={profile.stories}
                    futureTitle={profile.sectionTitles.future}
                    future={profile.future}
                />

                <div className={styles.details}>
                    <CareerTimeline
                        title={profile.careerTitle}
                        description={profile.careerDescription}
                        presentLabel={profile.presentLabel}
                        locale={locale}
                        items={careers.map((career) => ({
                            ...career,
                            title: localize(career.title),
                            description: localize(career.description),
                        }))}
                    />
                    <QualificationList
                        title={profile.qualificationTitle}
                        description={profile.qualificationDescription}
                        emptyLabel={profile.qualificationEmptyLabel}
                        expectedLabel={profile.qualificationExpectedLabel}
                        locale={locale}
                        items={qualifications.map((qualification) => ({
                            ...qualification,
                            name: localize(qualification.name),
                            issuer: localize(qualification.issuer),
                        }))}
                    />
                </div>
            </div>
        </main>
    );
}
