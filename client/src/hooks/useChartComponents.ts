import { useMemo } from "react";

export interface ChartConfig {
  [key: string]: {
    label?: string;
    icon?: React.ComponentType;
    color?: string;
    theme?: Record<string, string>;
  };
}

export interface ChartDataPoint {
  [key: string]: any;
  name?: string;
  value?: number;
  label?: string;
}

export interface ChartProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  className?: string;
  children?: React.ReactNode;
}

export const CHART_THEMES = {
  light: "",
  dark: ".dark"
} as const;

export const DEFAULT_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))"
];

export function useChartComponents() {
  const generateChartConfig = useMemo(() => {
    return (keys: string[], customColors?: string[]): ChartConfig => {
      const config: ChartConfig = {};
      
      keys.forEach((key, index) => {
        config[key] = {
          label: key.charAt(0).toUpperCase() + key.slice(1),
          color: customColors?.[index] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
        };
      });
      
      return config;
    };
  }, []);

  const getChartColors = useMemo(() => {
    return (config: ChartConfig): string[] => {
      return Object.values(config).map(item => item.color || DEFAULT_COLORS[0]);
    };
  }, []);

  const formatChartData = useMemo(() => {
    return (data: any[], keyMapping: Record<string, string>): ChartDataPoint[] => {
      return data.map(item => {
        const formatted: ChartDataPoint = {};
        
        Object.entries(keyMapping).forEach(([originalKey, newKey]) => {
          formatted[newKey] = item[originalKey];
        });
        
        return formatted;
      });
    };
  }, []);

  const calculatePercentages = useMemo(() => {
    return (data: ChartDataPoint[], valueKey: string = 'value'): ChartDataPoint[] => {
      const total = data.reduce((sum, item) => sum + (item[valueKey] || 0), 0);
      
      return data.map(item => ({
        ...item,
        percentage: total > 0 ? ((item[valueKey] || 0) / total) * 100 : 0
      }));
    };
  }, []);

  const aggregateData = useMemo(() => {
    return (data: ChartDataPoint[], groupBy: string, valueKey: string = 'value'): ChartDataPoint[] => {
      const grouped = data.reduce((acc, item) => {
        const key = item[groupBy];
        if (!acc[key]) {
          acc[key] = { [groupBy]: key, [valueKey]: 0 };
        }
        acc[key][valueKey] += item[valueKey] || 0;
        return acc;
      }, {} as Record<string, ChartDataPoint>);
      
      return Object.values(grouped);
    };
  }, []);

  const sortChartData = useMemo(() => {
    return (data: ChartDataPoint[], sortKey: string, ascending: boolean = true): ChartDataPoint[] => {
      return [...data].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return ascending ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal);
        const bStr = String(bVal);
        return ascending ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    };
  }, []);

  const filterDataByRange = useMemo(() => {
    return (data: ChartDataPoint[], key: string, min: number, max: number): ChartDataPoint[] => {
      return data.filter(item => {
        const value = item[key];
        return typeof value === 'number' && value >= min && value <= max;
      });
    };
  }, []);

  const interpolateData = useMemo(() => {
    return (data: ChartDataPoint[], targetLength: number, xKey: string = 'x', yKey: string = 'y'): ChartDataPoint[] => {
      if (data.length === 0 || targetLength <= 0) return [];
      if (data.length >= targetLength) return data.slice(0, targetLength);

      const result: ChartDataPoint[] = [...data];
      const step = (data.length - 1) / (targetLength - 1);

      for (let i = data.length; i < targetLength; i++) {
        const index = i * step;
        const lowerIndex = Math.floor(index);
        const upperIndex = Math.ceil(index);
        const ratio = index - lowerIndex;

        if (upperIndex < data.length) {
          const lower = data[lowerIndex];
          const upper = data[upperIndex];
          
          result.push({
            ...lower,
            [xKey]: lower[xKey] + (upper[xKey] - lower[xKey]) * ratio,
            [yKey]: lower[yKey] + (upper[yKey] - lower[yKey]) * ratio
          });
        }
      }

      return result;
    };
  }, []);

  const createTrendline = useMemo(() => {
    return (data: ChartDataPoint[], xKey: string = 'x', yKey: string = 'y'): ChartDataPoint[] => {
      if (data.length < 2) return data;

      const n = data.length;
      const sumX = data.reduce((sum, item) => sum + item[xKey], 0);
      const sumY = data.reduce((sum, item) => sum + item[yKey], 0);
      const sumXY = data.reduce((sum, item) => sum + item[xKey] * item[yKey], 0);
      const sumXX = data.reduce((sum, item) => sum + item[xKey] * item[xKey], 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      return data.map(item => ({
        ...item,
        trend: slope * item[xKey] + intercept
      }));
    };
  }, []);

  return {
    // Utilities
    generateChartConfig,
    getChartColors,
    formatChartData,
    calculatePercentages,
    aggregateData,
    sortChartData,
    filterDataByRange,
    interpolateData,
    createTrendline,
    
    // Constants
    themes: CHART_THEMES,
    defaultColors: DEFAULT_COLORS,
  };
}