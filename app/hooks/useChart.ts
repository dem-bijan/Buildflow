import { useEffect } from "react";

type ChartConfigFactory = () => any;

export function useChart(
    ref: React.RefObject<HTMLCanvasElement | null>,
    config: ChartConfigFactory,
    deps: unknown[]
) {
    useEffect(() => {
        if (typeof window === "undefined") return;

        const Chart = (window as any).Chart;
        if (!Chart || !ref.current) return;

        const instance = new Chart(ref.current, config());

        return () => instance.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}