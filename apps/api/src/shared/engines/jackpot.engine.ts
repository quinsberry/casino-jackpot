import { Injectable } from '@nestjs/common';

export type JackpotSymbol = keyof typeof JackpotEngine.constants;

@Injectable()
export class JackpotEngine {
    constructor() {}

    static readonly constants = {
        CHERRY: 10,
        LEMON: 20,
        ORANGE: 30,
        WATERMELON: 40,
    } as const;

    roll(balance: number): [JackpotSymbol, JackpotSymbol, JackpotSymbol] {
        const symbols = Object.keys(JackpotEngine.constants) as JackpotSymbol[];

        let result = this.generateRoll(symbols);

        const isWinning = result.every((symbol) => symbol === result[0]);

        if (isWinning) {
            let rerollChance = 0;

            if (balance >= 60) {
                rerollChance = 0.6; // 60% chance to re-roll
            } else if (balance >= 40) {
                rerollChance = 0.3; // 30% chance to re-roll
            }

            // Re-roll if random number is less than rerollChance
            if (Math.random() < rerollChance) {
                result = this.generateRoll(symbols);
            }
        }

        return result;
    }

    convertToCredits(rollResult: [JackpotSymbol, JackpotSymbol, JackpotSymbol]): number {
        const [symbol1] = rollResult;
        if (rollResult.every((symbol) => symbol === symbol1)) {
            return JackpotEngine.constants[symbol1];
        }
        return 0;
    }

    private generateRoll(symbols: JackpotSymbol[]): [JackpotSymbol, JackpotSymbol, JackpotSymbol] {
        return [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
        ];
    }
}
