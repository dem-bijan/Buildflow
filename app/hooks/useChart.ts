import { useEffect } from "react";

type ChartConfigFactory = () => Record<string, unknown>;

export function useChart(
    ref: React.RefObject<HTMLCanvasElement | null>,
    config: ChartConfigFactory,
    deps: unknown[]
) {
    useEffect(() => {
        if (typeof window === "undefined") return;

        const Chart = (window as unknown as { Chart?: new (canvas: HTMLCanvasElement, config: unknown) => { destroy: () => void } }).Chart;
        if (!Chart || !ref.current) return;

        const instance = new Chart(ref.current, config());

        return () => instance.destroy();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}