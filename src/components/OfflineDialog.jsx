import React from 'react';
import { useGame } from '../game/gameState';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from "./ui/alert-dialog"
import { Clock } from 'lucide-react';
import { formatTime } from '../utils/formatUtils';

const OfflineDialog = () => {
    const { gameState, claimOfflineTime } = useGame();
    const { offlineGap } = gameState;

    const isOpen = offlineGap > 0;

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Offline Progress</span>
                    </div>
                    <AlertDialogTitle>Welcome Back!</AlertDialogTitle>
                    <AlertDialogDescription>
                        You were away for {formatTime(offlineGap)}. Your stored time flux has been captured.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="py-6">
                    <div className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center">
                        <span className="text-sm text-muted-foreground mb-1">Time Accumulated</span>
                        <span className="text-3xl font-mono font-bold tracking-tight">
                            {formatTime(offlineGap)}
                        </span>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={claimOfflineTime}
                        className="w-full"
                    >
                        Sync Timeline
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default OfflineDialog;
