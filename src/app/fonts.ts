import {
    Caveat,
    Noto_Sans_JP,
    Poppins,
    Zen_Kaku_Gothic_New,
} from "next/font/google";

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
    weight: "500",
    variable: "--font-zen-kaku-gothic-new",
    display: "swap",
    subsets: ["latin"],
});

const poppins = Poppins({
    weight: "500",
    variable: "--font-poppins",
    display: "swap",
    subsets: ["latin"],
});

export { zenKakuGothicNew, poppins };