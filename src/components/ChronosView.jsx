import React from 'react';
import { useGame } from '../game/gameState';
import { TimeShiftPanel } from './TimeShiftControls';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Clock, History, RotateCcw } from 'lucide-react';

const ChronosView = () => {
    const { gameState, restoreTimeShift } = useGame();
    const { isTimeShiftDismissed, storedTime, isWarping } = gameState;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 pb-20 fade-in-animation h-full overflow-y-auto">
            {/* Main Control Panel */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Temporal Engine</h2>
                    {isTimeShiftDismissed && (storedTime > 0 || isWarping) && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={restoreTimeShift}
                            className="text-xs"
                        >
                            <RotateCcw className="w-3 h-3 mr-2" />
                            Restore Popup Control
                        </Button>
                    )}
                </div>

                <TimeShiftPanel />
            </div>

            {/* Educational / Lore Section (Standard Shadcn Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            How it works
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>The Temporal Engine allows you to condense offline time into "Stored Flux".</p>
                        <p>This Flux can be consumed to accelerate the game's simulation speed, allowing for rapid progress when active.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <History className="w-4 h-4" />
                            Offline Sync
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>Any time spent away from the void is automatically detected upon your return.</p>
                        <p>Always remember to sync your timeline to maintain maximum efficiency.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ChronosView;
