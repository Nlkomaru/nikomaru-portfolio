import { css } from "@/styled-system/css";
import { loremJapanese } from "~/app/util";
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
                About Me
            </h1>
            <Text as="p" className={css({})}>
                {loremJapanese(400)}
            </Text>
        </div>
    );
};
