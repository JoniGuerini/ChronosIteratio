import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import Decimal from 'break_eternity.js';
import { RESEARCH_DATA } from './researchData';
import { TALENT_DATA, TALENT_TREE_EDGES } from './talentData';
import { formatNumber } from '../utils/formatUtils';

const GameContext = createContext();

const INITIAL_STATE = {
    iterons: new Decimal(0),
    insight: new Decimal(0),
    generators: Array.from({ length: 50 }, (_, i) => {
        // Multiplier is now "Amount per Batch", initially 1.
        // Frequencies (Periods) are calculated in getBasePeriod helper.
        return {
            id: i,
            amount: new Decimal(0),
            bought: new Decimal(0),
            multiplier: new Decimal(1),
            cycleProgress: 0, // Track time in seconds for this batch
            costBase: new Decimal(50).pow(i).ceil(),
        };
    }),
    lastTick: Date.now(),
    showFPS: true, // FPS counter enabled by default
    research: {}, // Map of unlocked research IDs to Levels { 'gen1_speed': 1 }
    // Offline Progress / Time Warp
    storedTime: 0, // Seconds of fuel
    maxStoredTime: 0, // Reference for the reservoir bar
    isWarping: false,
    warpSpeed: 20, // Multiplier (2x - 10000x)
    offlineGap: 0, // Seconds since last session (not claimed yet)
    isTimeShiftDismissed: false,
    // Talents
    focus: new Decimal(0),
    flux: new Decimal(0),
    activeTime: 0, // Counter for focus gain
    talents: {}, // { talent_id: level }
};

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState(INITIAL_STATE);
    const stateRef = useRef(gameState); // Use ref for the game loop to avoid closure staleness

    // Sync ref with state
    stateRef.current = gameState;

    // Serialization helper
    const serializeState = (state) => {
        return JSON.stringify(state);
    };

    // Deserialization helper
    const deserializeState = (json) => {
        const parsed = JSON.parse(json);

        // Re-instantiate Decimals
        parsed.iterons = new Decimal(parsed.iterons);
        parsed.insight = parsed.insight ? new Decimal(parsed.insight) : new Decimal(0); // Migration for old saves
        parsed.generators = parsed.generators.map(g => ({
            ...g,
            amount: new Decimal(g.amount),
            bought: new Decimal(g.bought),
            multiplier: new Decimal(g.multiplier),
            costBase: new Decimal(g.costBase),
            costGrowth: new Decimal(g.costGrowth),
        }));

        // Migration: Convert Array to Object if needed
        if (Array.isArray(parsed.research)) {
            const oldResearch = parsed.research;
            parsed.research = {};
            // Map old boolean upgrades to Level 5 (half speed)
            if (oldResearch.includes('gen1_speed_1')) parsed.research['gen1_speed'] = 5;
            if (oldResearch.includes('gen2_speed_1')) parsed.research['gen2_speed'] = 5;
        }
        parsed.research = parsed.research || {};

        // Ensure legacy saves or missing fields don't break things (basic migration)
        if (!parsed.lastTick) parsed.lastTick = Date.now();
        parsed.iterons = parsed.iterons.floor(); // Fix any existing ghost decimals

        parsed.storedTime = parsed.storedTime || 0;
        parsed.maxStoredTime = parsed.maxStoredTime || parsed.storedTime || 0;
        parsed.isWarping = false; // Never start warping on load
        parsed.warpSpeed = parsed.warpSpeed || 20;
        parsed.isTimeShiftDismissed = parsed.isTimeShiftDismissed || false;

        // Talents
        parsed.focus = new Decimal(parsed.focus || 0);
        parsed.flux = new Decimal(parsed.flux || 0);
        parsed.activeTime = parsed.activeTime || 0;
        parsed.talents = parsed.talents || {};

        return parsed;
    };

    const saveGame = useCallback(() => {
        try {
            const serialized = serializeState(stateRef.current);
            localStorage.setItem('chronos-iteratio-save', serialized);
            console.log('Game Saved');
        } catch (e) {
            console.error('Failed to save game:', e);
        }
    }, []);

    const loadGame = useCallback(() => {
        try {
            const saved = localStorage.getItem('chronos-iteratio-save');
            if (saved) {
                const loadedState = deserializeState(saved);

                // MIGRATION: Update balance values for existing saves
                loadedState.generators = loadedState.generators.map((g, i) => {
                    return {
                        ...g,
                        multiplier: new Decimal(1), // Reset multiplier to 1 (Batch Amount)
                        cycleProgress: g.cycleProgress || 0, // Init progress
                        costBase: new Decimal(50).pow(i).ceil(),
                    };
                });

                // Calculate Offline Gap
                const now = Date.now();
                const gapMs = now - loadedState.lastTick;
                const gapSec = Math.floor(gapMs / 1000);

                if (gapSec > 60) {
                    loadedState.offlineGap = gapSec;

                    // --- TALENT: Lucid Dreaming (Passive Offline Production) ---
                    const lucidLevel = loadedState.talents?.['lucid_dreaming'] || 0;
                    if (lucidLevel > 0) {
                        const pct = lucidLevel * 0.03; // 3% per level
                        // Calculate base production (Gen 0 only for simplicity/safety during load)
                        // We need to reconstruct the helper context or just do a rough est.
                        // Ideally we use the helper, but helpers depend on stateRef which isn't set yet.
                        // Let's do a safe approximation using the loaded state data.

                        const gen0 = loadedState.generators[0];
                        if (gen0 && new Decimal(gen0.amount).gt(0)) {
                            // Re-calc multipliers locally to avoid dependency hell
                            const research = loadedState.research || {};

                            // Base Speed
                            let speed = 10; // Default
                            const speedLevel = research['gen1_speed'] || 0;
                            // Speed logic: 5 * 1 * 2 * (1 - 0.1*lvl) -> 10 * ...
                            // Actually let's just grab the logic from getBasePeriod? No, can't access it yet.
                            // Let's ignore complex speed/mult calc for this specific passive bonus and just use
                            // a rough "current yield" snapshot if we had it, or just rely on the user warping.

                            // Alternative: Just grant Flux/Focus? No, user wants progression.
                            // Let's defer this to a useEffect that runs once after load?
                            // Yes, that's safer.
                        }
                    }
                } else {
                    loadedState.offlineGap = 0;
                }

                setGameState(loadedState);
                // Update ref immediately so helpers can use it before next render
                stateRef.current = loadedState;
                console.log('Game Loaded, Offline Gap:', gapSec, 's');
                return loadedState;
            }
        } catch (e) {
            console.error('Failed to load game:', e);
        }
        return null;
    }, []);

    const hardReset = useCallback(() => {
        localStorage.removeItem('chronos-iteratio-save');
        setGameState(INITIAL_STATE);
        window.location.reload(); // Reload to ensure clean slate
    }, []);



    // Auto-save loop
    useEffect(() => {
        const interval = setInterval(() => {
            saveGame();
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, [saveGame]);


    // Milestone Leveling Logic
    const calculateMultiplier = useCallback((amountDec) => {
        // Obsolete: Milestones now grant Insights, not production multipliers.
        return new Decimal(1);
    }, []);

    const getEfficiencyMultiplier = useCallback((id) => {
        const state = stateRef.current || INITIAL_STATE;
        const research = state.research || {};
        const level = research[`gen${id + 1}_eff`] || 0;

        // --- TALENT: Active Resonance ---
        const activeResLevel = state.talents?.['active_resonance'] || 0;
        const activeResMult = 1 + (activeResLevel * 0.1);

        // Each level is +100% yield (Level 0 = x1, Level 1 = x2...)
        return new Decimal(1 + level).times(activeResMult);
    }, []);

    // Helper to get next milestone info
    const getNextMilestone = useCallback((amountDec) => {
        if (amountDec.lt(10)) return { next: 10, level: 0, prev: 0 };
        if (amountDec.lt(25)) return { next: 25, level: 1, prev: 10 };
        if (amountDec.lt(50)) return { next: 50, level: 2, prev: 25 };
        if (amountDec.lt(100)) return { next: 100, level: 3, prev: 50 };

        // For >= 100: Simple doubling (100, 200, 400, 800, 1600...)
        // Find the next power of 2 milestone
        let milestone = new Decimal(100);
        let level = 4;

        while (amountDec.gte(milestone)) {
            milestone = milestone.times(2);
            level++;
        }

        return { next: milestone, level: level - 1, prev: milestone.div(2) };
        return { next: milestone, level: level - 1, prev: milestone.div(2) };
    }, []);

    // Helper: Calculate Total Insights Earned based on current generator amounts
    const calculateTotalEarnedInsights = useCallback((generators, research) => {
        let total = new Decimal(0);
        generators.forEach((gen, index) => {
            const { level } = getNextMilestone(gen.amount);
            if (level > 0) {
                // Tier Reward = (index + 1) * Level
                const resonanceLevel = research?.[`gen${index + 1}_resonance`] || 0;
                const multiplier = Math.pow(2, resonanceLevel);

                const tierReward = new Decimal(index + 1).times(level).times(multiplier);
                total = total.add(tierReward);
            }
        });
        return total;
    }, [getNextMilestone]);

    // Helper: Calculate Total Insights Spent on Research
    const calculateTotalSpentInsights = useCallback((research) => {
        let total = new Decimal(0);
        Object.entries(research).forEach(([id, level]) => {
            const item = RESEARCH_DATA.find(r => r.id === id);
            if (item) {
                // Sum cost for all levels bought
                for (let i = 0; i < level; i++) {
                    total = total.add(item.getCost(i));
                }
            }
        });
        return total;
    }, []);


    const getBasePeriod = (id) => {
        const state = stateRef.current || INITIAL_STATE;
        const research = state.research || {};

        const base = 5 * (id + 1) * (id + 2);
        const level = research[`gen${id + 1}_speed`] || 0;

        // Apply 10% reduction per level (Level 9 = 90% reduction)
        return Math.max(base * 0.1, base * (1 - (level * 0.1)));
    };

    const tick = useCallback((dt, shouldRender = true) => {
        // Use stateRef for calculations to avoid stale closures
        const currentState = stateRef.current;
        let generatedIterons = new Decimal(0);

        // Calculate production from generators
        const newGenerators = [...currentState.generators]; // Shallow copy

        // Process Generator 0 (Produces Iterons)
        const gen0 = currentState.generators[0];
        if (gen0.amount.gt(0)) {
            const period = getBasePeriod(0);

            // Accumulate time
            // dt is in seconds (tick calls usually pass seconds)
            // But wait, the standard game loop usually passes delta in seconds.
            // Let's assume dt is seconds.

            // Create modified generator object
            const nextGen0 = { ...gen0 };
            nextGen0.cycleProgress = (nextGen0.cycleProgress || 0) + dt;

            if (nextGen0.cycleProgress >= period) {
                // Calculate batches completed
                const batches = Math.floor(nextGen0.cycleProgress / period);

                // Payout: Amount * Multiplier * Batches
                // multiplier is base 1 * milestone bonuses (if any, but currently x1)
                const mult = calculateMultiplier(nextGen0.amount);
                const effMult = getEfficiencyMultiplier(0);
                const payout = nextGen0.amount.times(nextGen0.multiplier).times(mult).times(effMult).times(batches).floor();

                generatedIterons = payout;

                // Keep remainder time
                nextGen0.cycleProgress %= period;
            }
            newGenerators[0] = nextGen0;
        }

        // Process Generators 1-49 (Produce lower tier generators)
        for (let i = 1; i < 50; i++) {
            const gen = currentState.generators[i];
            if (gen.amount.gt(0)) {
                const period = getBasePeriod(i);

                const nextGen = { ...gen };
                // Ensure dt is valid for calculation
                if (!isNaN(dt) && dt > 0) {
                    nextGen.cycleProgress = (nextGen.cycleProgress || 0) + dt;
                }

                if (nextGen.cycleProgress >= period) {
                    const batches = Math.floor(nextGen.cycleProgress / period);
                    const mult = calculateMultiplier(nextGen.amount);
                    const effMult = getEfficiencyMultiplier(i);
                    const production = nextGen.amount.times(nextGen.multiplier).times(mult).times(effMult).times(batches).floor();

                    // Consume remainder
                    nextGen.cycleProgress %= period;

                    // Award to target (i-1)
                    const targetGen = { ...newGenerators[i - 1] };
                    targetGen.amount = targetGen.amount.add(production);
                    newGenerators[i - 1] = targetGen;
                }
                newGenerators[i] = nextGen;
            }
        }

        // --- TALENT: Kinetic Link ---
        const kineticLevel = currentState.talents?.['kinetic_clique'] || 0;
        let bonusDt = 0;
        if (kineticLevel > 0) {
            // This is handled in manualClick for state updates, 
            // but we can also use it to speed up the loop if needed.
        }

        // Update the ref
        stateRef.current = {
            ...currentState,
            generators: newGenerators,
            iterons: currentState.iterons.add(generatedIterons).floor(),
            lastTick: Date.now(),
            activeTime: (currentState.activeTime || 0) + dt
        };

        // --- TALENT: Focus Gain ---
        const focusLevel = currentState.talents?.['focus_mastery'] || 0;
        const focusInterval = 60 - (focusLevel * 5);
        if (stateRef.current.activeTime >= focusInterval) {
            stateRef.current.focus = stateRef.current.focus.add(1);
            stateRef.current.activeTime -= focusInterval;
        }

        // Only trigger React re-render when shouldRender is true
        if (shouldRender) {
            setGameState(prevState => {
                // Merge the updates from stateRef.current into prevState
                let nextState = { ...prevState, ...stateRef.current };

                // Keep Decimal instances safe
                nextState.focus = stateRef.current.focus;
                nextState.activeTime = stateRef.current.activeTime;

                // INTEGRITY CHECK: Enforce Insight Balance EVERY TICK
                // This ensures the value cannot drift or be overwritten by stale state.
                const earned = calculateTotalEarnedInsights(nextState.generators, nextState.research);
                const spent = calculateTotalSpentInsights(nextState.research);
                const expectedBalance = earned.sub(spent);

                if (nextState.insight.lt(expectedBalance)) {
                    // Only log if we are actually correcting, to avoid spam
                    console.log(`Auto-Correcting Insights: ${nextState.insight} -> ${expectedBalance}`);
                    nextState.insight = expectedBalance;
                }

                return nextState;
            });
        }
    }, [getBasePeriod, calculateMultiplier, calculateTotalEarnedInsights, calculateTotalSpentInsights]);

    const manualClick = useCallback(() => {
        setGameState((prevState) => {
            const newState = { ...prevState };
            newState.iterons = newState.iterons.add(1).floor();

            // --- TALENT: Kinetic Link ---
            const kineticLevel = newState.talents?.['kinetic_clique'] || 0;
            if (kineticLevel > 0) {
                const bonusSeconds = kineticLevel * 0.1;
                const gen0 = { ...newState.generators[0] };
                gen0.cycleProgress = (gen0.cycleProgress || 0) + bonusSeconds;
                newState.generators = [gen0, ...newState.generators.slice(1)];
            }

            return newState;
        });
    }, []);

    const buyGenerator = useCallback((id) => {
        setGameState((prevState) => {
            const newState = { ...prevState };

            // Create a deep copy of the generators array to avoid mutation
            const newGenerators = newState.generators.map(g => ({ ...g }));
            const gen = newGenerators[id];

            // Unified cost calculation to prevent UI/Logic mismatch
            const cost = getGeneratorCost(id);

            if (newState.iterons.gte(cost)) {
                // Check milestone level BEFORE purchase
                const prevMilestone = getNextMilestone(gen.amount);

                newState.iterons = newState.iterons.sub(cost);
                gen.amount = gen.amount.add(1);
                gen.bought = gen.bought.add(1);

                // Check milestone level AFTER purchase
                const newMilestone = getNextMilestone(gen.amount);

                // Award Insights if level increased
                if (newMilestone.level > prevMilestone.level) {
                    // Logic: Award (Tier) * (Levels Gained)
                    // Generator 0 (Tier 1) gives 1 per milestone
                    // Generator 1 (Tier 2) gives 2 per milestone
                    const tierReward = new Decimal(id + 1);
                    const levelsGained = new Decimal(newMilestone.level - prevMilestone.level);
                    const totalReward = tierReward.times(levelsGained);

                    newState.insight = newState.insight.add(totalReward);
                }

                newGenerators[id] = gen;
                newState.generators = newGenerators;
            }

            return newState;
        });
    }, [getNextMilestone]);

    const getGeneratorCost = useCallback((id) => {
        const gen = stateRef.current.generators[id];
        const n = gen.amount.floor();
        const increment = new Decimal(id + 1);
        // Formula: Base + Increment * (n * (n + 1) / 2)
        const triangularNumber = n.times(n.add(1)).div(2);
        return gen.costBase.add(increment.times(triangularNumber)).ceil();
    }, []);

    const buyResearch = useCallback((id) => {
        setGameState((prevState) => {
            const newState = { ...prevState };

            const researchItem = RESEARCH_DATA.find(r => r.id === id);
            if (!researchItem) return prevState;

            const currentLevel = newState.research[id] || 0;
            if (currentLevel >= researchItem.maxLevel) return prevState; // Maxed out

            const cost = researchItem.getCost(currentLevel);

            if (newState.insight.gte(cost)) {
                newState.insight = newState.insight.sub(cost);
                newState.research = {
                    ...newState.research,
                    [id]: currentLevel + 1
                };
            }

            return newState;
        });
    }, []);

    const getGeneratorProduction = useCallback((id) => {
        const gen = stateRef.current.generators[id];
        if (gen.amount.eq(0)) return new Decimal(0);

        const mult = calculateMultiplier(gen.amount);
        const effMult = getEfficiencyMultiplier(id);
        const period = getBasePeriod(id);

        // Average Production per second = (amount * multiplier * milestone_mult * effMult) / period
        return gen.amount.times(gen.multiplier).times(mult).times(effMult).div(period);
    }, [calculateMultiplier]);

    const calculateProduction = useCallback((stateOverride) => {
        // Calculate total Iteron production per second (from Generator 0)
        // Use provided state or fallback to ref/current state
        const state = stateOverride || stateRef.current || INITIAL_STATE;
        const gen0 = state.generators[0];

        // Safety check for initialization
        if (!gen0 || !gen0.amount) return new Decimal(0);
        if (gen0.amount.lte(0)) return new Decimal(0);

        const mult = calculateMultiplier(gen0.amount);
        const effMult = getEfficiencyMultiplier(0);
        const period = getBasePeriod(0);
        return gen0.amount.times(gen0.multiplier).times(mult).times(effMult).div(period);
    }, [calculateMultiplier, getEfficiencyMultiplier, getBasePeriod]);

    // Load on mount
    useEffect(() => {
        const loadedState = loadGame();

        // Post-Load Logic for Lucid Dreaming
        // We use loadedState directly because stateRef is updated in loadGame
        if (loadedState && loadedState.offlineGap > 60) {
            const lucidLevel = loadedState.talents?.['lucid_dreaming'] || 0;
            if (lucidLevel > 0 && loadedState.generators[0].amount.gt(0)) {
                const pct = lucidLevel * 0.03;

                // Calculate using the loaded state
                const prodPerSec = calculateProduction(loadedState);
                const passiveGain = prodPerSec.times(loadedState.offlineGap).times(pct);

                if (passiveGain.gt(0)) {
                    console.log(`Lucid Dreaming: Generated ${formatNumber(passiveGain)} Iterons offline.`);
                    setGameState(prev => ({
                        ...prev,
                        iterons: prev.iterons.add(passiveGain)
                    }));
                }
            }
        }
    }, []); // Empty dependency array to run ONCE on mount

    const toggleFPS = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            showFPS: !prev.showFPS
        }));
    }, []);

    const claimOfflineTime = useCallback(() => {
        setGameState(prev => {
            // --- TALENT: Temporal Dilation ---
            const dilationLevel = prev.talents?.['temporal_dilation'] || 0;
            const ratio = 1 + (dilationLevel * 0.05);
            const boostedGap = prev.offlineGap * ratio;

            // Flux Gain: 1 per 60s of offline time
            const fluxGain = Math.floor(prev.offlineGap / 60);

            const nextStoredTime = prev.storedTime + boostedGap;
            return {
                ...prev,
                storedTime: nextStoredTime,
                maxStoredTime: nextStoredTime, // Reset reservoir on claim
                flux: prev.flux.add(fluxGain),
                offlineGap: 0,
                isTimeShiftDismissed: false, // Re-show the popup when new time is claimed
            };
        });
    }, []);

    const buyTalent = useCallback((id) => {
        const talent = TALENT_DATA.find(t => t.id === id);
        if (!talent) return;

        setGameState(prev => {
            const currentLevel = prev.talents[id] || 0;
            if (currentLevel >= talent.maxLevel) return prev; // Maxed out

            // Recalculate cost inside the setter to ensure latest state is used (though closure captures logic)
            // Ideally we use stateRef if we needed perfect sync, but prev is fine for atomic updates.
            // CAUTION: talent.getCost(level) is deterministic.
            const cost = talent.getCost(currentLevel);
            const currency = talent.path; // 'focus' or 'flux'

            // Safe check: currency balance might be missing or not a Decimal if state is corrupted,
            // but we trust deserializeState.
            // --- PREREQUISITE CHECK ---
            const edges = TALENT_TREE_EDGES.filter(e => e.to === id);
            const isRoot = edges.some(e => e.from === null);

            if (!isRoot) {
                const hasParentUnlocked = edges.some(e => (prev.talents[e.from] || 0) > 0);
                if (!hasParentUnlocked) {
                    console.log(`Talent ${id} is locked. Prerequisites not met.`);
                    return prev;
                }
            }

            return {
                ...prev,
                [currency]: prev[currency].sub(cost),
                talents: {
                    ...prev.talents,
                    [id]: currentLevel + 1
                }
            };
        });
    }, []);

    const respecTalents = useCallback(() => {
        setGameState(prev => {
            let refundFocus = new Decimal(0);
            let refundFlux = new Decimal(0);
            const newTalents = {};

            // Calculate refunds
            Object.entries(prev.talents).forEach(([id, level]) => {
                const talent = TALENT_DATA.find(t => t.id === id);
                if (talent && level > 0) {
                    let totalCost = new Decimal(0);
                    // Sum cost for levels 0 to level-1
                    for (let i = 0; i < level; i++) {
                        totalCost = totalCost.add(talent.getCost(i));
                    }

                    if (talent.path === 'focus') {
                        refundFocus = refundFocus.add(totalCost);
                    } else if (talent.path === 'flux') {
                        refundFlux = refundFlux.add(totalCost);
                    }
                }
            });

            console.log(`Respec: Refunding ${formatNumber(refundFocus)} Focus and ${formatNumber(refundFlux)} Flux.`);

            return {
                ...prev,
                focus: prev.focus.add(refundFocus),
                flux: prev.flux.add(refundFlux),
                talents: {} // Wipe all levels
            };
        });
    }, []);

    const toggleTimeWarp = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            isWarping: !prev.isWarping && prev.storedTime > 0
        }));
    }, []);

    const setWarpSpeed = useCallback((speed) => {
        setGameState(prev => ({
            ...prev,
            warpSpeed: Math.max(2, Math.min(10000, speed))
        }));
    }, []);

    const consumeStoredTime = useCallback((seconds) => {
        setGameState(prev => {
            // --- TALENT: Flux Capacitor ---
            const fluxCapLevel = prev.talents?.['flux_capacitor'] || 0;
            const discount = fluxCapLevel * 0.04; // 4% per level
            const effectiveCost = seconds * (1 - discount); // e.g. 0.96s cost for 1s warp

            const nextStored = Math.max(0, prev.storedTime - effectiveCost);
            const stillWarping = nextStored > 0 && prev.isWarping;

            // Safeguard: if for some reason storedTime exceeds max (e.g. debugging/cheating), update max
            const nextMax = Math.max(prev.maxStoredTime, nextStored);

            return {
                ...prev,
                storedTime: nextStored,
                maxStoredTime: nextMax,
                isWarping: stillWarping
            };
        });
    }, []);

    const dismissTimeShift = useCallback(() => {
        setGameState(prev => ({ ...prev, isTimeShiftDismissed: true }));
    }, []);

    const restoreTimeShift = useCallback(() => {
        setGameState(prev => ({ ...prev, isTimeShiftDismissed: false }));
    }, []);

    return (
        <GameContext.Provider value={{
            gameState, tick, manualClick, buyGenerator, getGeneratorCost,
            saveGame, hardReset, calculateMultiplier, getNextMilestone,
            getGeneratorProduction, calculateProduction, toggleFPS,
            getBasePeriod, buyResearch, buyTalent, respecTalents,
            claimOfflineTime, toggleTimeWarp, setWarpSpeed, consumeStoredTime,
            dismissTimeShift, restoreTimeShift
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);
