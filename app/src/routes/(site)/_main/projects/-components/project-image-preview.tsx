import { Dialog, Portal } from "@chakra-ui/react";
import { X } from "lucide-react";
import { useState } from "react";
import { sva } from "styled-system/css";

const projectImagePreviewStyles = sva({
    slots: ["trigger", "image", "backdrop", "positioner", "content", "close", "dialogBody", "dialogImage"],
    base: {
        trigger: {
            display: "block",
            w: "full",
            p: "0",
            border: "0",
            bg: "transparent",
            cursor: "zoom-in",
            textAlign: "left",
            borderRadius: "xl",
            _focusVisible: {
                outline: "2px solid",
                outlineColor: "colorPalette.border",
                outlineOffset: "3px",
            },
        },
        image: {
            w: "full",
            h: "auto",
            borderRadius: "xl",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "border.default",
        },
        backdrop: {
            position: "fixed",
            inset: 0,
            zIndex: 50,
            bg: "black/72",
            backdropFilter: "blur(10px)",
        },
        positioner: {
            position: "fixed",
            inset: 0,
            zIndex: 51,
            isolation: "isolate",
            alignItems: "center",
            justifyContent: "center",
        },
        content: {
            position: "relative",
            zIndex: 0,
            w: "full",
            maxW: "100vw",
            maxH: "100dvh",
            bg: "transparent",
            border: "none",
            boxShadow: "none",
            outline: "none",
        },
        close: {
            position: "fixed",
            top: "3",
            right: "4",
            zIndex: 2,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            w: "10",
            h: "10",
            p: 0,
            bg: "transparent",
            color: "white",
            border: 0,
            cursor: "pointer",
            transition: "opacity 0.2s ease, transform 0.2s ease",
            opacity: 0.8,
            _hover: {
                opacity: 1,
                transform: "scale(1.08)",
            },
            _active: {
                transform: "scale(0.96)",
            },
            _focusVisible: {
                outline: "2px solid",
                outlineColor: "white",
                outlineOffset: "2px",
            },
        },
        dialogBody: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4",
        },
        dialogImage: {
            display: "block",
            maxW: "full",
            maxH: "90dvh",
            w: "auto",
            h: "auto",
            objectFit: "contain",
            color: "transparent",
            fontSize: 0,
            borderRadius: "xl",
        },
    },
});

type ProjectImagePreviewProps = {
    src?: string;
    alt: string;
};

export default function ProjectImagePreview({ src, alt }: ProjectImagePreviewProps) {
    const styles = projectImagePreviewStyles();
    const [open, setOpen] = useState(false);

    if (!src) {
        return null;
    }

    const closePreview = () => setOpen(false);

    return (
        <>
            <button
                type="button"
                className={styles.trigger}
                onClick={() => setOpen(true)}
                aria-label={`Open image preview: ${alt}`}
            >
                <img src={src} alt={alt} className={styles.image} />
            </button>

            <Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)} placement="center">
                <Portal>
                    <Dialog.Backdrop className={styles.backdrop} />
                    <Dialog.Positioner className={styles.positioner} onClick={closePreview}>
                        <Dialog.CloseTrigger className={styles.close} aria-label="Close image preview">
                            <X size={18} />
                        </Dialog.CloseTrigger>
                        <Dialog.Content className={styles.content} onClick={closePreview}>
                            <div className={styles.dialogBody}>
                                <img src={src} alt={alt} decoding="async" className={styles.dialogImage} />
                            </div>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    );
}
