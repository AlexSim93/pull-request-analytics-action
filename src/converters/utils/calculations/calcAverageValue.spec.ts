import { calcAverageValue } from './calcAverageValue';

describe('calcAverageValue', () => {
    it('should return 0 if no values are provided', () => {
        expect(calcAverageValue()).toBe(0);
    });

    it('should return 0 if an empty array is provided', () => {
        expect(calcAverageValue([])).toBe(0);
    });

    it('should return the average value of the provided numbers', () => {
        expect(calcAverageValue([1, 2, 3, 4, 5])).toBe(3);
        expect(calcAverageValue([10, 20, 30])).toBe(20);
        expect(calcAverageValue([1, 1, 1, 1, 1])).toBe(1);
    });

    it('should return the ceiling of the average value', () => {
        expect(calcAverageValue([1, 2, 3])).toBe(2);
        expect(calcAverageValue([1, 2, 2])).toBe(2);
        expect(calcAverageValue([1, 1, 2])).toBe(2);
    });

    it('should handle negative numbers correctly', () => {
        expect(calcAverageValue([-1, -2, -3, -4, -5])).toBe(-3);
        expect(calcAverageValue([-10, -20, -30])).toBe(-20);
    });

    it('should handle a mix of positive and negative numbers', () => {
        expect(calcAverageValue([-1, 1, -1, 1])).toBe(0);
        expect(calcAverageValue([-10, 10, -10, 10])).toBe(0);
    });
});