import Decimal from 'break_eternity.js';

export const MISSION_TYPES = {
    COLLECT_FRAGMENTS: 'collect_fragments',
    REACH_MILESTONES: 'reach_milestones',
    STABILITY_TIME: 'stability_time'
};

export const MISSIONS = [
    // TIER 1: Rank 1-10 (Introductory)
    {
        id: 'initial_sync',
        name: 'Initial Synchronization',
        type: MISSION_TYPES.REACH_MILESTONES,
        minRank: 1,
        description: 'Establish basic resonance by reaching 5 combined Milestones.',
        target: new Decimal(5),
        reward: { type: 'insight', amount: new Decimal(2), label: '2 Insights' }
    },
    {
        id: 'fragment_start',
        name: 'Quantum Collection',
        type: MISSION_TYPES.COLLECT_FRAGMENTS,
        minRank: 1,
        description: 'Accumulate 250 Eternity Fragments to stabilize the core.',
        target: new Decimal(250),
        reward: { type: 'reservoir', amount: new Decimal(500), label: '500 Fragments' }
    },
    {
        id: 'milestone_15',
        name: 'Steady Pulse',
        type: MISSION_TYPES.REACH_MILESTONES,
        minRank: 1,
        description: 'Reach a combined total of 10 Milestones.',
        target: new Decimal(10),
        reward: { type: 'insight', amount: new Decimal(2), label: '2 Insights' }
    },
    {
        id: 'fragment_2500',
        name: 'Low Energy Link',
        type: MISSION_TYPES.COLLECT_FRAGMENTS,
        minRank: 1,
        description: 'Accumulate 1,000 Eternity Fragments.',
        target: new Decimal(1000),
        reward: { type: 'reservoir', amount: new Decimal(1000), label: '1k Fragments' }
    },
    {
        id: 'stability_30s',
        name: 'Micro Stability',
        type: MISSION_TYPES.STABILITY_TIME,
        minRank: 1,
        description: 'Maintain stability for 10 consecutive seconds.',
        target: new Decimal(10),
        reward: { type: 'insight', amount: new Decimal(1), label: '1 Insight' }
    },
    {
        id: 'fragment_5000',
        name: 'Mid-Tier Collection',
        type: MISSION_TYPES.COLLECT_FRAGMENTS,
        minRank: 1,
        description: 'Accumulate 2,000 Eternity Fragments.',
        target: new Decimal(2000),
        reward: { type: 'reservoir', amount: new Decimal(1500), label: '1.5k Fragments' }
    },
    {
        id: 'milestone_20',
        name: 'Growth Spurt',
        type: MISSION_TYPES.REACH_MILESTONES,
        minRank: 1,
        description: 'Reach a combined total of 12 Milestones.',
        target: new Decimal(12),
        reward: { type: 'insight', amount: new Decimal(2), label: '2 Insights' }
    },
    {
        id: 'fragment_15k',
        name: 'Early Surplus',
        type: MISSION_TYPES.COLLECT_FRAGMENTS,
        minRank: 1,
        description: 'Accumulate 3,500 Eternity Fragments.',
        target: new Decimal(3500),
        reward: { type: 'reservoir', amount: new Decimal(3000), label: '3k Fragments' }
    },
    {
        id: 'milestone_30',
        name: 'Rising Resonance',
        type: MISSION_TYPES.REACH_MILESTONES,
        minRank: 1,
        description: 'Reach a combined total of 15 Milestones.',
        target: new Decimal(15),
        reward: { type: 'insight', amount: new Decimal(4), label: '4 Insights' }
    },
    {
        id: 'milestone_25',
        name: 'Harmonic Growth',
        type: MISSION_TYPES.REACH_MILESTONES,
        minRank: 1,
        description: 'Reach a combined total of 18 Milestones.',
        target: new Decimal(18),
        reward: { type: 'insight', amount: new Decimal(3), label: '3 Insights' }
    },
    {
        id: 'fragment_10k',
        name: 'Energy Condensation',
        type: MISSION_TYPES.COLLECT_FRAGMENTS,
        minRank: 1,
        description: 'Accumulate 5,000 Eternity Fragments.',
        target: new Decimal(5000),
        reward: { type: 'reservoir', amount: new Decimal(2500), label: '2.5k Fragments' }
    },
    {
        id: 'stability_60s',
        name: 'Short Burst',
        type: MISSION_TYPES.STABILITY_TIME,
        minRank: 1,
        description: 'Maintain stability for 20 consecutive seconds.',
        target: new Decimal(20),
        reward: { type: 'insight', amount: new Decimal(2), label: '2 Insights' }
    },

    // Rank 2 additions
    {
        id: 'fragment_25k',
        name: 'Quarter Collection',
        type: MISSION_TYPES.COLLECT_FRAGMENTS,
        minRank: 2,
        description: 'Accumulate 10,000 Eternity Fragments.',
        target: new Decimal(10000),
        reward: { type: 'reservoir', amount: new Decimal(5000), label: '5k Fragments' }
    },
    {
        id: 'milestone_40',
        name: 'Solid Foundation',
        type: MISSION_TYPES.REACH_MILESTONES,
        minRank: 2,
        description: 'Reach a combined total of 25 Milestones.',
        target: new Decimal(25),
        reward: { type: 'insight', amount: new Decimal(4), label: '4 Insights' }
    },
    {
        id: 'milestone_50',
        name: 'Structural Integrity',
        type: MISSION_TYPES.REACH_MILESTONES,
        minRank: 2,
        description: 'Reach a combined total of 30 Milestones.',
        target: new Decimal(30),
        reward: { type: 'insight', amount: new Decimal(5), label: '5 Insights' }
    },
    {
        id: 'fragment_50k',
        name: 'Storage Expansion',
        type: MISSION_TYPES.COLLECT_FRAGMENTS,
        minRank: 2,
        description: 'Accumulate 50,000 Eternity Fragments.',
        target: new Decimal(50000),
        reward: { type: 'reservoir', amount: new Decimal(10000), label: '10k Fragments' }
    },
    {
        id: 'stability_intro',
        name: 'Brief Resonance',
        type: MISSION_TYPES.STABILITY_TIME,
        minRank: 2,
        description: 'Maintain stability for 60 consecutive seconds.',
        target: new Decimal(60),
        reward: { type: 'insight', amount: new Decimal(5), label: '5 Insights' }
    },
    {
        id: 'fragment_75k',
        name: 'High Capacity',
        type: MISSION_TYPES.COLLECT_FRAGMENTS,
        minRank: 2,
        description: 'Accumulate 25,000 Eternity Fragments.',
        target: new Decimal(25000),
        reward: { type: 'reservoir', amount: new Decimal(15000), label: '15k Fragments' }
    },
    {
        id: 'stability_90s',
        name: 'Standard Pulse',
        type: MISSION_TYPES.STABILITY_TIME,
        minRank: 2,
        description: 'Maintain stability for 45 consecutive seconds.',
        target: new Decimal(45),
        reward: { type: 'insight', amount: new Decimal(3), label: '3 Insights' }
    },
    {
        id: 'fragment_100k',
        name: 'Century Collection',
        type: MISSION_TYPES.COLLECT_FRAGMENTS,
        minRank: 2,
        description: 'Accumulate 50,000 Eternity Fragments.',
        target: new Decimal(50000),
        reward: { type: 'reservoir', amount: new Decimal(20000), label: '20k Fragments' }
    },

    // Rank 3 additions
    {
        id: 'fragment_250k',
        name: 'Flux Accumulation',
        type: MISSION_TYPES.COLLECT_FRAGMENTS,
        minRank: 3,
        description: 'Accumulate 100,000 Eternity Fragments.',
        target: new Decimal(100000),
        reward: { type: 'reservoir', amount: new Decimal(50000), label: '50k Fragments' }
    },
    {
        id: 'milestone_60',
        name: 'Complex resonance',
        type: MISSION_TYPES.REACH_MILESTONES,
        minRank: 3,
        description: 'Reach a combined total of 40 Milestones.',
        target: new Decimal(40),
        reward: { type: 'insight', amount: new Decimal(6), label: '6 Insights' }
    },
    {
        id: 'stability_180s',
        name: 'Sustained Flow',
        type: MISSION_TYPES.STABILITY_TIME,
        minRank: 3,
        description: 'Maintain stability for 90 consecutive seconds.',
        target: new Decimal(90),
        reward: { type: 'insight', amount: new Decimal(8), label: '8 Insights' }
    },
    {
        id: 'milestone_75',
        name: 'Iterative Prowess',
        type: MISSION_TYPES.REACH_MILESTONES,
        minRank: 3,
        description: 'Reach a combined total of 50 Milestones.',
        target: new Decimal(50),
        reward: { type: 'insight', amount: new Decimal(8), label: '8 Insights' }
    },

    // Rank 4-5 additions
    {
        id: 'fragment_1m',
        name: 'Millionaire Sync',
        type: MISSION_TYPES.COLLECT_FRAGMENTS,
        minRank: 4,
        description: 'Accumulate 1,000,000 Eternity Fragments.',
        target: new Decimal(1e6),
        reward: { type: 'insight', amount: new Decimal(10), label: '10 Insights' }
    },
    {
        id: 'stability_300s',
        name: 'Mental Endurance',
        type: MISSION_TYPES.STABILITY_TIME,
        minRank: 5,
        description: 'Maintain stability for 5 minutes.',
        target: new Decimal(300),
        reward: { type: 'insight', amount: new Decimal(15), label: '15 Insights' }
    },

    // TIER 2: Rank 11-20 (Intermediate)
    {
        id: 'intermediate_sync',
        name: 'Deeping Link',
        type: MISSION_TYPES.REACH_MILESTONES,
        minRank: 11,
        description: 'Reach a combined total of 100 Milestones.',
        target: new Decimal(100),
        reward: { type: 'insight', amount: new Decimal(25), label: '25 Insights' }
    },
    {
        id: 'fragment_surge',
        name: 'Bulk Extraction',
        type: MISSION_TYPES.COLLECT_FRAGMENTS,
        minRank: 11,
        description: 'Collect 1.00e15 Eternity Fragments.',
        target: new Decimal(1e15),
        reward: { type: 'reservoir', amount: new Decimal(1e14), label: '100T Fragments' }
    },
    {
        id: 'stable_focus',
        name: 'Prolonged Stability',
        type: MISSION_TYPES.STABILITY_TIME,
        minRank: 15,
        description: 'Maintain stability for 15 consecutive minutes.',
        target: new Decimal(900),
        reward: { type: 'insight', amount: new Decimal(50), label: '50 Insights' }
    }
];
