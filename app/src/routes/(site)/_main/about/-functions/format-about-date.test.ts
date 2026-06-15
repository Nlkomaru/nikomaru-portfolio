import { describe, expect, it } from "vitest";
import { formatAboutDate, formatAboutPeriod } from "./format-about-date";

describe("formatAboutDate", () => {
    it("formats a year-month value for Japanese", () => {
        expect(formatAboutDate("2023-04", "ja")).toBe("2023年4月");
    });

    it("formats a year-month value for English", () => {
        expect(formatAboutDate("2023-04", "en")).toBe("Apr 2023");
    });

    it("keeps the acquisition day when it is available", () => {
        expect(formatAboutDate("2023-06-29", "ja")).toBe("2023年6月29日");
    });
});

describe("formatAboutPeriod", () => {
    it("uses a single date for a point-in-time event", () => {
        expect(formatAboutPeriod("2023-03", "2023-03", "ja", "現在")).toBe("2023年3月");
    });

    it("uses the provided present label for an ongoing period", () => {
        expect(formatAboutPeriod("2023-04", null, "en", "Present")).toBe("Apr 2023 — Present");
    });
});
