import React, { useState, useEffect, useRef } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const PerformanceMonitor = () => {
    const [fps, setFps] = useState(0);
    const [frameTime, setFrameTime] = useState(0);
    const [memory, setMemory] = useState({ used: 0, total: 0 });
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());
    const frameTimesRef = useRef([]);

    useEffect(() => {
        let animationId;

        const measurePerformance = (currentTime) => {
            frameCountRef.current++;

            const delta = currentTime - lastTimeRef.current;
            frameTimesRef.current.push(delta);

            if (frameTimesRef.current.length > 60) {
                frameTimesRef.current.shift();
            }

            lastTimeRef.current = currentTime;

            const elapsed = currentTime - (window.performanceStartTime || 0);
            if (elapsed >= 1000 || !window.performanceStartTime) {
                window.performanceStartTime = currentTime;

                const currentFps = frameCountRef.current;
                setFps(currentFps);
                frameCountRef.current = 0;

                const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
                setFrameTime(avgFrameTime);

                if (performance.memory) {
                    setMemory({
                        used: performance.memory.usedJSHeapSize / (1024 * 1024),
                        total: performance.memory.jsHeapSizeLimit / (1024 * 1024)
                    });
                }
            }

            animationId = requestAnimationFrame(measurePerformance);
        };

        animationId = requestAnimationFrame(measurePerformance);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, []);

    const targetFrameTime = 1000 / 180;
    const cpuLoad = Math.min(100, (frameTime / targetFrameTime) * 100);

    return (
        <div className="fixed top-4 right-4 z-[100]">
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="bg-black/90 backdrop-blur-sm border border-primary/30 rounded-md px-3 py-1.5 font-mono text-sm cursor-help hover:border-primary/50 transition-colors">
                            <span className={`font-bold ${fps >= 170 ? 'text-green-500' : fps >= 120 ? 'text-yellow-500' : 'text-red-400'}`}>
                                {fps}
                            </span>
                            <span className="text-muted-foreground ml-1">FPS</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="p-4 bg-popover border-primary/20">
                        <div className="flex flex-col gap-2 min-w-[200px] font-mono text-xs">
                            <div className="flex flex-col gap-0.5 pb-2 border-b border-border/50">
                                <span className="text-xs font-bold text-primary uppercase tracking-wider">Performance Stats</span>
                            </div>

                            <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5">
                                <span className="text-muted-foreground">FPS</span>
                                <span className={`font-bold ${fps >= 170 ? 'text-green-500' : fps >= 120 ? 'text-yellow-500' : 'text-red-400'}`}>
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
        </div>
    );
};

export default PerformanceMonitor;
