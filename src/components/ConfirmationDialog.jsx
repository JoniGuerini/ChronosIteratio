
import React from 'react';
import { Button } from "@/components/ui/button";

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card border border-border text-card-foreground rounded-xl shadow-lg max-w-md w-full p-6 relative">
                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    {message}
                </p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={() => {
                        onConfirm();
                        onClose();
                    }}>
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
