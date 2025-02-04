import { checkWeekend } from "./checkWeekend";
import { getMultipleValuesInput } from "../../../common/utils";

jest.mock("../../../common/utils", () => ({
    getMultipleValuesInput: jest.fn(),
}));

describe("checkWeekend", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should return true if the date is a weekend", () => {
        (getMultipleValuesInput as jest.Mock).mockReturnValue(["0", "6"]); // Sunday and Saturday

        const date = new Date("2021-01-02T00:00:00Z"); // Saturday
        const result = checkWeekend(date);
        expect(result).toBe(true);
    });

    it("should return false if the date is not a weekend", () => {
        (getMultipleValuesInput as jest.Mock).mockReturnValue(["0", "6"]); // Sunday and Saturday

        const date = new Date("2021-01-01T00:00:00Z"); // Friday
        const result = checkWeekend(date);
        expect(result).toBe(false);
    });

    it("should handle numeric input for date", () => {
        (getMultipleValuesInput as jest.Mock).mockReturnValue(["0", "6"]); // Sunday and Saturday

        const date = new Date("2021-01-02T00:00:00Z").getTime(); // Saturday
        const result = checkWeekend(date);
        expect(result).toBe(true);
    });

    it("should return false if WEEKENDS environment variable is not set", () => {
        (getMultipleValuesInput as jest.Mock).mockReturnValue([]);

        const date = new Date("2021-01-02T00:00:00Z"); // Saturday
        const result = checkWeekend(date);
        expect(result).toBe(false);
    });

    it("should return true for custom weekend days", () => {
        (getMultipleValuesInput as jest.Mock).mockReturnValue(["1", "2"]); // Monday and Tuesday

        const date = new Date("2021-01-04T00:00:00Z"); // Monday
        const result = checkWeekend(date);
        expect(result).toBe(true);
    });
});