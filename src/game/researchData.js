import Decimal from 'break_eternity.js';
import { formatTime } from '../utils/formatUtils';

export const RESEARCH_DATA = Array.from({ length: 50 }, (_, i) => {
    const genIndex = i;
    const genNum = i + 1;

    // Speed Research (Overclock)
    const speedItem = {
        id: `gen${genNum}_speed`,
        name: `Generator ${genNum} Overclock`,
        target: `Generator ${genNum}`,
        type: 'Overclock',
        maxLevel: 9,
        getCost: (level) => new Decimal(Math.pow(genNum, 2)).times(new Decimal(2).pow(level)),
        getValue: (level) => {
            const basePeriod = 5 * genNum * (genNum + 1);
            return basePeriod * (1 - (level * 0.1));
        },
        baseDescription: "Reduces cycle time by 10%",
        getEffectValues: (level) => {
            const basePeriod = 5 * genNum * (genNum + 1);
            const current = basePeriod * (1 - (level * 0.1));
            const next = basePeriod * (1 - ((level + 1) * 0.1));
            return {
                current: formatTime(current),
                next: formatTime(next)
            };
        },
        getEffectDisplay: (level) => {
            const basePeriod = 5 * genNum * (genNum + 1);
            const val = basePeriod * (1 - (level * 0.1));
            return formatTime(val);
        },
        condition: (gameState) => {
            const gen = gameState.generators[genIndex];
            return gen && gen.amount.gt(0);
        }
    };

    // Efficiency Research (Yield Optimization)
    const effItem = {
        id: `gen${genNum}_eff`,
        name: `Generator ${genNum} Optimization`,
        target: `Generator ${genNum}`,
        type: 'Efficiency',
        maxLevel: 100, // Efficiency can be much higher
        // Efficiency costs 5x more than Speed base
        getCost: (level) => new Decimal(Math.pow(genNum, 2) * 5).times(new Decimal(2.5).pow(level)),
        getValue: (level) => 1 + level,
        baseDescription: "Increases production yield by 100%",
        getEffectValues: (level) => {
            return {
                current: `x${level + 1}`,
                next: `x${level + 2}`
            };
        },
        getEffectDisplay: (level) => `x${level + 1}`,
        condition: (gameState) => {
            const gen = gameState.generators[genIndex];
            return gen && gen.amount.gt(0);
        }
    };

    // Resonance Research (Insight Multiplier)
    const resonanceItem = {
        id: `gen${genNum}_resonance`,
        name: `Generator ${genNum} Resonance`,
        target: `Generator ${genNum}`,
        type: 'Resonance',
        maxLevel: 10, // Multiplier caps at x1024 (2^10)
        // High cost multiplier (4x base, 3x growth)
        getCost: (level) => new Decimal(Math.pow(genNum, 2) * 20).times(new Decimal(3.5).pow(level)),
        getValue: (level) => Math.pow(2, level),
        baseDescription: "Doubles Insight rewards from milestones",
        getEffectValues: (level) => {
            return {
                current: `x${Math.pow(2, level)}`,
                next: `x${Math.pow(2, level + 1)}`
            };
        },
        getEffectDisplay: (level) => `x${Math.pow(2, level)}`,
        condition: (gameState) => {
            const gen = gameState.generators[genIndex];
            return gen && gen.amount.gt(0);
        }
    };

    return [speedItem, effItem, resonanceItem];
}).flat();
