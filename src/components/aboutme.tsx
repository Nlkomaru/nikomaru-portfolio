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
            <Text
                as="p"
                className={css({
                    marginTop: { base: "8px" },
                })}
            >
                信州大学工学部電子情報システム工学科情報システムプログラム在学中。ものづくりへの興味から、工業高校に進学し、電子工学を学びました。
                また、高校在学時には、ネットワークやプログラミングなどに興味を持ち、資格取得などを行いました。
                これらの経験を通じてコンピュータサイエンスに強く興味を抱き、大学に進学。
                大学進学後は、コンピュータサイエンスやセキュリティなど幅広い分野で学びを深めています。
                現在もスキルの向上と知識の習得を目指し、意欲的に取り組んでいます。
            </Text>
        </div>
    );
};
