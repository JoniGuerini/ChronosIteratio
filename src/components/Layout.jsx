import React from 'react';
import { useGame } from '../game/gameState';
import { Button } from "@/components/ui/button";
import { formatNumber, formatTime } from '../utils/formatUtils';

import FPSCounter from './FPSCounter';

const SaveControls = () => {
    const game = useGame();

    // Graceful fallback if context isn't available
    if (!game) return null;

    const { saveGame, hardReset } = game;

    return (
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={saveGame} className="border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300">
                Save
            </Button>
            <Button variant="destructive" size="sm" onClick={hardReset} className="opacity-80 hover:opacity-100">
                Reset
            </Button>
        </div>
    );
};

const HeaderResourceDisplay = () => {
    const game = useGame();
    if (!game) return null;
    const { gameState, calculateProduction } = game;

    // Calculate production per second for display
    const productionPerSecond = calculateProduction();

    return (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none flex items-center gap-6">
            {/* Main Integer Display (Iterons) */}
            <div className="flex items-center gap-3">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground drop-shadow-md font-mono">
                    {formatNumber(gameState.iterons, { growthRate: productionPerSecond })}
                </h1>

                {/* Velocity / Rate Display */}
                <div className="flex flex-col items-start leading-none opacity-80">
                    <div className="text-sm font-bold text-primary">
                        {(() => {
                            // Safely get period, default to 10 for Gen 0 (Iterons) if missing
                            const rawPeriod = (game.getBasePeriod && game.getBasePeriod(0)) || 10;
                            // Round to prevent floating point artifacts like 3.999999999999999
                            const period = Math.round(rawPeriod * 100) / 100;
                            const yieldPerCycle = productionPerSecond.times(period);

                            return period > 1 ? (
                                <>
                                    +{formatNumber(yieldPerCycle)}
                                    <span className="text-xs font-normal opacity-70"> / {formatTime(period)}</span>
                                </>
                            ) : (
                                <>+{formatNumber(productionPerSecond)}/s</>
                            );
                        })()}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                        Iterons
                    </div>
                </div>
            </div>

            {/* Secondary Display (Insights) */}
            {(gameState.insight.gt(0) || gameState.generators[0].amount.gte(10)) && (
                <div className="flex items-center gap-2 border-l border-border/30 pl-6">
                    <div className="flex flex-col items-end leading-none">
                        <span className="text-xl font-bold text-purple-400 font-mono">
                            {formatNumber(gameState.insight)}
                        </span>
                        <span className="text-[9px] text-purple-400 font-bold uppercase tracking-widest">
                            Insights
                        </span>
                    </div>
                </div>
            )}

            {/* Talent Resources (Focus & Flux) */}
            {(gameState.focus?.gt(0) || gameState.activeTime > 0) && (
                <div className="flex items-center gap-2 border-l border-border/30 pl-6">
                    <div className="flex flex-col items-end leading-none">
                        <span className="text-xl font-bold text-blue-400 font-mono">
                            {formatNumber(gameState.focus || 0)}
                        </span>
                        <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest leading-none">
                            Focus
                        </span>
                    </div>
                </div>
            )}

            {gameState.flux?.gt(0) && (
                <div className="flex items-center gap-2 border-l border-border/30 pl-6">
                    <div className="flex flex-col items-end leading-none">
                        <span className="text-xl font-bold text-amber-500 font-mono">
                            {formatNumber(gameState.flux || 0)}
                        </span>
                        <span className="text-[9px] text-amber-500 font-bold uppercase tracking-widest leading-none">
                            Flux
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

const Layout = ({ children }) => {
    return (
        <div className="h-screen w-screen bg-background text-foreground font-sans flex flex-col relative overflow-hidden">
            {/* Header - Fixed */}
            <header className="flex-none w-full px-8 py-4 flex justify-between items-center z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
                <div className="text-left z-10">
                    <h1 className="text-xl font-extrabold tracking-tight text-primary select-none">
                        Chronos Iteratio
                    </h1>
                </div>

                {/* Center Display */}
                <HeaderResourceDisplay />

                {/* Desktop Controls: Top Right */}
                <div className="hidden md:flex z-10 w-[200px] justify-end items-center">
                    <FPSCounter />
                </div>
            </header>

            {/* Main Content - Full Screen */}
            {/* Main Content - Takes remaining space */}
            <div className="flex-1 w-full relative z-10 overflow-hidden">
                <main className="h-full w-full">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
