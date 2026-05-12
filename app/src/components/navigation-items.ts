import { FolderKanban, House, Images, Presentation, UserRound } from "lucide-react";

export const navigationItems = [
    { icon: House, label: "Index", to: "/" },
    { icon: Presentation, label: "Talks", to: "/talks" },
    { icon: FolderKanban, label: "Projects", to: "/projects" },
    { icon: UserRound, label: "About", to: "/about" },
    { icon: Images, label: "Photos", to: "/photos" },
] as const;
