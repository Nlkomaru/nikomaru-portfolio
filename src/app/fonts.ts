import {
    Caveat,
    M_PLUS_1p,
    Montserrat,
    Montserrat_Alternates,
    Noto_Sans_JP,
    Poppins,
    Zen_Kaku_Gothic_New,
    Zen_Maru_Gothic,
} from "next/font/google";

const zenMaruGothic = Zen_Maru_Gothic({
    weight: "500",
    variable: "--font-zen-maru-gothic",
    display: "swap",
    subsets: ["latin"],
});

const poppins = Poppins({
    weight: "500",
    variable: "--font-poppins",
    display: "swap",
    subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
    variable: "--font-noto-sans-jp",
    display: "swap",
    subsets: ["latin"],
});

const montserratAlternates = Montserrat_Alternates({
    weight: "500",
    variable: "--font-montserrat-alternates",
    display: "swap",
    subsets: ["latin"],
});

const montserrat = Montserrat({
    weight: "500",
    variable: "--font-montserrat",
    display: "swap",
    subsets: ["latin"],
});

const mPlus1p = M_PLUS_1p({
    weight: "400",
    variable: "--font-m-plus-1p",
    display: "swap",
    subsets: ["latin"],
});

const fontList = [
    zenMaruGothic,
    poppins,
    notoSansJP,
    montserratAlternates,
    montserrat,
    mPlus1p,
];

const fonts = fontList
    .map((font) => {
        return font.variable;
    })
    .join(" ");

export { fonts };
