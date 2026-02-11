import React, { useEffect, useState, useRef } from 'react';
import { useGame } from '../game/gameState';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const FPSCounter = () => {
    const { gameState } = useGame();
    const [fps, setFps] = useState(0);
    const [frameTime, setFrameTime] = useState(0);
    const [memory, setMemory] = useState({ used: 0, total: 0 });
    const frameCount = useRef(0);
    const lastTime = useRef(performance.now());
    const rafRef = useRef();
    const frameTimesRef = useRef([]);

    useEffect(() => {
        const loop = (time) => {
            frameCount.current++;

            // Calculate frame time
            const delta = time - lastTime.current;
            frameTimesRef.current.push(delta);

            // Keep only last 60 frames for averaging
            if (frameTimesRef.current.length > 60) {
                frameTimesRef.current.shift();
            }

            if (time - lastTime.current >= 1000) {
                setFps(Math.round(frameCount.current * 1000 / (time - lastTime.current)));

                // Calculate average frame time
                const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
                setFrameTime(avgFrameTime);

                // Get memory info (Chrome only)
                if (performance.memory) {
                    setMemory({
                        used: performance.memory.usedJSHeapSize / (1024 * 1024),
                        total: performance.memory.jsHeapSizeLimit / (1024 * 1024)
                    });
                }

                frameCount.current = 0;
                lastTime.current = time;
            }
            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    // Determine color based on FPS
    let colorClass = "text-red-500";
    if (fps >= 60) colorClass = "text-green-500";
    else if (fps >= 30) colorClass = "text-yellow-500";

    // Estimate CPU load based on frame time and actual FPS
    // If FPS is high, target frame time is lower
    const targetFrameTime = fps > 0 ? 1000 / fps : 16.67; // Use actual FPS or fallback to 60 FPS
    const cpuLoad = Math.min(100, (frameTime / targetFrameTime) * 100);

    if (!gameState.showFPS) return null;

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center justify-center px-2 py-1 bg-secondary/50 border border-border rounded-md shadow-sm backdrop-blur-sm min-w-[60px] cursor-help hover:border-primary/50 transition-colors">
                        <span className={`font-mono text-xs font-bold ${colorClass} transition-colors duration-300`}>
                            {fps} <span className="text-[10px] text-muted-foreground ml-0.5">FPS</span>
                        </span>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="p-4 bg-popover border-primary/20">
                    <div className="flex flex-col gap-2 min-w-[200px] font-mono text-xs">
                        <div className="flex flex-col gap-0.5 pb-2 border-b border-border/50">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Performance Stats</span>
                        </div>

                        <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5">
                            <span className="text-muted-foreground">FPS</span>
                            <span className={`font-bold ${colorClass}`}>
                                {fps}
                            </span>

                            <span className="text-muted-foreground">Frame Time</span>
                            <span className="text-foreground">
                                {frameTime.toFixed(2)}ms
                            </span>

                            <span className="text-muted-foreground">CPU Est</span>
                            <span className={`font-bold ${cpuLoad < 50 ? 'text-green-500' : cpuLoad < 80 ? 'text-yellow-500' : 'text-red-400'}`}>
                                {cpuLoad.toFixed(0)}%
                            </span>

                            {performance.memory && (
                                <>
                                    <span className="text-muted-foreground">RAM Used</span>
                                    <span className="text-foreground">
                                        {memory.used.toFixed(0)}MB
                                    </span>

                                    <span className="text-muted-foreground">RAM Limit</span>
                                    <span className="text-muted-foreground/70">
                                        {memory.total.toFixed(0)}MB
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="h-px bg-border/50 my-1"></div>
                        <div className="text-[9px] text-muted-foreground/50 text-center">
                            Browser API limitations apply
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default FPSCounter;
