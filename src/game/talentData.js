import Decimal from 'break_eternity.js';

export const TALENT_CURRENCIES = {
    FOCUS: 'focus',
    FLUX: 'flux'
};

export const TALENT_DATA = [
    // --- FOCUS PATH (ACTIVE) ---
    {
        id: 'active_resonance',
        name: 'Active Resonance',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'Increases all generator production while online.',
        maxLevel: 20,
        position: { x: -2.0, y: 1 },
        getCost: (level) => new Decimal(5).times(Decimal.pow(1.5, level)).floor(),
        getEffect: (level) => new Decimal(1).add(new Decimal(0.1).times(level)), // +10% per level
        getEffectDisplay: (level) => `+${(level * 10).toFixed(0)}% Production`,
        icon: 'Zap'
    },
    {
        id: 'kinetic_clique',
        name: 'Kinetic Link',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'Manual clicks also grant a small burst of progress to Generator 1.',
        maxLevel: 10,
        position: { x: -3.5, y: 2 },
        getCost: (level) => new Decimal(10).times(Decimal.pow(2, level)).floor(),
        getEffect: (level) => level * 0.1, // 10% of 1 second per level
        getEffectDisplay: (level) => `+${(level * 0.1).toFixed(1)}s Progress`,
        icon: 'MousePointer2'
    },
    {
        id: 'precision_burst',
        name: 'Precision Burst',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'Increases the effectiveness of manual clicks on all generators.',
        maxLevel: 15,
        position: { x: -2.0, y: 2 },
        getCost: (level) => new Decimal(75).times(Decimal.pow(2.2, level)).floor(),
        getEffect: (level) => 1 + (level * 0.08), // +8% click power per level
        getEffectDisplay: (level) => `+${(level * 8).toFixed(0)}% Click Power`,
        icon: 'Crosshair'
    },
    {
        id: 'focus_flow',
        name: 'Focus Flow',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'Gain a small amount of Focus when generators tick while online.',
        maxLevel: 10,
        position: { x: -0.5, y: 2 },
        getCost: (level) => new Decimal(12).times(Decimal.pow(2, level)).floor(),
        getEffect: (level) => level * 0.005,
        getEffectDisplay: (level) => `+${(level * 0.5).toFixed(1)}% Tick→Focus`,
        icon: 'Droplets'
    },
    {
        id: 'focus_mastery',
        name: 'Focus Mastery',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'Reduces the time required to earn Focus.',
        maxLevel: 5,
        position: { x: -3.5, y: 3 },
        getCost: (level) => new Decimal(50).times(Decimal.pow(3, level)).floor(),
        getEffect: (level) => 60 - (level * 5), // Reduces 60s base by 5s per level
        getEffectDisplay: (level) => `${60 - (level * 5)}s / Focus`,
        icon: 'Target'
    },
    {
        id: 'peak_performance',
        name: 'Peak Performance',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'While online, generators gain a stacking bonus the longer you stay active.',
        maxLevel: 10,
        position: { x: -2.0, y: 3 },
        getCost: (level) => new Decimal(150).times(Decimal.pow(2.5, level)).floor(),
        getEffect: (level) => level * 0.02, // +2% per level (max 20% bonus cap)
        getEffectDisplay: (level) => `+${(level * 2).toFixed(0)}% Streak Bonus`,
        icon: 'TrendingUp'
    },
    {
        id: 'click_synergy',
        name: 'Click Synergy',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'Clicks on different generators stack a short bonus.',
        maxLevel: 10,
        position: { x: -0.5, y: 3 },
        getCost: (level) => new Decimal(18).times(Decimal.pow(2.1, level)).floor(),
        getEffect: (level) => level * 0.02,
        getEffectDisplay: (level) => `+${(level * 2).toFixed(0)}% Synergy`,
        icon: 'Hand'
    },
    {
        id: 'focus_attunement',
        name: 'Focus Attunement',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'Increases production of Generator 1 specifically while online.',
        maxLevel: 15,
        position: { x: -3.5, y: 5 },
        getCost: (level) => new Decimal(60).times(Decimal.pow(2.2, level)).floor(),
        getEffect: (level) => 1 + (level * 0.06),
        getEffectDisplay: (level) => `+${(level * 6).toFixed(0)}% Gen 1`,
        icon: 'Radio'
    },
    {
        id: 'double_tap',
        name: 'Double Tap',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'Chance for clicks to count twice.',
        maxLevel: 10,
        position: { x: -2.0, y: 5 },
        getCost: (level) => new Decimal(70).times(Decimal.pow(2.3, level)).floor(),
        getEffect: (level) => level * 0.015,
        getEffectDisplay: (level) => `${(level * 1.5).toFixed(1)}% Double Click`,
        icon: 'HandMetal'
    },
    {
        id: 'mind_spike',
        name: 'Mind Spike',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'First generator gains bonus from Focus spent this session.',
        maxLevel: 10,
        position: { x: -0.5, y: 5 },
        getCost: (level) => new Decimal(130).times(Decimal.pow(2.5, level)).floor(),
        getEffect: (level) => level * 0.01,
        getEffectDisplay: (level) => `+${(level * 1).toFixed(0)}% per Focus spent`,
        icon: 'Brain'
    },
    {
        id: 'resonance_peak',
        name: 'Resonance Peak',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'Further reduces Focus cooldown when combined with Focus Mastery.',
        maxLevel: 5,
        position: { x: -3.5, y: 6 },
        getCost: (level) => new Decimal(120).times(Decimal.pow(3, level)).floor(),
        getEffect: (level) => 5 - level, // extra -1s per level (stacks with focus_mastery)
        getEffectDisplay: (level) => `-${level}s Extra / Focus`,
        icon: 'Gauge'
    },
    {
        id: 'sustained_surge',
        name: 'Sustained Surge',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'Increases the maximum streak bonus cap from Peak Performance.',
        maxLevel: 10,
        position: { x: -2.0, y: 6 },
        getCost: (level) => new Decimal(180).times(Decimal.pow(2.4, level)).floor(),
        getEffect: (level) => 0.1 + (level * 0.03), // +3% cap per level (base 10% extra cap)
        getEffectDisplay: (level) => `+${(10 + level * 3).toFixed(0)}% Max Streak`,
        icon: 'Activity'
    },
    {
        id: 'momentum',
        name: 'Momentum',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'Consecutive clicks within 2s increase click power.',
        maxLevel: 10,
        position: { x: -0.5, y: 6 },
        getCost: (level) => new Decimal(160).times(Decimal.pow(2.4, level)).floor(),
        getEffect: (level) => level * 0.025,
        getEffectDisplay: (level) => `+${(level * 2.5).toFixed(1)}% per Stack`,
        icon: 'Wind'
    },
    {
        id: 'critical_focus',
        name: 'Critical Focus',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'Chance for manual clicks to grant a burst of Focus progress.',
        maxLevel: 10,
        position: { x: -4.0, y: 8 },
        getCost: (level) => new Decimal(200).times(Decimal.pow(2.5, level)).floor(),
        getEffect: (level) => level * 0.02, // 2% chance per level
        getEffectDisplay: (level) => `${(level * 2).toFixed(0)}% Click→Focus Chance`,
        icon: 'Dice5'
    },
    {
        id: 'overclock',
        name: 'Overclock',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'While at max streak, production gets an additional multiplier.',
        maxLevel: 5,
        position: { x: -2.7, y: 8 },
        getCost: (level) => new Decimal(300).times(Decimal.pow(3, level)).floor(),
        getEffect: (level) => 1 + (level * 0.05), // +5% at max streak per level
        getEffectDisplay: (level) => `+${(level * 5).toFixed(0)}% at Max Streak`,
        icon: 'Flame'
    },
    {
        id: 'clarity_burst',
        name: 'Clarity Burst',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'Every 10th Focus earned grants a production burst.',
        maxLevel: 5,
        position: { x: -1.3, y: 8 },
        getCost: (level) => new Decimal(250).times(Decimal.pow(3, level)).floor(),
        getEffect: (level) => 1 + (level * 0.08),
        getEffectDisplay: (level) => `+${(level * 8).toFixed(0)}% Burst Bonus`,
        icon: 'Lightbulb'
    },
    {
        id: 'apex',
        name: 'Apex',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'At max Momentum stacks, next click is critical.',
        maxLevel: 5,
        position: { x: 0.0, y: 8 },
        getCost: (level) => new Decimal(320).times(Decimal.pow(3, level)).floor(),
        getEffect: (level) => 1.5 + (level * 0.1),
        getEffectDisplay: (level) => `${(150 + level * 10).toFixed(0)}% Crit Mult`,
        icon: 'Crown'
    },

    // --- FLUX PATH (PASSIVE) ---
    {
        id: 'temporal_dilation',
        name: 'Temporal Dilation',
        path: TALENT_CURRENCIES.FLUX,
        description: 'Earn more offline time than the actual time passed.',
        maxLevel: 20,
        position: { x: 2.0, y: 1 },
        getCost: (level) => new Decimal(5).times(Decimal.pow(1.5, level)).floor(),
        getEffect: (level) => 1 + (level * 0.05), // +5% per level
        getEffectDisplay: (level) => `${((1 + level * 0.05) * 100).toFixed(0)}% Ratio`,
        icon: 'Hourglass'
    },
    {
        id: 'flux_capacitor',
        name: 'Flux Capacitor',
        path: TALENT_CURRENCIES.FLUX,
        description: 'Reduces stored time consumption while warping.',
        maxLevel: 10,
        position: { x: 0.5, y: 2 },
        getCost: (level) => new Decimal(15).times(Decimal.pow(2, level)).floor(),
        getEffect: (level) => 1 - (level * 0.04), // -4% consumption per level (max 40%)
        getEffectDisplay: (level) => `${(level * 4).toFixed(0)}% Efficiency`,
        icon: 'BatteryCharging'
    },
    {
        id: 'time_bank',
        name: 'Time Bank',
        path: TALENT_CURRENCIES.FLUX,
        description: 'Increases the maximum stored time you can use for warping.',
        maxLevel: 10,
        position: { x: 2.0, y: 2 },
        getCost: (level) => new Decimal(80).times(Decimal.pow(2.3, level)).floor(),
        getEffect: (level) => 1 + (level * 0.1), // +10% cap per level
        getEffectDisplay: (level) => `+${(level * 10).toFixed(0)}% Warp Cap`,
        icon: 'Clock'
    },
    {
        id: 'stasis',
        name: 'Stasis',
        path: TALENT_CURRENCIES.FLUX,
        description: 'Offline progress decays slightly slower.',
        maxLevel: 10,
        position: { x: 3.5, y: 2 },
        getCost: (level) => new Decimal(20).times(Decimal.pow(2, level)).floor(),
        getEffect: (level) => 1 - (level * 0.02),
        getEffectDisplay: (level) => `-${(level * 2).toFixed(0)}% Decay`,
        icon: 'Snowflake'
    },
    {
        id: 'warp_efficiency',
        name: 'Warp Efficiency',
        path: TALENT_CURRENCIES.FLUX,
        description: 'Warp consumes less stored time per second.',
        maxLevel: 10,
        position: { x: 0.5, y: 3 },
        getCost: (level) => new Decimal(25).times(Decimal.pow(2.1, level)).floor(),
        getEffect: (level) => 1 - (level * 0.03),
        getEffectDisplay: (level) => `-${(level * 3).toFixed(0)}% Warp Cost`,
        icon: 'Gauge'
    },
    {
        id: 'phantom_progress',
        name: 'Phantom Progress',
        path: TALENT_CURRENCIES.FLUX,
        description: 'A fraction of offline production is applied instantly when you return.',
        maxLevel: 5,
        position: { x: 2.0, y: 3 },
        getCost: (level) => new Decimal(200).times(Decimal.pow(3, level)).floor(),
        getEffect: (level) => level * 0.05, // 5% instant catch-up per level
        getEffectDisplay: (level) => `${(level * 5).toFixed(0)}% Instant Catch-up`,
        icon: 'Sparkles'
    },
    {
        id: 'time_bubble',
        name: 'Time Bubble',
        path: TALENT_CURRENCIES.FLUX,
        description: 'First 5 minutes offline count more for warp.',
        maxLevel: 10,
        position: { x: 3.5, y: 3 },
        getCost: (level) => new Decimal(90).times(Decimal.pow(2.4, level)).floor(),
        getEffect: (level) => 1 + (level * 0.05),
        getEffectDisplay: (level) => `+${(level * 5).toFixed(0)}% Early Offline`,
        icon: 'CircleDot'
    },
    {
        id: 'lucid_dreaming',
        name: 'Lucid Dreaming',
        path: TALENT_CURRENCIES.FLUX,
        description: 'Generators continue to produce at a partial rate even without warping while offline.',
        maxLevel: 10,
        position: { x: 0.5, y: 5 },
        getCost: (level) => new Decimal(100).times(Decimal.pow(2.5, level)).floor(),
        getEffect: (level) => level * 0.03, // 3% per level (max 30% background production)
        getEffectDisplay: (level) => `${(level * 3).toFixed(0)}% Background`,
        icon: 'Moon'
    },
    {
        id: 'quick_warp',
        name: 'Quick Warp',
        path: TALENT_CURRENCIES.FLUX,
        description: 'Reduces minimum warp duration.',
        maxLevel: 10,
        position: { x: 2.0, y: 5 },
        getCost: (level) => new Decimal(95).times(Decimal.pow(2.3, level)).floor(),
        getEffect: (level) => Math.max(0.5, 1 - level * 0.05),
        getEffectDisplay: (level) => `${Math.max(0.5, 1 - level * 0.05).toFixed(1)}s Min Warp`,
        icon: 'FastForward'
    },
    {
        id: 'slumber',
        name: 'Slumber',
        path: TALENT_CURRENCIES.FLUX,
        description: 'Long offline sessions get a bonus multiplier.',
        maxLevel: 10,
        position: { x: 3.5, y: 5 },
        getCost: (level) => new Decimal(170).times(Decimal.pow(2.5, level)).floor(),
        getEffect: (level) => level * 0.03,
        getEffectDisplay: (level) => `+${(level * 3).toFixed(0)}% Long Session`,
        icon: 'Moon'
    },
    {
        id: 'deep_rest',
        name: 'Deep Rest',
        path: TALENT_CURRENCIES.FLUX,
        description: 'Increases the background production rate from Lucid Dreaming.',
        maxLevel: 10,
        position: { x: 0.5, y: 6 },
        getCost: (level) => new Decimal(150).times(Decimal.pow(2.5, level)).floor(),
        getEffect: (level) => level * 0.02, // +2% background per level (stacks)
        getEffectDisplay: (level) => `+${(level * 2).toFixed(0)}% Extra Background`,
        icon: 'BedDouble'
    },
    {
        id: 'stockpile',
        name: 'Stockpile',
        path: TALENT_CURRENCIES.FLUX,
        description: 'Increases base warp storage before Time Bank.',
        maxLevel: 10,
        position: { x: 2.0, y: 6 },
        getCost: (level) => new Decimal(190).times(Decimal.pow(2.5, level)).floor(),
        getEffect: (level) => 1 + (level * 0.05),
        getEffectDisplay: (level) => `+${(level * 5).toFixed(0)}% Base Storage`,
        icon: 'Package'
    },
    {
        id: 'void_walker',
        name: 'Void Walker',
        path: TALENT_CURRENCIES.FLUX,
        description: 'After 1h offline, warp efficiency increases.',
        maxLevel: 5,
        position: { x: 3.5, y: 6 },
        getCost: (level) => new Decimal(260).times(Decimal.pow(3, level)).floor(),
        getEffect: (level) => 1 + (level * 0.06),
        getEffectDisplay: (level) => `+${(level * 6).toFixed(0)}% After 1h`,
        icon: 'Footprints'
    },
    {
        id: 'dream_weaver',
        name: 'Dream Weaver',
        path: TALENT_CURRENCIES.FLUX,
        description: 'Offline time is slightly more effective for warping.',
        maxLevel: 5,
        position: { x: 0.0, y: 8 },
        getCost: (level) => new Decimal(250).times(Decimal.pow(3, level)).floor(),
        getEffect: (level) => 1 + (level * 0.04), // +4% offline→warp efficiency per level
        getEffectDisplay: (level) => `+${(level * 4).toFixed(0)}% Offline→Warp`,
        icon: 'CloudMoon'
    },
    {
        id: 'chrono_sync',
        name: 'Chrono Sync',
        path: TALENT_CURRENCIES.FLUX,
        description: 'Warp cap from Time Bank is increased further.',
        maxLevel: 5,
        position: { x: 1.3, y: 8 },
        getCost: (level) => new Decimal(280).times(Decimal.pow(3, level)).floor(),
        getEffect: (level) => 1 + (level * 0.08), // +8% extra cap per level
        getEffectDisplay: (level) => `+${(level * 8).toFixed(0)}% Extra Warp Cap`,
        icon: 'Timer'
    },
    {
        id: 'infinity_hold',
        name: 'Infinity Hold',
        path: TALENT_CURRENCIES.FLUX,
        description: 'Stored time above cap decays slower.',
        maxLevel: 5,
        position: { x: 2.7, y: 8 },
        getCost: (level) => new Decimal(290).times(Decimal.pow(3, level)).floor(),
        getEffect: (level) => 1 - (level * 0.1),
        getEffectDisplay: (level) => `-${(level * 10).toFixed(0)}% Overcap Decay`,
        icon: 'Infinity'
    },
    {
        id: 'time_echo',
        name: 'Time Echo',
        path: TALENT_CURRENCIES.FLUX,
        description: 'Increases the instant catch-up percentage from Phantom Progress.',
        maxLevel: 10,
        position: { x: 4.0, y: 8 },
        getCost: (level) => new Decimal(220).times(Decimal.pow(2.6, level)).floor(),
        getEffect: (level) => level * 0.03, // +3% instant per level (stacks)
        getEffectDisplay: (level) => `+${(level * 3).toFixed(0)}% Extra Catch-up`,
        icon: 'Repeat'
    },
    // --- HUB NODES (CROSS-LANE) ---
    {
        id: 'neural_sync',
        name: 'Neural Sync',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'Synchronizes your focus, granting a production bonus based on total Focus levels.',
        maxLevel: 10,
        position: { x: -2.0, y: 4 },
        getCost: (level) => new Decimal(100).times(Decimal.pow(2.5, level)).floor(),
        getEffect: (level) => level * 0.05,
        getEffectDisplay: (level) => `+${(level * 5).toFixed(0)}% per Focus level`,
        icon: 'Network'
    },
    {
        id: 'system_overdrive',
        name: 'System Overdrive',
        path: TALENT_CURRENCIES.FOCUS,
        description: 'Unlocks a powerful mode that triples production for 5s after gaining Focus.',
        maxLevel: 5,
        position: { x: -2.0, y: 7 },
        getCost: (level) => new Decimal(500).times(Decimal.pow(4, level)).floor(),
        getEffect: (level) => 3 + level,
        getEffectDisplay: (level) => `x${3 + level} Overdrive Boost`,
        icon: 'Zap'
    },
    {
        id: 'temporal_hub',
        name: 'Temporal Hub',
        path: TALENT_CURRENCIES.FLUX,
        description: 'Connects temporal pathways, increasing offline time generation.',
        maxLevel: 10,
        position: { x: 2.0, y: 4 },
        getCost: (level) => new Decimal(150).times(Decimal.pow(2.8, level)).floor(),
        getEffect: (level) => 1 + (level * 0.1),
        getEffectDisplay: (level) => `+${(level * 10).toFixed(0)}% Offline Time`,
        icon: 'Cpu'
    },
    {
        id: 'chrono_surge',
        name: 'Chrono Surge',
        path: TALENT_CURRENCIES.FLUX,
        description: 'A massive burst of Flux whenever you reach a production milestone.',
        maxLevel: 5,
        position: { x: 2.0, y: 7 },
        getCost: (level) => new Decimal(600).times(Decimal.pow(4.5, level)).floor(),
        getEffect: (level) => level * 2,
        getEffectDisplay: (level) => `+${level * 2} Flux on Milestone`,
        icon: 'Timer'
    }
];

/** Edges for the talent tree (from -> to). Use null for origin. */
export const TALENT_TREE_EDGES = [
    { from: null, to: 'active_resonance' },
    { from: null, to: 'temporal_dilation' },

    // --- FOCUS: 3 LANES ---
    { from: 'active_resonance', to: 'kinetic_clique' },
    { from: 'active_resonance', to: 'precision_burst' },
    { from: 'active_resonance', to: 'focus_flow' },

    // Tier 2 to Tier 3
    { from: 'kinetic_clique', to: 'focus_mastery' },
    { from: 'precision_burst', to: 'peak_performance' },
    { from: 'focus_flow', to: 'click_synergy' },

    // Tier 3 to Hub 1
    { from: 'focus_mastery', to: 'neural_sync' },
    { from: 'peak_performance', to: 'neural_sync' },
    { from: 'click_synergy', to: 'neural_sync' },

    // Hub 1 to Tier 4
    { from: 'neural_sync', to: 'focus_attunement' },
    { from: 'neural_sync', to: 'double_tap' },
    { from: 'neural_sync', to: 'mind_spike' },

    // Tier 4 to Tier 5
    { from: 'focus_attunement', to: 'resonance_peak' },
    { from: 'double_tap', to: 'sustained_surge' },
    { from: 'mind_spike', to: 'momentum' },

    // Tier 5 to Hub 2
    { from: 'resonance_peak', to: 'system_overdrive' },
    { from: 'sustained_surge', to: 'system_overdrive' },
    { from: 'momentum', to: 'system_overdrive' },

    // Hub 2 to Finals
    { from: 'system_overdrive', to: 'critical_focus' },
    { from: 'system_overdrive', to: 'overclock' },
    { from: 'system_overdrive', to: 'clarity_burst' },
    { from: 'system_overdrive', to: 'apex' },

    // --- FLUX: 3 LANES ---
    { from: 'temporal_dilation', to: 'flux_capacitor' },
    { from: 'temporal_dilation', to: 'time_bank' },
    { from: 'temporal_dilation', to: 'stasis' },

    // Tier 2 to Tier 3
    { from: 'flux_capacitor', to: 'warp_efficiency' },
    { from: 'time_bank', to: 'phantom_progress' },
    { from: 'stasis', to: 'time_bubble' },

    // Tier 3 to Hub 1
    { from: 'warp_efficiency', to: 'temporal_hub' },
    { from: 'phantom_progress', to: 'temporal_hub' },
    { from: 'time_bubble', to: 'temporal_hub' },

    // Hub 1 to Tier 4
    { from: 'temporal_hub', to: 'lucid_dreaming' },
    { from: 'temporal_hub', to: 'quick_warp' },
    { from: 'temporal_hub', to: 'slumber' },

    // Tier 4 to Tier 5
    { from: 'lucid_dreaming', to: 'deep_rest' },
    { from: 'quick_warp', to: 'stockpile' },
    { from: 'slumber', to: 'void_walker' },

    // Tier 5 to Hub 2
    { from: 'deep_rest', to: 'chrono_surge' },
    { from: 'stockpile', to: 'chrono_surge' },
    { from: 'void_walker', to: 'chrono_surge' },

    // Hub 2 to Finals
    { from: 'chrono_surge', to: 'dream_weaver' },
    { from: 'chrono_surge', to: 'chrono_sync' },
    { from: 'chrono_surge', to: 'infinity_hold' },
    { from: 'chrono_surge', to: 'time_echo' },
];
