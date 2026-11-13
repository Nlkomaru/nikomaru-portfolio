import { describe, expect, it } from "vitest";
import { parseProjectMarkdown } from "./parse-project-markdown";

describe("parseProjectMarkdown", () => {
    it("parses flat section image metadata written without indentation under image:", () => {
        const raw = `---
slug: Sample
title: Sample
---

image:
src: ./assets/example.avif
alt: Example image
caption: Example caption
layout: left-image
---

## Overview

Section body text.
`;

        const parsed = parseProjectMarkdown<{ slug: string; title: string }>(raw);

        expect(parsed.sections).toEqual([
            {
                text: "## Overview\n\nSection body text.",
                image: {
                    src: "./assets/example.avif",
                    alt: "Example image",
                    caption: "Example caption",
                },
                layout: "left-image",
            },
        ]);
    });

    it("parses nested section image metadata as well", () => {
        const raw = `---
slug: Sample
title: Sample
---

image:
    src: ./assets/nested.avif
    alt: Nested image
    caption: Nested caption
layout: right-image
---

## Details

Nested body text.
`;

        const parsed = parseProjectMarkdown<{ slug: string; title: string }>(raw);

        expect(parsed.sections).toEqual([
            {
                text: "## Details\n\nNested body text.",
                image: {
                    src: "./assets/nested.avif",
                    alt: "Nested image",
                    caption: "Nested caption",
                },
                layout: "right-image",
            },
        ]);
    });
});
