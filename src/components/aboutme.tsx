import { css } from "@/styled-system/css";
import { Text } from "~/components/ui/text";

export const AboutMe = () => {
    return (
        <div
            className={css({
                margin: "0 auto",
                padding: {
                    base: "32px 32px",
                },
                maxWidth: "1400px",
            })}
        >
            <h1
                className={css({
                    fontSize: {
                        base: "20px",
                        md: "24px",
                        lg: "32px",
                    },
                })}
            >
                Statement
            </h1>
            <Text as="p" className={css({})}>
                未来は予測するものでも、観測するものでもなく、我々の手で作り上げることができるものだと信じています。未来の傍観者となることなく、より人間らしい、ワクワクする、情緒的な未来を、実際に手を動かし作りながら、実現していきたいと考えています。
            </Text>
        </div>
    );
};
