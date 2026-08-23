import {
    Shield,
    CreditCard,
    Lock,
    Settings,
    Zap,
    ChevronRight,
    Play,
    Film,
    Star,
} from "lucide-react";


interface SecureEscrowProps {
    cfgPkgId: string;
    cfgQty: number;
    cfgAddons: Set<string>;
    cfgHooks: number;
    fmt: (n: number) => string;
}

const CFG_PACKAGES = [
    { id: "starter", name: "Starter TikTok / Reel", duration: "15 sec", price: 1250, Icon: Play },
    { id: "standard", name: "Standard UGC Ad", duration: "30 sec", price: 1950, Icon: Film },
    { id: "deepdive", name: "Deep Dive Review", duration: "60 sec", price: 2850, Icon: Star },
];

export default function SecureEscrow({
    cfgPkgId,
    cfgQty,
    cfgAddons,
    cfgHooks,
    fmt,
}: SecureEscrowProps) {
    const cfgPkg = CFG_PACKAGES.find((p) => p.id === cfgPkgId)!;

    const cfgBase = cfgPkg.price * cfgQty;

    const cfgRaw = cfgAddons.has("raw")
        ? cfgPkg.price * cfgQty * 0.3
        : 0;

    const cfgPaid = cfgAddons.has("paid")
        ? cfgPkg.price * cfgQty * 0.4
        : 0;

    const cfgHooksCost = cfgAddons.has("hooks")
        ? cfgPkg.price * cfgQty * 0.25 * cfgHooks
        : 0;

    const cfgAddonsTotal = cfgRaw + cfgPaid + cfgHooksCost;

    const cfgSubtotal = cfgBase + cfgAddonsTotal;

    const cfgFee = cfgSubtotal * 0.05;
    return (
        <section className="bg-white px-6 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="max-w-6xl mx-auto">
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
                        Powered by Flutterwave
                    </div>

                    <h2 className="text-[24px] sm:text-[36px] lg:text-[42px] font-bold leading-[1.25] sm:leading-[1.2] tracking-[-0.02em] text-[#101727] mb-4">
                        Secure Escrow & Automated Creator Payments
                    </h2>

                    <p className="text-[#606977] text-[15px] sm:text-[16px] leading-[1.8] max-w-2xl mx-auto">
                        Every rand is accounted for. Funds are held securely until content is
                        delivered, then split automatically.
                    </p>
                </div>

                {/* MAIN CARD */}
                <div className="bg-white border border-[#E2E8F0] rounded-[32px] p-6 sm:p-8 lg:p-12 shadow-sm">

                    {/* FLOW */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-14">

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
                                sub: "Flutterwave holds",
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
                            <span className="text-white font-black text-xs">
                                Creator 75%
                            </span>
                        </div>

                        <div
                            className="bg-[#0353A4] flex items-center justify-center"
                            style={{ width: "25%" }}
                        >
                            <span className="text-white font-black text-xs">
                                Platform 25%
                            </span>
                        </div>
                    </div>

                    {/* LEGEND */}
                    <div className="flex flex-wrap gap-6 mt-3 mb-8 text-xs">
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
                        <div className="w-8 h-8 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center">
                            <span className="font-black text-[#606977]">+</span>
                        </div>
                    </div>

                    {/* SERVICE FEE */}
                    <div className="mb-3">
                        <div className="text-xs text-[#606977]">
                            Brand Service Fee (added to your total)
                        </div>
                    </div>

                    <div className="h-9 rounded-xl bg-[#D9E7F7] flex items-center justify-center mb-3">
                        <span className="font-black text-[#0353A4] text-xs">
                            5% Service Fee {fmt(cfgFee)}
                        </span>
                    </div>

                    <p className="text-xs text-[#606977] mb-8">
                        Covers escrow security, dispute resolution, creator vetting, and
                        platform operations.
                    </p>

                    {/* EQUALS */}
                    <div className="flex justify-center mb-8">
                        <div className="w-8 h-8 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center">
                            <span className="font-black text-[#606977]">=</span>
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

                                <div className="text-xs text-[#606977] mt-1">
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
                                75% of creator rate — paid instantly via Flutterwave
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
    )
}
