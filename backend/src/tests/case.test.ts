import { describe, it, expect } from "vitest";

const filterUpcoming = (cases: any[], days: number) => {
  const now = new Date();
  const limit = new Date();
  limit.setDate(limit.getDate() + days);

  return cases.filter((c) => {
    const d = new Date(c.nextHearingDate);
    return d >= now && d <= limit;
  });
};

const validateCase = (data: any) => {
  const errors: string[] = [];
  if (!data.caseTitle || data.caseTitle.length < 3)
    errors.push("Title too short");
  if (!data.clientName) errors.push("Client required");
  if (!data.nextHearingDate) errors.push("Date required");
  return { isValid: errors.length === 0, errors };
};

describe("Legal Module Logic & Validation", () => {
  describe("Hearing Window Filtering", () => {
    it("should include hearings occurring exactly within the next 7 days", () => {
      const mockCases = [
        {
          title: "Due in 2 days",
          nextHearingDate: new Date(
            Date.now() + 2 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          title: "Due in 6 days",
          nextHearingDate: new Date(
            Date.now() + 6 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          title: "Past Case",
          nextHearingDate: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          title: "Far Future",
          nextHearingDate: new Date(
            Date.now() + 10 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ];

      const result = filterUpcoming(mockCases, 7);

      expect(result).toHaveLength(2);
      expect(result.map((c) => c.title)).toContain("Due in 2 days");
      expect(result.map((c) => c.title)).toContain("Due in 6 days");
    });

    it("should return empty array if no cases match the window", () => {
      const mockCases = [
        {
          title: "Way Future",
          nextHearingDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ];
      expect(filterUpcoming(mockCases, 7)).toHaveLength(0);
    });
  });

  describe("Data Validation Schema", () => {
    it("should reject titles shorter than 3 characters", () => {
      const res = validateCase({
        caseTitle: "JD",
        clientName: "Doe",
        nextHearingDate: "2026-05-01",
      });
      expect(res.isValid).toBe(false);
      expect(res.errors).toContain("Title too short");
    });

    it("should reject missing required fields", () => {
      const res = validateCase({ caseTitle: "Valid Title" });
      expect(res.isValid).toBe(false);
      expect(res.errors).toContain("Client required");
      expect(res.errors).toContain("Date required");
    });

    it("should accept a fully valid case object", () => {
      const res = validateCase({
        caseTitle: "State vs Smith",
        clientName: "John Smith",
        nextHearingDate: "2026-12-01",
      });
      expect(res.isValid).toBe(true);
      expect(res.errors).toHaveLength(0);
    });
  });

  describe("Task Status Logic", () => {
    const toggleStatus = (current: string) =>
      current === "Pending" ? "Completed" : "Pending";

    it("should correctly toggle from Pending to Completed", () => {
      expect(toggleStatus("Pending")).toBe("Completed");
    });

    it("should correctly toggle back to Pending", () => {
      expect(toggleStatus("Completed")).toBe("Pending");
    });
  });
});
