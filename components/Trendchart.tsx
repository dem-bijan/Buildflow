"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import { TrendingDown, Activity } from "lucide-react";

// ---------------------------------------------------------------------------
// MOCK DATA GENERATOR
// Produces ~30 days of realistic-looking cumulative CO₂ data.
// Replace this entire block once the real API is wired up.
// ---------------------------------------------------------------------------
function generateMockTrends() {
    const data = [];
    const now = Date.now();
    const DAY_MS = 1000 * 60 * 60 * 24;
    let score = 0.8; // starting cumulative tons

    for (let i = 29; i >= 0; i--) {
        const timestamp = now - i * DAY_MS;
        // Small random daily increment (0.02 – 0.09 tons), with occasional dips to mimic user improvements
        const delta = Math.random() * 0.17 - 0.02 - (Math.random() < 0.2 ? 0.4 : 0);
        score = Math.max(0, score + delta);

        data.push({
            timestamp,
            score: parseFloat(score.toFixed(4)),
            displayDate: new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        });
    }
    return data;
}
// ---------------------------------------------------------------------------

export default function TrendChart({
    token,
    email,
}: {
    token?: string;
    email?: string;
}) {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        // -----------------------------------------------------------------------
        // TODO (Real backend – REST):
        //   Replace this block with an actual fetch call:
        //
        //   const res = await fetch("http://localhost:8080/api/CarbonFootprints/trends", {
        //       headers: { Authorization: `Bearer ${token}` },
        //   });
        //   const rawData = await res.json();
        //
        //   Then apply the date formatting + interpolation logic that was originally
        //   in fetchTrends() (see the original TrendChart component for reference).
        //   Trigger this fetch whenever `token` changes.
        // -----------------------------------------------------------------------
        const mockData = generateMockTrends();
        setData(mockData);
    }, [/* token */]); // 👈 swap [] for [token] once the real fetch is in place

    useEffect(() => {
        // -----------------------------------------------------------------------
        // TODO (Real backend – WebSocket):
        //   Uncomment and adapt this block to subscribe to live updates:
        //
        //   if (!email) return;
        //
        //   const stompClient = new Client({
        //       webSocketFactory: () => new SockJS("http://localhost:8080/websocket"),
        //       onConnect: () => {
        //           stompClient.subscribe(`/topic/updates/${email}`, (message) => {
        //               if (message.body === "REFETCH_TRENDS") fetchTrends();
        //           });
        //       },
        //   });
        //   stompClient.activate();
        //   return () => stompClient.deactivate();
        //
        //   Dependencies: install @stomp/stompjs + sockjs-client, then import:
        //     import { Client } from "@stomp/stompjs";
        //     import SockJS from "sockjs-client";
        // -----------------------------------------------------------------------
    }, [/* email */]); // 👈 swap [] for [email] once the real socket is in place

    // Loading state (kept identical to original)
    if (data.length === 0) {
        return (
            <div className="w-full h-[320px] p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Aggregating Trend Data</p>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0d1117]/95 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">
                        {new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white">{payload[0].value.toFixed(3)}</span>
                        <span className="text-xs font-medium text-slate-400">metrics</span>
                    </div>
                </div>
            );
        }
        return null;
    };
    const keyTicks = data
        .filter((d, i) => {
            if (i === 0 || i === data.length - 1) return false;
            const isPeak = d.score > data[i - 1].score && d.score > data[i + 1].score;
            const isTrough = d.score < data[i - 1].score && d.score < data[i + 1].score;
            return isPeak || isTrough;
        })
        .map(d => d.timestamp);
    return (
        <div className="h-[320px] p-6 rounded-3xl bg-linear-to-r from-red-200/30 to-transparent border border-white/5 backdrop-blur-md relative group transition-all hover:bg-red-500/5">

            {/* Header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-red-500/30 border border-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239, 68, 68,0.2)]">
                        <Activity className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-black tracking-wide">QQchose here</h3>
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">Another chose here</p>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="w-full h-[200px] -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#750000ff" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#750000ff" stopOpacity={0.0} />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="-3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,0,0,0.03)" />

                        <XAxis
                            dataKey="timestamp"
                            type="number"
                            scale="time"
                            domain={["dataMin", "dataMax"]}
                            stroke="black"
                            fontSize={10}
                            tickLine={false}
                            ticks={keyTicks}
                            axisLine={false}
                            dy={10}
                            tickFormatter={(unixTime) =>
                                new Date(unixTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            }
                        />
                        <YAxis
                            stroke="black"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => val.toFixed(1)}
                            dx={-10}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: "rgba(200, 0, 0, 0.856)", strokeWidth: 1, strokeDasharray: "4 4" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#950000ff"
                            strokeWidth={3}
                            fill="url(#emeraldGradient)"
                            activeDot={{
                                r: 4,
                                fill: "#950000ff",
                                stroke: "#950000ff",
                                strokeWidth: 2,
                                style: { filter: "url(#glow)" },
                            }}
                            style={{ filter: "url(#glow)" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}