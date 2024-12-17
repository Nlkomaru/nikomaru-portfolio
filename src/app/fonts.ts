import {Caveat, Noto_Sans_JP, Poppins, Zen_Kaku_Gothic_New} from "next/font/google";



const zenKakuGothicNew = Zen_Kaku_Gothic_New({
    weight: "400",
    variable: "--font-zen-kaku-gothic-new",
    display: "swap",
    subsets: ["latin"],
});

const caveat = Caveat({
    variable: "--font-caveat",
    display: "swap",
    subsets: ["latin"],
})

export { zenKakuGothicNew, caveat };