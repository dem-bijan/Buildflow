"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

function generateMockTrends() {
    const data = [];
    const now = Date.now();
    const DAY_MS = 1000 * 60 * 60 * 24;
    let score = 0.8;

    for (let i = 29; i >= 0; i--) {
        const timestamp = now - i * DAY_MS;
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

export default function TrendChart({
    token,
    email,
}: {
    token?: string;
    email?: string;
}) {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const mockData = generateMockTrends();
        setData(mockData);
    }, []);

    if (data.length === 0) {
        return (
            <div className="w-full h-80 p-6 rounded-3xl dark:bg-surface-card-dark bg-surface-card border border-edge-default dark:border-edge-default-dark flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                <p className="text-xs font-medium text-content-muted-dark uppercase tracking-widest">Aggregating Trend Data</p>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface-raised-dark p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
                    <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">
                        {new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-content-primary-dark">{payload[0].value.toFixed(3)}</span>
                        <span className="text-xs font-medium text-content-muted-dark">metrics</span>
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
        <>
            {/* Inject global style to nuke all Recharts outlines/borders */}
            <style>{`
                .trend-chart-wrapper svg rect:first-child {
                    stroke: none !important;
                    fill: transparent !important;
                }
                .trend-chart-wrapper svg {
                    outline: none !important;
                    overflow: visible;
                }
                .trend-chart-wrapper *:focus {
                    outline: none !important;
                }
            `}</style>

            <div className="trend-chart-wrapper h-80 p-6 rounded-3xl dark:bg-surface-card-dark bg-surface-card border border-edge-default dark:border-edge-default-dark backdrop-blur-md relative group transition-all hover:border-accent-border-dark-hover outline-none">

                {/* Header */}
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-accent-950 border border-accent/20 text-accent-400">
                            <Activity className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-content-primary dark:text-content-primary-dark tracking-wide">QQchose here</h3>
                            <p className="text-[10px] font-medium text-content-muted dark:text-content-muted-dark uppercase tracking-widest mt-0.5">Another chose here</p>
                        </div>
                    </div>
                </div>

                {/* Chart Area */}
                <div className="w-full h-50 -ml-2">
                    <ResponsiveContainer width="100%" height="100%" style={{ outline: "none" }}>
                        <AreaChart
                            data={data}
                            tabIndex={-1}
                            style={{ outline: "none" }}
                            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#e2630a" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#e2630a" stopOpacity={0.0} />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="rgba(226,99,10,0.06)" />

                            <XAxis
                                dataKey="timestamp"
                                type="number"
                                scale="time"
                                domain={["dataMin", "dataMax"]}
                                stroke="#7a6e65"
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
                                stroke="#7a6e65"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => val.toFixed(1)}
                                dx={-10}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ stroke: "rgba(226,99,10,0.5)", strokeWidth: 1, strokeDasharray: "4 4" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="#e2630a"
                                strokeWidth={3}
                                fill="url(#accentGradient)"
                                activeDot={{
                                    r: 4,
                                    fill: "#e2630a",
                                    stroke: "#f5843a",
                                    strokeWidth: 2,
                                    style: { filter: "url(#glow)" },
                                }}
                                style={{ filter: "url(#glow)" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
}