import { calcDifferenceInMinutes } from "./calcDifferenceInMinutes";

describe("check calcDifferenceInMinutes", () => {
  // review during 1 day
    it("check if interval inside working hours during 1 day", () => {
      const startDate = "2023-10-20T12:00:00Z";
      const endDate = "2023-10-20T14:00:00Z";
      expect(calcDifferenceInMinutes(startDate, endDate)).toBe(120);
    });
    it("check if interval before working hours during 1 day", () => {
      const startDate = "2023-10-20T06:00:00Z";
      const endDate = "2023-10-20T07:00:00Z";
      expect(calcDifferenceInMinutes(startDate, endDate)).toBe(0);
    });
    it("check if interval after working hours during 1 day", () => {
      const startDate = "2023-10-20T20:30:00Z";
      const endDate = "2023-10-20T21:30:00Z";
      expect(calcDifferenceInMinutes(startDate, endDate)).toBe(0);
    });
    it("check if start before working hours during 1 day", () => {
      const startDate = "2023-10-20T09:30:00Z";
      const endDate = "2023-10-20T14:30:00Z";
      expect(calcDifferenceInMinutes(startDate, endDate)).toBe(270);
    });
    it("check if ends after working hours during 1 day", () => {
      const startDate = "2023-10-20T13:30:00Z";
      const endDate = "2023-10-20T21:30:00Z";
      expect(calcDifferenceInMinutes(startDate, endDate)).toBe(330);
    });
  //   // review with weekend
    it("check if interval inside weekend", () => {
      const startDate = "2023-10-21T13:30:00Z";
      const endDate = "2023-10-21T21:30:00Z";
      expect(calcDifferenceInMinutes(startDate, endDate)).toBe(0);
    });
    it("check if interval inside weekend with 2 days", () => {
      const startDate = "2023-10-21T13:30:00Z";
      const endDate = "2023-10-22T21:30:00Z";
      expect(calcDifferenceInMinutes(startDate, endDate)).toBe(0);
    });
    it("check if interval starts before weekend", () => {
      const startDate = "2023-10-20T13:30:00Z";
      const endDate = "2023-10-21T21:30:00Z";
      expect(calcDifferenceInMinutes(startDate, endDate)).toBe(330);
    });
    it("check if interval ends after weekend", () => {
      const startDate = "2023-10-22T19:30:00Z";
      const endDate = "2023-10-23T10:30:00Z";
      expect(calcDifferenceInMinutes(startDate, endDate)).toBe(30);
    });
    it("check if weekend inside interval", () => {
      const startDate = "2023-10-20T12:30:00Z";
      const endDate = "2023-10-23T10:30:00Z";
      expect(calcDifferenceInMinutes(startDate, endDate)).toBe(420);
    });
  //   // 2 days
    it("check if interval with 2 days and starts after working hours", () => {
      const startDate = "2023-10-18T20:30:00Z";
      const endDate = "2023-10-19T10:30:00Z";
      expect(calcDifferenceInMinutes(startDate, endDate)).toBe(30);
    });
    it("check if interval with 2 days and ends before working hours", () => {
      const startDate = "2023-10-18T15:30:00Z";
      const endDate = "2023-10-19T08:30:00Z";
      expect(calcDifferenceInMinutes(startDate, endDate)).toBe(210);
    });
  it("check if interval with 2 days and starts before working hours and ends after working hours", () => {
    const startDate = "2023-10-18T09:30:00Z";
    const endDate = "2023-10-19T21:30:00Z";
    expect(calcDifferenceInMinutes(startDate, endDate)).toBe(1080);
  });
  it("check if interval with 2 days and starts after working hours and ends before working hours", () => {
    const startDate = "2023-10-18T10:30:00Z";
    const endDate = "2023-10-19T15:30:00Z";
    expect(calcDifferenceInMinutes(startDate, endDate)).toBe(840);
  });
  it("check if interval with 2 days and starts after working hours and ends after working hours", () => {
    const startDate = "2023-11-08T20:00:00Z";
    const endDate = "2023-11-11T21:00:00Z";
    expect(calcDifferenceInMinutes(startDate, endDate)).toBe(1080);
  });
  // 2 weeks
  it("check if interval with 2 weeks", () => {
    const startDate = "2023-10-18T10:30:00Z";
    const endDate = "2023-11-08T15:30:00Z";
    expect(calcDifferenceInMinutes(startDate, endDate)).toBe(8400);
  });
});
