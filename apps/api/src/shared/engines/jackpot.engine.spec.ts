import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, jest, afterEach } from '@jest/globals';
import { JackpotEngine } from './jackpot.engine';
import type { JackpotSymbol } from './jackpot.engine';

describe('JackpotEngine', () => {
    let engine: JackpotEngine;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [JackpotEngine],
        }).compile();

        engine = module.get<JackpotEngine>(JackpotEngine);
    });

    describe('constants', () => {
        it('should have correct symbol values', () => {
            expect(JackpotEngine.constants).toEqual({
                CHERRY: 10,
                LEMON: 20,
                ORANGE: 30,
                WATERMELON: 40,
            });
        });
    });

    describe('roll', () => {
        describe('random distribution', () => {
            it('should generate all possible symbols with equal probability', () => {
                const symbolCounts = new Map<JackpotSymbol, number>();
                const totalRolls = 1000;

                // Count occurrences of each symbol
                for (let i = 0; i < totalRolls; i++) {
                    const result = engine.roll(0);
                    result.forEach((symbol) => {
                        symbolCounts.set(symbol, (symbolCounts.get(symbol) || 0) + 1);
                    });
                }

                // Each symbol should appear roughly equal times (within 20% margin)
                const expectedCount = (totalRolls * 3) / Object.keys(JackpotEngine.constants).length;
                symbolCounts.forEach((count) => {
                    expect(count).toBeGreaterThan(expectedCount * 0.8);
                    expect(count).toBeLessThan(expectedCount * 1.2);
                });
            });
        });

        describe('reroll mechanism', () => {
            let mockRandom: jest.SpiedFunction<() => number>;
            let generateRollSpy: jest.SpiedFunction<any>;

            beforeEach(() => {
                mockRandom = jest.spyOn(Math, 'random');
                generateRollSpy = jest.spyOn(engine as any, 'generateRoll');
            });

            afterEach(() => {
                mockRandom.mockRestore();
                generateRollSpy.mockRestore();
            });

            it('should not reroll for non-winning combinations', () => {
                generateRollSpy.mockReturnValue(['CHERRY', 'LEMON', 'ORANGE']);
                mockRandom.mockReturnValue(0.1); // Would trigger reroll if winning

                engine.roll(60);
                expect(generateRollSpy).toHaveBeenCalledTimes(1);
            });

            it('should apply correct reroll probabilities based on balance', () => {
                generateRollSpy.mockReturnValue(['CHERRY', 'CHERRY', 'CHERRY']);

                // No reroll below 40
                mockRandom.mockReturnValue(0.1);
                engine.roll(39);
                expect(generateRollSpy).toHaveBeenCalledTimes(1);

                // 30% chance for 40-59
                generateRollSpy.mockClear();
                mockRandom.mockReturnValue(0.2); // Will trigger reroll (< 0.3)
                engine.roll(50);
                expect(generateRollSpy).toHaveBeenCalledTimes(2);

                generateRollSpy.mockClear();
                mockRandom.mockReturnValue(0.4); // Won't trigger reroll (> 0.3)
                engine.roll(50);
                expect(generateRollSpy).toHaveBeenCalledTimes(1);

                // 60% chance for 60+
                generateRollSpy.mockClear();
                mockRandom.mockReturnValue(0.5); // Will trigger reroll (< 0.6)
                engine.roll(70);
                expect(generateRollSpy).toHaveBeenCalledTimes(2);

                generateRollSpy.mockClear();
                mockRandom.mockReturnValue(0.7); // Won't trigger reroll (> 0.6)
                engine.roll(70);
                expect(generateRollSpy).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('convertToCredits', () => {
        it('should return correct credits for winning combinations', () => {
            const testCases: [JackpotSymbol, JackpotSymbol, JackpotSymbol][] = [
                ['CHERRY', 'CHERRY', 'CHERRY'],
                ['LEMON', 'LEMON', 'LEMON'],
                ['ORANGE', 'ORANGE', 'ORANGE'],
                ['WATERMELON', 'WATERMELON', 'WATERMELON'],
            ];

            const expected = [10, 20, 30, 40];

            testCases.forEach((testCase, index) => {
                expect(engine.convertToCredits(testCase)).toBe(expected[index]);
            });
        });

        it('should return 0 for non-winning combinations', () => {
            const testCases: [JackpotSymbol, JackpotSymbol, JackpotSymbol][] = [
                ['CHERRY', 'LEMON', 'ORANGE'],
                ['WATERMELON', 'WATERMELON', 'CHERRY'],
                ['LEMON', 'ORANGE', 'LEMON'],
                ['ORANGE', 'CHERRY', 'WATERMELON'],
            ];

            testCases.forEach((testCase) => {
                expect(engine.convertToCredits(testCase)).toBe(0);
            });
        });
    });

    describe('integration', () => {
        it('should correctly process a complete game cycle', () => {
            const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.8);
            const result = engine.roll(50);
            const credits = engine.convertToCredits(result);

            expect(result).toHaveLength(3);
            expect(typeof credits).toBe('number');
            expect(credits).toBeGreaterThanOrEqual(0);

            mockRandom.mockRestore();
        });
    });
});
