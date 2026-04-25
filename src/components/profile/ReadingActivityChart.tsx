import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type ChartPoint = {
  label: string;
  pages: number;
};

type ReadingActivityChartProps = {
  data: ChartPoint[];
  emptyMessage: string;
  minTickGap?: number;
  className?: string;
};

const chartConfig: ChartConfig = {
  pages: {
    label: "Сторінок",
    color: "oklch(0.62 0.22 254)",
  },
};

const ReadingActivityChart = ({
  data,
  emptyMessage,
  minTickGap = 16,
  className,
}: ReadingActivityChartProps) => {
  const totalPages = data.reduce((sum, point) => sum + point.pages, 0);

  if (totalPages === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ChartContainer config={chartConfig} className={className}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={minTickGap}
        />
        <YAxis hide allowDecimals={false} />
        <ChartTooltip
          cursor={{ fill: "var(--accent)", opacity: 0.4 }}
          content={<ChartTooltipContent indicator="dot" hideLabel={false} />}
        />
        <Bar
          dataKey="pages"
          fill="var(--color-pages)"
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default ReadingActivityChart;
