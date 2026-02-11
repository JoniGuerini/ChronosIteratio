import { useEffect, useRef } from 'react';
import { useGame } from '../game/gameState';

export const useGameLoop = () => {
    const { tick, gameState, consumeStoredTime } = useGame();
    const { isWarping, warpSpeed, storedTime } = gameState;
    const requestRef = useRef();
    const previousTimeRef = useRef();
    const lastRenderTimeRef = useRef(0);

    const RENDER_INTERVAL = 1000 / 30; // 30 FPS for UI updates (Smoother animations)

    const animate = time => {
        if (previousTimeRef.current != undefined) {
            let realDeltaTime = (time - previousTimeRef.current) / 1000; // Convert to seconds

            // Limit realDeltaTime to avoid infinite loops or extreme edge cases,
            // but allow large jumps for background progress (up to 1 hour)
            if (realDeltaTime > 3600) realDeltaTime = 3600;

            let simulatedDeltaTime = realDeltaTime;

            if (isWarping && storedTime > 0) {
                // Apply Warp
                simulatedDeltaTime = realDeltaTime * warpSpeed;

                // Extra time we are simulating beyond reality
                const extraTime = simulatedDeltaTime - realDeltaTime;

                // Consume this extra time from fuel
                consumeStoredTime(extraTime);
            }

            const timeSinceLastRender = time - lastRenderTimeRef.current;

            // Always run simulation
            // Only trigger React re-render if enough time has passed
            const shouldRender = timeSinceLastRender >= RENDER_INTERVAL;

            tick(simulatedDeltaTime, shouldRender);

            if (shouldRender) {
                lastRenderTimeRef.current = time;
            }
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [tick]);
};
