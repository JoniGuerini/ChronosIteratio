import React, { memo, useMemo } from 'react';
// import { useGame } from '../game/gameState'; // Removed
import Decimal from 'break_eternity.js';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


import { formatNumber, formatTime } from '../utils/formatUtils';

const GeneratorRow = ({
    generator,
    cost,
    canAfford,
    multiplier,
    nextMilestone,
    productionPerSecond,
    buyGenerator,
    basePeriod = 1, // Default to 1 if not provided
    research = {}
}) => {

    const { next, level } = nextMilestone;

    // Use amount for progress, but format it cleanly if it's large
    const nextVal = new Decimal(next);
    const currentVal = generator.amount;

    // Items per batch = Average Rate * Period
    // If rate is 0.1 and period is 10, items per batch = 1.
    const itemsPerBatch = productionPerSecond.times(basePeriod);

    // Locked State (Unowned)
    if (generator.amount.lte(0)) {
        return (
            <Card className="mb-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:bg-accent/50 transition-all">
                <CardContent className="p-0">
                    <Button
                        onClick={() => {
                            if (canAfford) buyGenerator(generator.id);
                        }}
                        variant="ghost"
                        className={`w-full h-auto py-4 px-4 flex flex-row items-center justify-center gap-8 group hover:bg-accent/10 transition-colors ${!canAfford ? 'cursor-not-allowed hover:bg-transparent' : 'cursor-pointer'}`}
                    >
                        <div className={`flex flex-col items-end gap-0.5 text-right ${!canAfford ? 'opacity-80' : 'opacity-100'}`}>
                            <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">
                                Generator {generator.id + 1}
                            </h3>
                            <span className="text-xs text-foreground font-semibold">
                                Unlock to start production
                            </span>
                        </div>

                        <div className={`h-8 w-px ${!canAfford ? 'bg-foreground/20' : 'bg-foreground/40'}`}></div>

                        <div className={`flex flex-col items-start gap-0.5 text-left ${!canAfford ? 'opacity-80' : 'opacity-100'}`}>
                            <span className="text-[10px] uppercase tracking-wider text-foreground font-bold">Unlock Cost</span>
                            <div className="flex items-center gap-2">
                                <span className={`font-mono text-lg font-bold ${canAfford ? 'text-green-500' : 'text-red-400'}`}>
                                    {formatNumber(cost)}
                                </span>
                                <span className="text-xs text-foreground uppercase font-bold">Iterons</span>
                            </div>
                        </div>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mb-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:bg-accent/50 transition-all">
            <CardContent className="p-0 flex flex-col">
                {/* Main Content Area */}
                <div className="p-3 md:p-4 flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-4 items-center">
                    {/* 1. Name - STATIC */}
                    <div className="w-full lg:col-span-2 flex items-center justify-start">
                        {useMemo(() => (
                            <h3 className="font-bold text-base md:text-lg text-foreground leading-tight">Generator {generator.id + 1}</h3>
                        ), [generator.id])}
                    </div>

                    {/* 2. Production Section */}
                    <div className="w-full lg:col-span-3 flex flex-col justify-center items-center py-1 lg:border-r border-border/10">
                        <TooltipProvider>
                            <Tooltip delayDuration={200}>
                                <TooltipTrigger asChild>
                                    <div className="flex flex-col items-center cursor-help group">
                                        <div className="text-xs md:text-sm font-medium text-foreground flex flex-wrap gap-1 justify-center group-hover:text-primary transition-colors">
                                            <span>
                                                {basePeriod === 1
                                                    ? formatNumber(productionPerSecond)
                                                    : formatNumber(itemsPerBatch)
                                                }
                                            </span>
                                            <span className="text-muted-foreground">
                                                {basePeriod === 1 ? "/s" : ` / ${formatTime(basePeriod)}`}
                                            </span>
                                            <span className="text-primary/80 text-[10px] md:text-xs ml-1">
                                                {generator.id === 0 ? "Iterons" : `Gen ${generator.id}`}
                                            </span>
                                        </div>

                                        {/* Micro Progress Bar */}
                                        {basePeriod > 1 && (
                                            <div className="w-24 md:w-32 h-0.5 bg-secondary mt-1 mb-0.5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{ width: `${Math.min(100, (generator.cycleProgress || 0) / basePeriod * 100)}%` }}
                                                />
                                            </div>
                                        )}

                                        {useMemo(() => (
                                            <span className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-wider group-hover:text-foreground/80 transition-colors">Production</span>
                                        ), [])}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="p-4 bg-popover/95 backdrop-blur-sm border-primary/20 shadow-xl">
                                    <div className="flex flex-col gap-2 min-w-[180px]">
                                        {useMemo(() => (
                                            <div className="flex flex-col gap-0.5 pb-2 border-b border-border/50">
                                                <span className="text-xs font-bold text-primary uppercase tracking-wider">Production Breakdown</span>
                                                <span className="text-[10px] text-muted-foreground">Detailed calculation for Generator {generator.id + 1}</span>
                                            </div>
                                        ), [generator.id])}

                                        <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-xs">
                                            {useMemo(() => (
                                                <span className="text-muted-foreground">Owned</span>
                                            ), [])}
                                            <span className="text-foreground font-mono font-bold">{formatNumber(generator.amount, { precision: 0 })}</span>

                                            {useMemo(() => (
                                                <span className="text-muted-foreground">Base Rate</span>
                                            ), [])}
                                            <span className="text-foreground font-mono">
                                                {basePeriod === 1
                                                    ? `${formatNumber(generator.multiplier)} / s`
                                                    : `1 / ${formatTime(basePeriod)}`}
                                            </span>

                                            {useMemo(() => (
                                                <span className="text-muted-foreground">Milestone</span>
                                            ), [])}
                                            <span className="text-purple-400 font-mono font-bold">+{generator.id + 1} Insight</span>
                                        </div>

                                        <div className="h-px bg-border/50 my-1"></div>

                                        <div className="grid grid-cols-[1fr_auto] gap-x-4 items-center">
                                            {useMemo(() => (
                                                <span className="text-xs font-bold text-foreground">
                                                    {basePeriod === 1 ? "Total Output" : "Cycle Yield"}
                                                </span>
                                            ), [basePeriod])}
                                            <div className="flex flex-col items-end leading-none">
                                                <span className="text-sm font-bold text-primary">
                                                    {basePeriod === 1
                                                        ? formatNumber(productionPerSecond)
                                                        : formatNumber(generator.amount.times(generator.multiplier))
                                                    }
                                                    <span className="text-[10px] font-normal text-muted-foreground ml-1">
                                                        {basePeriod === 1 ? "/s" : ` / ${formatTime(basePeriod)}`}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    {/* 3. Level Block */}
                    <div className="w-full lg:col-span-1 flex flex-col items-center justify-center">
                        <Badge variant="secondary" className="text-[10px] md:text-xs px-1.5 md:px-2 py-0 h-5 md:h-6 bg-primary/10 text-primary border-primary/20 pointer-events-none mb-1">
                            Lvl {level}
                        </Badge>
                        {useMemo(() => (
                            <span className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-wider">Level</span>
                        ), [])}
                    </div>

                    {/* 4. Owned Block */}
                    <div className="w-full lg:col-span-2 flex flex-col items-center justify-center">
                        <span className="text-foreground font-mono font-bold text-sm md:text-base">{formatNumber(generator.amount)}</span>
                        {useMemo(() => (
                            <span className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-wider">Owned</span>
                        ), [])}
                    </div>

                    {/* 5. Next Milestone Block */}
                    <div className="w-full lg:col-span-2 flex flex-col items-center justify-center">
                        <span className="font-mono text-foreground/80 text-[10px] md:text-xs whitespace-nowrap">
                            {formatNumber(Decimal.min(currentVal, nextVal).sub(nextMilestone.prev || 0))}<span className="opacity-50 mx-0.5">/</span>{formatNumber(nextVal.sub(nextMilestone.prev || 0))}
                        </span>
                        {useMemo(() => (
                            <div className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1 justify-center whitespace-nowrap">
                                Next: <span className="text-purple-400 font-bold">+{generator.id + 1}</span>
                            </div>
                        ), [generator.id])}
                    </div>

                    {/* 6. Action Button Block */}
                    <div className="w-full lg:col-span-2 flex justify-center lg:justify-end">
                        <Button
                            onClick={() => buyGenerator(generator.id)}
                            disabled={!canAfford}
                            variant={canAfford ? "default" : "secondary"}
                            className={`w-full max-w-[280px] h-auto py-2.5 md:py-2 px-4 flex flex-row lg:flex-col items-center justify-center gap-3 lg:gap-0 ${!canAfford && "opacity-50"
                                }`}
                        >
                            {useMemo(() => (
                                <span className="text-sm font-bold">Buy</span>
                            ), [])}
                            <div className="flex items-center gap-1.5 lg:gap-0">
                                <span className="text-xs font-mono font-bold lg:font-normal opacity-90 lg:opacity-80">
                                    {formatNumber(cost)}
                                </span>
                                <span className="text-[10px] uppercase font-bold lg:hidden">Iterons</span>
                            </div>
                        </Button>
                    </div>
                </div>

                {/* Badges Section */}
                {(research[`gen${generator.id + 1}_speed`] > 0 || research[`gen${generator.id + 1}_eff`] > 0) && (
                    <div className="flex flex-col w-full">
                        <Separator className="opacity-50" />
                        <div className="px-4 py-1.5 flex flex-wrap gap-2 bg-muted/20">
                            {research[`gen${generator.id + 1}_speed`] > 0 && (
                                <Badge variant="outline" className="text-[10px] h-5 bg-purple-500/5 text-purple-400 border-purple-500/20 pointer-events-none">
                                    Overclock Rank {research[`gen${generator.id + 1}_speed`]}
                                </Badge>
                            )}
                            {research[`gen${generator.id + 1}_eff`] > 0 && (
                                <Badge variant="outline" className="text-[10px] h-5 bg-purple-500/5 text-purple-400 border-purple-500/20 pointer-events-none">
                                    Efficiency Rank {research[`gen${generator.id + 1}_eff`]}
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card >
    );
};

const arePropsEqual = (prevProps, nextProps) => {
    // Check primitive props
    if (prevProps.canAfford !== nextProps.canAfford) return false;

    // Check generator state (amount/bought/cycleProgress)
    if (!prevProps.generator.amount.eq(nextProps.generator.amount)) return false;
    if (prevProps.generator.cycleProgress !== nextProps.generator.cycleProgress) return false;

    // Check derived values that are Decimals
    if (!prevProps.cost.eq(nextProps.cost)) return false;
    if (!prevProps.productionPerSecond.eq(nextProps.productionPerSecond)) return false;
    if (!prevProps.multiplier.eq(nextProps.multiplier)) return false;

    // Check research equality (this is shallow but sufficient for this object structure)
    const prevSpeed = prevProps.research[`gen${prevProps.generator.id + 1}_speed`] || 0;
    const nextSpeed = nextProps.research[`gen${nextProps.generator.id + 1}_speed`] || 0;
    if (prevSpeed !== nextSpeed) return false;

    const prevEff = prevProps.research[`gen${prevProps.generator.id + 1}_eff`] || 0;
    const nextEff = nextProps.research[`gen${nextProps.generator.id + 1}_eff`] || 0;
    if (prevEff !== nextEff) return false;

    return true;
};

export default memo(GeneratorRow, arePropsEqual);
