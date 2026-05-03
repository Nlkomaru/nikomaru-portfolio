import { Dialog, Portal } from "@chakra-ui/react";
import { X } from "lucide-react";
import { useState } from "react";
import { sva } from "styled-system/css";
import { getPhotoBackgroundStyle } from "../-functions/get-photo-entries";
import type { PhotoEntry } from "../-types/photo-gallery";

const photoGalleryStyles = sva({
    slots: [
        "root",
        "grid",
        "item",
        "button",
        "frame",
        "image",
        "backdrop",
        "positioner",
        "content",
        "close",
        "dialogBody",
        "dialogImage",
    ],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
        },
        grid: {
            display: "grid",
            gridTemplateColumns: { base: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
            gap: { base: "3", md: "4" },
        },
        item: {
            listStyle: "none",
        },
        button: {
            display: "block",
            w: "full",
            overflow: "hidden",
            bg: "bg.canvas",
            cursor: "pointer",
            textAlign: "left",
            transition: "box-shadow 0.25s ease",
            _hover: {
                boxShadow: "lg",
            },
            _focusVisible: {
                outline: "2px solid",
                outlineColor: "border.outline",
                outlineOffset: "3px",
            },
            "&:hover img": {
                transform: "scale(1.04)",
            },
        },
        frame: {
            position: "relative",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            bg: "bg.subtle",
        },
        image: {
            position: "absolute",
            inset: 0,
            w: "full",
            h: "full",
            objectFit: "cover",
            display: "block",
            color: "transparent",
            fontSize: 0,
            transition: "transform 0.35s ease",
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
            maxH: "calc(100dvh)",
            w: "auto",
            h: "auto",
            objectFit: "contain",
            color: "transparent",
            fontSize: 0,
            boxShadow: "2xl",
        },
    },
});

type PhotoGalleryProps = {
    photos: PhotoEntry[];
};

type PhotoGalleryGridProps = {
    photos: PhotoEntry[];
    onSelect: (photo: PhotoEntry) => void;
};

type PhotoGalleryLightboxProps = {
    open: boolean;
    photo: PhotoEntry | null;
    onOpenChange: (open: boolean) => void;
};

function PhotoGalleryRoot({ photos }: PhotoGalleryProps) {
    const styles = photoGalleryStyles();
    const [selectedPhoto, setSelectedPhoto] = useState<PhotoEntry | null>(null);

    return (
        <div className={styles.root}>
            <PhotoGallery.Grid photos={photos} onSelect={setSelectedPhoto} />
            <PhotoGallery.Lightbox
                open={selectedPhoto !== null}
                photo={selectedPhoto}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedPhoto(null);
                    }
                }}
            />
        </div>
    );
}

function PhotoGalleryGrid({ photos, onSelect }: PhotoGalleryGridProps) {
    const styles = photoGalleryStyles();

    return (
        <ul className={styles.grid}>
            {photos.map((photo, index) => (
                <li key={photo.id} className={styles.item}>
                    <button type="button" className={styles.button} onClick={() => onSelect(photo)}>
                        <div className={styles.frame}>
                            <img
                                src={photo.src}
                                alt={photo.alt}
                                width={photo.width}
                                height={photo.height}
                                loading={index < 8 ? "eager" : "lazy"}
                                decoding="async"
                                className={styles.image}
                                style={getPhotoBackgroundStyle(photo.blurhash)}
                            />
                        </div>
                    </button>
                </li>
            ))}
        </ul>
    );
}

function PhotoGalleryLightbox({ open, photo, onOpenChange }: PhotoGalleryLightboxProps) {
    const styles = photoGalleryStyles();
    const closeLightbox = () => onOpenChange(false);

    return (
        <Dialog.Root open={open} onOpenChange={(details) => onOpenChange(details.open)} placement="center">
            <Portal>
                <Dialog.Backdrop className={styles.backdrop} />
                <Dialog.Positioner className={styles.positioner} onClick={closeLightbox}>
                    <Dialog.CloseTrigger className={styles.close} aria-label="Close photo preview">
                        <X size={18} />
                    </Dialog.CloseTrigger>
                    <Dialog.Content className={styles.content} onClick={closeLightbox}>
                        {photo ? (
                            <div className={styles.dialogBody}>
                                <img
                                    src={photo.src}
                                    alt={photo.alt}
                                    width={photo.width}
                                    height={photo.height}
                                    decoding="async"
                                    className={styles.dialogImage}
                                    style={getPhotoBackgroundStyle(photo.blurhash)}
                                />
                            </div>
                        ) : null}
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

export const PhotoGallery = Object.assign(PhotoGalleryRoot, {
    Grid: PhotoGalleryGrid,
    Lightbox: PhotoGalleryLightbox,
});
