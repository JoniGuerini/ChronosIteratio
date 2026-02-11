import React from 'react';
import Decimal from 'break_eternity.js'; // Ensure Decimal is imported
import { formatNumber, formatTime } from '../utils/formatUtils';

const DocumentationView = () => {
    // Reconstruct generator data based on gameState logic
    const generators = Array.from({ length: 50 }, (_, i) => {
        const basePeriod = 5 * (i + 1) * (i + 2);

        return {
            id: i,
            name: `Generator ${i + 1}`,
            costBase: new Decimal(50).pow(i).ceil(),
            increment: i + 1,
            basePayout: new Decimal(1), // Fixed payout of 1 per batch
            basePeriod: basePeriod
        };
    });

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto p-6 space-y-6 fade-in-animation overflow-y-auto">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                        <path d="M16 13H8" />
                        <path d="M16 17H8" />
                        <path d="M10 9H8" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Generator Specifications</h2>
                    <p className="text-muted-foreground text-sm">
                        Detailed technical data for all generator tiers.
                    </p>
                </div>
            </div>



            <div className="border rounded-lg bg-card overflow-hidden">
                <div className="overflow-x-auto max-h-[70vh] overflow-y-auto scrollbar-hide pb-32">
                    <table className="w-full text-sm text-left relative">
                        <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs sticky top-0 z-10 backdrop-blur-md shadow-sm">
                            <tr>
                                <th className="px-4 py-3 bg-muted/90">Tier</th>
                                <th className="px-4 py-3 bg-muted/90">Base Cost</th>
                                <th className="px-4 py-3 bg-muted/90">Increment Rate</th>
                                <th className="px-4 py-3 bg-muted/90">Cycle Period</th>
                                <th className="px-4 py-3 text-right bg-muted/90">Yield</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {generators.map((gen) => (
                                <tr key={gen.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-4 py-3 font-mono font-medium text-foreground">
                                        {gen.name}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-muted-foreground">
                                        {formatNumber(gen.costBase)}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-yellow-500">
                                        +{gen.increment}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-muted-foreground">
                                        {formatTime(gen.basePeriod)}
                                    </td>
                                    <td className="px-4 py-3 font-mono font-bold text-primary text-right">
                                        {formatNumber(gen.basePayout)} / cycle
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground bg-muted/20 p-4 rounded-lg border border-border/50">
                <div>
                    <strong className="block text-foreground mb-1">Cost Formula:</strong>
                    Base + (Increment × Triangle Number of Owned)
                </div>
                <div>
                    <strong className="block text-foreground mb-1">Batch Production:</strong>
                    Generators produce 1 unit every Period. No partial production.
                </div>
                <div className="md:col-span-2 border-t border-border/50 pt-2 mt-2">
                    <strong className="block text-foreground mb-1">Research Synergy:</strong>
                    <span className="text-primary font-bold">Overclock</span> reduces cycle time.
                    <span className="text-yellow-500 font-bold">Normalization</span> increases yield (+100% per level).
                </div>
            </div>
        </div>
    );
};

export default DocumentationView;
