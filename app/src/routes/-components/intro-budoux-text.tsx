import { loadDefaultJapaneseParser } from "budoux";
import { Fragment } from "react";

const japaneseParser = loadDefaultJapaneseParser();

type IntroBudouxTextProps = {
    locale: string;
    text: string;
};

export function IntroBudouxText({ locale, text }: IntroBudouxTextProps) {
    if (locale !== "ja") {
        return <>{text}</>;
    }

    const phrases = japaneseParser.parse(text);
    let phraseEnd = 0;

    return phrases.map((phrase) => {
        const phraseStart = phraseEnd;
        phraseEnd += phrase.length;

        return (
            <Fragment key={`${phraseStart}-${phrase}`}>
                {phrase}
                {phraseEnd < text.length ? <wbr /> : null}
            </Fragment>
        );
    });
}
