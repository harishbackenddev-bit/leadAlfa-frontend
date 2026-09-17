import {
    ArrowUpRight,
    Check,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    CreditCard,
    DollarSign,
    Lock,
    Film,
    Minus,
    Play,
    Plus,
    Settings,
    Shield,
    Shuffle,
    Star,
    Video,
    Zap,
} from "lucide-react";

import { useMemo, useState } from "react";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const CFG_PACKAGES = [
    { id: "starter", name: "Starter Reel", duration: "15 sec", price: 1250, Icon: Play },
    { id: "standard", name: "Standard UGC Ad", duration: "30 sec", price: 1950, Icon: Film },
    { id: "deepdive", name: "Deep Dive Review", duration: "60 sec", price: 2850, Icon: Star },
];

const CFG_ADDONS = [
    {
        id: "raw",
        name: "Raw Footage",
        pct: 0.3,
        label: "+30%",
        description: "Receive all unedited clips, alternative angles, and behind-the-scenes content.",
        Icon: Video,
        hasQty: false,
    },
    {
        id: "paid",
        name: "30-Day Paid Usage Rights",
        pct: 0.4,
        label: "+40%",
        description: "Run creator content as paid ads across Meta, TikTok, and digital campaigns.",
        Icon: DollarSign,
        hasQty: false,
    },
    {
        id: "hooks",
        name: "Extra Hooks / Variations",
        pct: 0.25,
        label: "+25%",
        description: "Additional intro variations for A/B testing and performance optimization.",
        Icon: Shuffle,
        hasQty: true,
    },
];


function fmt(n: number) {
    return "R" + n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Campaignconfiguration({
    packageId,
    onPackageChange,
}: {
    packageId: string;
    onPackageChange: (id: string) => void;
}) {
    const cfgPkgId = packageId;
    const setCfgPkgId = onPackageChange;
    const [cfgQty, setCfgQty] = useState(1);
    const [cfgAddons, setCfgAddons] = useState<Set<string>>(new Set());
    const [cfgHooks, setCfgHooks] = useState(1);
    const [splitExpanded, setSplitExpanded] = useState(false);

    const cfgPkg = CFG_PACKAGES.find((p) => p.id === cfgPkgId)!;
    const cfgBase = cfgPkg.price * cfgQty;
    const cfgRaw = cfgAddons.has("raw") ? cfgPkg.price * cfgQty * 0.3 : 0;
    const cfgPaid = cfgAddons.has("paid") ? cfgPkg.price * cfgQty * 0.4 : 0;
    const cfgHooksCost = cfgAddons.has("hooks") ? cfgPkg.price * cfgQty * 0.25 * cfgHooks : 0;
    const cfgAddonsTotal = cfgRaw + cfgPaid + cfgHooksCost;
    const cfgSubtotal = cfgBase + cfgAddonsTotal;
    const cfgFee = cfgSubtotal * 0.05;
    const cfgTotal = cfgSubtotal + cfgFee;
    const cfgCreator = cfgSubtotal * 0.75;
    const cfgCreatrend = cfgFee + cfgSubtotal * 0.25;

    // function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    //     return (
    //         <button
    //             type="button"
    //             onClick={onChange}
    //             className={[
    //                 "relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0",
    //                 checked ? "bg-primary" : "bg-muted-foreground/25",
    //             ].join(" ")}
    //             aria-checked={checked}
    //             role="switch"
    //         >
    //             <span
    //                 className={[
    //                     "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300",
    //                     checked ? "translate-x-6" : "translate-x-0",
    //                 ].join(" ")}
    //             />
    //         </button>
    //     );
    // }

    function Toggle({
        checked,
        onChange,
    }: {
        checked: boolean;
        onChange: () => void;
    }) {
        return (
            <button
                type="button"
                onClick={onChange}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${checked
                    ? "bg-white"
                    : "bg-white/20"
                    }`}
            >
                <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all duration-300 ${checked
                        ? "translate-x-6 bg-[#0C7BB3]"
                        : "translate-x-0 bg-white"
                        }`}
                />
            </button>
        );
    }

    const toggleCfgAddon = (id: string) =>
        setCfgAddons((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    function Stepper({
        value,
        min,
        max,
        onChange,
    }: {
        value: number;
        min: number;
        max: number;
        onChange: (v: number) => void;
    }) {
        return (
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => onChange(Math.max(min, value - 1))}
                    disabled={value <= min}
                    className="w-7 h-7 rounded-lg bg-[#EAF3FB] flex items-center justify-center hover:bg-[#0c7bb3]/10 disabled:opacity-30 transition-colors"
                >
                    <Minus size={12} className="text-[#101727]" />
                </button>
                <span className="w-8 text-center font-black text-[#101727] text-sm">{value}</span>
                <button
                    type="button"
                    onClick={() => onChange(Math.min(max, value + 1))}
                    disabled={value >= max}
                    className="w-7 h-7 rounded-lg bg-[#EAF3FB] flex items-center justify-center hover:bg-[#0c7bb3]/10 disabled:opacity-30 transition-colors"
                >
                    <Plus size={12} className="text-[#101727]" />
                </button>
            </div>
        );
    }

    return (
        <>
            <section
                id="configurator"
                className="py-14 sm:py-20 lg:py-24 px-6 sm:px-8 lg:px-12 relative overflow-hidden"
                style={{
                    background: "linear-gradient(145deg, #0A6A99 0%, #0C7BB3 55%, #4EA3D1 100%)",
                }}
            >
                {/* Blobs */}
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
                    style={{ background: "#F5A6D6", filter: "blur(80px)", opacity: 0.15 }} />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
                    style={{ background: "#F5A6D6", filter: "blur(64px)", opacity: 0.12 }} />

                <div className="relative z-10 max-w-[1400px] mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 text-xs font-black px-4 py-1.5 rounded-full mb-5 tracking-wide uppercase"
                            style={{ background: "rgba(245,166,214,0.2)", color: "#F5A6D6", border: "1px solid rgba(245,166,214,0.3)" }}>
                            <Zap size={11} />
                            Interactive Pricing Calculator
                        </div>
                        <h2 className="text-[24px] sm:text-[36px] lg:text-[42px] font-bold text-white mb-3 leading-[1.25] sm:leading-[1.2] tracking-[-0.02em]">Customize Your Campaign</h2>
                        <p className="text-white/60 text-[15px] sm:text-[16px] leading-[1.8]">
                            Build your perfect UGC package with transparent pricing and flexible add-ons.
                        </p>
                    </div>

                    {/* 2-col layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

                        {/* ── LEFT PANEL ── */}
                        <div className="lg:col-span-3 space-y-5">

                            {/* Step 1 — Package */}
                            <div className="rounded-[20px] p-7 sm:p-8" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)" }}>
                                <div className="flex items-center gap-2 mb-5">
                                    <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#0c7bb3] text-xs font-black flex-shrink-0">1</span>
                                    <h3 className="font-black text-white text-base">Select a Core Video Tier</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {CFG_PACKAGES.map(({ id, name, duration, price, Icon }) => {
                                        const active = cfgPkgId === id;

                                        return (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => setCfgPkgId(id)}
                                                className={`
          relative rounded-3xl p-6 text-left transition-all duration-300
          border min-h-[170px]
          ${active
                                                        ? "bg-white border-white shadow-2xl scale-[1.02]"
                                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                                    }
        `}
                                            >
                                                {/* Selected Tick */}
                                                {active && (
                                                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#0C7BB3] flex items-center justify-center shadow-lg">
                                                        <Check size={14} className="text-white" />
                                                    </div>
                                                )}

                                                {/* Icon */}
                                                <div
                                                    className={`
            w-11 h-11 rounded-full flex items-center justify-center mb-5
            ${active
                                                            ? "bg-[#0C7BB3]"
                                                            : "bg-white/10"
                                                        }
          `}
                                                >
                                                    <Icon
                                                        size={18}
                                                        className={active ? "text-white" : "text-white/60"}
                                                    />
                                                </div>

                                                {/* Title */}
                                                {/* <h4
                                                    className={`
            font-black text-xl leading-tight mb-1
            ${active
                                                            ? "text-slate-800"
                                                            : "text-white"
                                                        }
          `}
                                                >
                                                    {name}
                                                </h4> */}

                                                <h4
                                                    className={`
    font-bold text-[18px] leading-none mb-1
    whitespace-nowrap overflow-hidden text-ellipsis
    ${active ? "text-slate-800" : "text-white"}
  `}
                                                >
                                                    {name}
                                                </h4>

                                                {/* Duration */}
                                                <p
                                                    className={`
            text-sm mb-4
            ${active
                                                            ? "text-slate-500"
                                                            : "text-white/60"
                                                        }
          `}
                                                >
                                                    {duration}
                                                </p>

                                                {/* Price */}
                                                <div
                                                    className={`
            text-3xl font-black
            ${active
                                                            ? "text-[#0C53A5]"
                                                            : "text-white"
                                                        }
          `}
                                                >
                                                    R{price.toLocaleString()}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Step 2 — Quantity */}
                            <div className="rounded-[20px] p-7 sm:p-8" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)" }}>
                                <div className="flex items-center gap-2 mb-5">
                                    {/* Step Badge: Changed bg to #F5A6D6 and text to dark/white depending on preference */}
                                    <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#0c7bb3] text-xs font-black flex-shrink-0">2</span>
                                    <h3 className="font-black text-white text-base">Select Quantity</h3>
                                    <span className="ml-auto text-white/50 text-xs font-bold">1 – 50 videos</span>
                                </div>

                                <div className="flex items-center gap-5">
                                    <input
                                        type="range"
                                        min={1}
                                        max={50}
                                        value={cfgQty}
                                        onChange={(e) => setCfgQty(Number(e.target.value))}
                                        className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                                        // accentColor changed to #F5A6D6 so the thumb matches the track
                                        style={{ accentColor: "#F5A6D6", background: `linear-gradient(to right, #F5A6D6 0%, #F5A6D6 ${((cfgQty - 1) / 49) * 100}%, rgba(255,255,255,0.2) ${((cfgQty - 1) / 49) * 100}%, rgba(255,255,255,0.2) 100%)` }}
                                    />
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <button type="button" onClick={() => setCfgQty(Math.max(1, cfgQty - 1))}
                                            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                            <Minus size={13} className="text-white" />
                                        </button>
                                        <span className="w-10 text-center font-black text-white text-lg">{cfgQty}</span>
                                        <button type="button" onClick={() => setCfgQty(Math.min(50, cfgQty + 1))}
                                            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                            <Plus size={13} className="text-white" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-3">
                                    <p className="text-white/45 text-xs font-semibold">
                                        R{cfgPkg.price.toLocaleString()} per video
                                    </p>
                                    <p className="text-white/70 text-xs font-black">
                                        {fmt(cfgBase)} total before boosters
                                    </p>
                                </div>
                            </div>
                            {/* Step 3 — Add-ons */}
                            <div className="rounded-[20px] p-7 sm:p-8" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)" }}>
                                <div className="flex items-center gap-2 mb-5">
                                    <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#0c7bb3] text-xs font-black flex-shrink-0">3</span>
                                    <h3 className="font-black text-white text-base">Campaign Boosters</h3>
                                </div>

                                <div className="space-y-3">
                                    {CFG_ADDONS.map(({ id, name, label, description, Icon, hasQty }) => {
                                        const on = cfgAddons.has(id);
                                        const cost = id === "hooks"
                                            ? cfgPkg.price * cfgQty * 0.25 * cfgHooks
                                            : cfgPkg.price * cfgQty * (id === "raw" ? 0.3 : 0.4);
                                        return (
                                            <div
                                                key={id}
                                                className={[
                                                    "rounded-2xl p-5 transition-all duration-200",
                                                    on ? "bg-white shadow-sm" : "hover:bg-white/5",
                                                ].join(" ")}
                                                style={on ? { border: "1px solid #ffffff" } : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                                            >
                                                <div className="flex items-start gap-4">
                                                    {/* Icon Box */}
                                                    <div className={[
                                                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                                                        on ? "bg-[#0c7bb3]/10" : "bg-white/10",
                                                    ].join(" ")}>
                                                        <Icon size={17} className={on ? "text-[#0c7bb3]" : "text-white/60"} />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <span className={`font-black text-sm ${on ? "text-[#0F172A]" : "text-white"}`}>{name}</span>
                                                            {label && (
                                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${on ? "bg-[#0c7bb3]/10 text-[#0c7bb3]" : "bg-white/15 text-white/70"}`}>{label}</span>
                                                            )}
                                                        </div>

                                                        <p className={`text-xs leading-relaxed ${on ? "text-[#475569]" : "text-white/45"}`}>{description}</p>

                                                        <p className={`text-xs font-bold mt-1.5 ${on ? "text-[#0c7bb3]" : "text-white/35"}`}>
                                                            {on ? `Adds ${fmt(cost)} to your quote` : `Would add ${fmt(cost)}`}
                                                        </p>

                                                        {on && hasQty && (
                                                            <div className="mt-3 flex w-fit flex-wrap items-center gap-3 rounded-lg bg-slate-50 p-2">
                                                                <span className="text-xs font-bold text-[#475569]">Number of hooks:</span>
                                                                <Stepper value={cfgHooks} min={1} max={10} onChange={setCfgHooks} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* FIXED INLINE TOGGLE SWITCH */}
                                                    <div className="flex-shrink-0 mt-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleCfgAddon(id)}
                                                            className={`
                                    relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full 
                                    p-0.5 transition-colors duration-200 ease-in-out focus:outline-none
                                    ${on ? 'bg-[#0c7bb3]' : 'bg-white/20'}
                                `}
                                                            style={on ? {} : { backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                                                        >
                                                            <span
                                                                className={`
                                        pointer-events-none inline-block h-5 w-5 transform rounded-full 
                                        bg-white shadow transition duration-200 ease-in-out
                                        ${on ? 'translate-x-5' : 'translate-x-0'}
                                    `}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT PANEL ── */}
                        <div className="lg:col-span-2">
                            <div className="rounded-[20px] overflow-hidden sticky top-6 shadow-2xl"
                                style={{ background: "rgba(255,255,255,0.97)", border: "1px solid rgba(255,255,255,0.3)" }}>

                                <div
                                    className="px-7 pt-6 pb-5"
                                    style={{
                                        background: "#0c7bb3",
                                    }}
                                >
                                    <div className="text-white/55 text-[10px] font-black tracking-widest uppercase mb-2">Your Live Quote</div>
                                    <div className="text-[32px] sm:text-5xl font-black text-white leading-none mb-2">{fmt(cfgTotal)}</div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-white/70 text-sm font-semibold">{cfgPkg.name}</span>
                                        <span className="text-white/30 text-sm">·</span>
                                        <span className="text-white/70 text-sm font-semibold">{cfgQty} video{cfgQty !== 1 ? "s" : ""}</span>
                                        {cfgAddons.size > 0 && (
                                            <span
                                                className="text-[10px] font-black px-2 py-0.5 rounded-full"
                                                style={{ background: "rgba(245,166,214,0.3)", color: "#F5A6D6" }}
                                            >
                                                +{cfgAddons.size} booster{cfgAddons.size !== 1 ? "s" : ""}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Breakdown table */}
                                <div className="p-5 sm:p-7 space-y-0 text-[#606977]">
                                    {[
                                        { label: "Base Package", value: fmt(cfgBase), sub: `R${cfgPkg.price.toLocaleString()} × ${cfgQty}` },
                                        { label: "Add-ons Total", value: cfgAddonsTotal > 0 ? fmt(cfgAddonsTotal) : "R0.00", highlight: cfgAddonsTotal > 0 },
                                    ].map(({ label, value, sub, highlight }) => (
                                        <div key={label} className="flex justify-between items-start py-3 border-b border-[#E2E8F0]">
                                            <div>
                                                <div className="text-sm font-bold text-[#101727]">{label}</div>
                                                {sub && <div className="text-xs text-[#606977] mt-0.5">{sub}</div>}
                                            </div>
                                            <span className={`font-black text-sm ${highlight ? "text-[#0c7bb3]" : "text-[#101727]"}`}>{value}</span>
                                        </div>
                                    ))}

                                    {/* Add-on detail rows */}
                                    {cfgAddons.size > 0 && (
                                        <div className="py-2 space-y-1.5 border-b border-[#E2E8F0]">
                                            {cfgRaw > 0 && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-[#606977] pl-3">↳ Raw Footage (30%)</span>
                                                    <span className="font-bold text-[#101727]">{fmt(cfgRaw)}</span>
                                                </div>
                                            )}
                                            {cfgPaid > 0 && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-[#606977] pl-3">↳ Paid Usage Rights (40%)</span>
                                                    <span className="font-bold text-[#101727]">{fmt(cfgPaid)}</span>
                                                </div>
                                            )}
                                            {cfgHooksCost > 0 && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-[#606977] pl-3">↳ Extra Hooks ×{cfgHooks} (25%)</span>
                                                    <span className="font-bold text-[#101727]">{fmt(cfgHooksCost)}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center py-3 border-b border-[#E2E8F0]">
                                        <span className="text-sm font-bold text-[#101727]">Subtotal</span>
                                        <span className="font-black text-[#101727]">{fmt(cfgSubtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-[#E2E8F0]">
                                        <span className="text-sm font-bold text-[#606977]">5% Service Fee</span>
                                        <span className="font-bold text-[#606977]">{fmt(cfgFee)}</span>
                                    </div>

                                    {/* Creator payout teaser */}
                                    <div className="rounded-xl px-4 py-3 mt-4 flex items-center justify-between" style={{ background: "rgba(34,197,94,0.08)" }}>
                                        <span className="text-xs font-bold text-emerald-700">Creator receives</span>
                                        <span className="text-sm font-black text-emerald-600">{fmt(cfgCreator)}</span>
                                    </div>

                                    {/* Expandable split */}
                                    <button
                                        type="button"
                                        onClick={() => setSplitExpanded(!splitExpanded)}
                                        className="w-full flex items-center justify-between py-3.5 text-sm font-black text-[#0c7bb3] hover:text-[#0A6A99] transition-colors mt-2"
                                    >
                                        <span>View Payment Split</span>
                                        {splitExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>

                                    {splitExpanded && (
                                        <div className="border-t border-[#E2E8F0] pt-5 pb-2">
                                            <div className="flex items-center justify-center mb-5">
                                                <ResponsiveContainer width={160} height={160}>
                                                    <PieChart>
                                                        <Pie
                                                            data={[
                                                                { name: "Creator (75%)", value: cfgCreator },
                                                                { name: "Creatrend", value: cfgCreatrend },
                                                            ]}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={45}
                                                            outerRadius={72}
                                                            dataKey="value"
                                                            startAngle={90}
                                                            endAngle={-270}
                                                            strokeWidth={0}
                                                        >
                                                            <Cell fill="#22c55e" />
                                                            <Cell fill="#0353A4" />
                                                        </Pie>
                                                        <Tooltip
                                                            formatter={(v) => fmt(Number(v))}
                                                            contentStyle={{ fontSize: 11, fontFamily: "Manrope", borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.15)" }}>
                                                    <div className="flex items-center justify-center gap-1.5 mb-1">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wide">Creator</span>
                                                    </div>
                                                    <div className="text-xl font-black text-emerald-600">{fmt(cfgCreator)}</div>
                                                    <div className="text-[10px] text-emerald-600/60 font-bold mt-0.5">75% of subtotal</div>
                                                </div>
                                                <div className="rounded-xl p-4 text-center bg-[#F3FAFE]" style={{ border: "1px solid rgba(3,83,164,0.12)" }}>
                                                    <div className="flex items-center justify-center gap-1.5 mb-1">
                                                        <span className="w-2 h-2 rounded-full bg-[#0c7bb3]" />
                                                        <span className="text-[10px] font-black text-[#0c7bb3] uppercase tracking-wide">Creatrend</span>
                                                    </div>
                                                    <div className="text-xl font-black text-[#0c7bb3]">{fmt(cfgCreatrend)}</div>
                                                    <div className="text-[10px] text-[#0c7bb3]/50 font-bold mt-0.5">25% + fee</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* CTAs */}
                                    <div className="space-y-3 mt-5">
                                        <button
                                            type="button"
                                            className="main-btn w-full px-1 gap-2 min-h-12 flex cursor-pointer items-center rounded-full text-[clamp(10px,calc(4.5vw_-_5px),16px)] tracking-tight sm:text-[16px] sm:tracking-normal font-medium whitespace-nowrap transition-all duration-300 hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c7bb3] focus-visible:ring-offset-2"
                                        >
                                            <span className="min-w-0 flex-1 pl-4 text-center">Explore Transparent Pricing Packages</span>
                                            <span className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-white/40 bg-[#1F8FC8]">
                                                <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            className="sec-btn w-full justify-center px-7 min-h-12 flex cursor-pointer items-center gap-2 rounded-full text-[clamp(10px,calc(5.6vw_-_7.5px),16px)] tracking-tight sm:text-[16px] sm:tracking-normal font-medium whitespace-nowrap transition-all duration-300 hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c7bb3] focus-visible:ring-offset-2"
                                        >
                                            Save Campaign Configuration
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section className="py-14 sm:py-20 lg:py-24 px-6 sm:px-8 lg:px-12 bg-white">
                <div className="max-w-[1240px] mx-auto">
                    {/* HEADER */}
                    <div className="text-center mb-16">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider mb-6"
                            style={{
                                background: "rgba(3,83,164,0.08)",
                                color: "#0353A4",
                                border: "1px solid rgba(3,83,164,0.15)",
                            }}
                        >
                            <Shield size={11} />
                            Powered by TradeSafe
                        </div>

                        <h2 className="text-[24px] sm:text-[36px] lg:text-[42px] font-bold mb-4 text-[#101727] leading-[1.25] sm:leading-[1.2] tracking-[-0.02em]">
                            Secure Escrow & Automated Creator Payments
                        </h2>

                        <p className="text-[15px] leading-[1.8] max-w-2xl mx-auto text-[#606977]">
                            Every rand is accounted for. Funds are held securely until content is
                            delivered, then split automatically.
                        </p>
                    </div>

                    {/* MAIN CARD */}
                    {/* <div className="bg-card border border-border rounded-[32px] p-8 lg:p-12 shadow-sm"> */}

                    {/* <div className="bg-card border border-border/20 rounded-[32px] p-8 lg:p-12 shadow-sm text-opacity-[0.2]"> */}
                    <div className="bg-white border border-black/20 rounded-[20px] p-7 sm:p-8 lg:p-12 shadow-sm">
                        {/* FLOW */}
                        <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-between gap-6 md:gap-4 mb-10 sm:mb-14">
                            {/* Content goes here */}
                            {[
                                {
                                    Icon: CreditCard,
                                    label: "Brand Pays",
                                    sub: "Secure checkout",
                                    color: "#0353A4",
                                    bg: "#EAF6FB",
                                },
                                {
                                    Icon: Lock,
                                    label: "Escrow",
                                    sub: "TradeSafe holds",
                                    color: "#EC4899",
                                    bg: "#FDF2F8",
                                },
                                {
                                    Icon: Settings,
                                    label: "Auto-Split",
                                    sub: "Instant distribution",
                                    color: "#16A34A",
                                    bg: "#ECFDF5",
                                },
                                {
                                    Icon: Zap,
                                    label: "5% Service Fee",
                                    sub: "Platform operations",
                                    color: "#D97706",
                                    bg: "#FFFBEB",
                                },
                            ].map(({ Icon, label, sub, color, bg }, i) => (
                                <div key={label} className="flex items-center">
                                    <div className="text-center">
                                        <div
                                            className="w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-3"
                                            style={{
                                                background: bg,
                                                borderColor: "rgba(0,0,0,0.05)",
                                            }}
                                        >
                                            <Icon size={20} color={color} />
                                        </div>

                                        <div className="font-bold text-sm text-[#101727]">
                                            {label}
                                        </div>

                                        <div className="text-xs text-[#606977]">
                                            {sub}
                                        </div>
                                    </div>

                                    {i < 3 && (
                                        <ChevronRight
                                            size={18}
                                            className="hidden md:block text-[#606977] mx-8"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* TITLE */}
                        <div className="text-center mb-8">
                            <h3 className="font-bold text-sm text-[#101727]">
                                How Your Payment is Distributed
                            </h3>
                        </div>

                        {/* CREATOR RATE */}
                        <div className="mb-3">
                            <div className="text-xs text-[#606977]">
                                Creator Rate:{" "}
                                <span className="font-semibold">
                                    {fmt(cfgSubtotal)}
                                </span>
                            </div>
                        </div>

                        {/* SPLIT BAR */}
                        <div className="overflow-hidden rounded-xl h-9 flex">
                            <div
                                className="bg-emerald-500 flex items-center justify-center"
                                style={{ width: "75%" }}
                            >
                                <span className="text-white font-black text-[10px] sm:text-xs">
                                    Creator 75%
                                </span>
                            </div>

                            <div
                                className="bg-[#0353A4] flex items-center justify-center"
                                style={{ width: "25%" }}
                            >
                                <span className="text-white font-black text-[10px] sm:text-xs">
                                    Platform 25%
                                </span>
                            </div>
                        </div>

                        {/* LEGEND */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 mb-8 text-xs text-[#606977]">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                {fmt(cfgSubtotal * 0.75)} to creator
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#0353A4]" />
                                {fmt(cfgSubtotal * 0.25)} platform margin
                            </div>
                        </div>

                        {/* PLUS */}
                        <div className="flex justify-center mb-8">
                            <div className="w-8 h-8 rounded-full bg-[#CCCCCC] border border-[#CCCCCC]/20 flex items-center justify-center">
                                <span className="font-black text-white">+</span>
                            </div>
                        </div>
                        {/* SERVICE FEE */}
                        <div className="mb-3">
                            <div className="text-xs text-[#606977]">
                                Brand Service Fee (added to your total)
                            </div>
                        </div>

                        <div className="h-9 rounded-xl bg-[#D9E7F7] flex items-center justify-center mb-3">
                            <span className="font-black text-[#0353A4] text-[10px] sm:text-xs">
                                5% Service Fee {fmt(cfgFee)}
                            </span>
                        </div>

                        <p className="text-xs text-[#606977] mb-8">
                            Covers escrow security, dispute resolution, creator vetting, and
                            platform operations.
                        </p>

                        {/* EQUALS */}
                        <div className="flex justify-center mb-8">
                            <div className="w-8 h-8 rounded-full bg-[#CCCCCC] border border-[#CCCCCC]/20 flex items-center justify-center">
                                <span className="font-black text-white">=</span>
                            </div>
                        </div>

                        {/* TOTAL */}
                        <div
                            className="rounded-2xl border p-6 mb-6"
                            style={{
                                background: "#F3FAFE",
                                borderColor: "#D7E8F4",
                            }}
                        >
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <div className="text-xs uppercase tracking-[0.15em] font-black text-[#0353A4]">
                                        Total Brand Pays
                                    </div>

                                    <div className="text-xs text-muted-foreground mt-1">
                                        {fmt(cfgSubtotal)} creator rate + {fmt(cfgFee)} service fee
                                    </div>
                                </div>

                                <div className="text-[32px] sm:text-5xl font-black text-[#0353A4]">
                                    {fmt(cfgSubtotal + cfgFee)}
                                </div>
                            </div>
                        </div>

                        {/* BOTTOM CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* CREATOR */}
                            <div
                                className="rounded-2xl p-6"
                                style={{
                                    background: "#F1FBF4",
                                    border: "1px solid #D8F0DE",
                                }}
                            >
                                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700 mb-2">
                                    Creator Receives
                                </div>

                                <div className="text-[28px] sm:text-4xl font-black text-emerald-600 mb-2">
                                    {fmt(cfgSubtotal * 0.75)}
                                </div>

                                <div className="text-xs text-emerald-700/70">
                                    75% of creator rate — paid instantly via TradeSafe
                                </div>
                            </div>

                            {/* PLATFORM */}
                            <div
                                className="rounded-2xl p-6"
                                style={{
                                    background: "#F3FAFE",
                                    border: "1px solid #D7E8F4",
                                }}
                            >
                                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0353A4] mb-2">
                                    Creatrend Receives
                                </div>

                                <div className="text-[28px] sm:text-4xl font-black text-[#0353A4] mb-2">
                                    {fmt(cfgSubtotal * 0.25 + cfgFee)}
                                </div>

                                <div className="text-xs text-[#0353A4]/70">
                                    25% platform margin + 5% brand service fee
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}