/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Filters } from "@/containers/Growth-Chart/_components/filter";
import {
  getGrowthChartsPaginated,
  getGrowthChartStatuses,
} from "@/containers/Growth-Chart/_components/api-handler";
import { GrowthChartCard } from "@/containers/Growth-Chart/_components/growth-chart-card";

const PAGE_SIZE = 10;

export default function GrowthChart() {
  const [charts, setCharts] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    pageIndex: 1,
    pageSize: PAGE_SIZE,
    isDescending: true,
    status: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const loadStatuses = async () => {
      const data = await getGrowthChartStatuses();
      setStatuses(data);
    };
    loadStatuses();
  }, []);

  useEffect(() => {
    const loadCharts = async () => {
      setLoading(true);
      try {
        const result = await getGrowthChartsPaginated(filters);
        if (result.isSuccessed) {
          if (filters.pageIndex === 1) {
            setCharts(result.resultObj.items);
          } else {
            setCharts((prev) => [...prev, ...result.resultObj.items]);
          }
          setHasMore(result.resultObj.hasNextPage);
        }
      } finally {
        setLoading(false);
      }
    };
    loadCharts();
  }, [filters]);

  const handleFilterChange = (newFilters: any) => {
    // Create a new filters object with all properties
    const updatedFilters = {
      ...filters, // Keep existing filters
      ...newFilters, // Add new filters
      pageIndex: 1, // Reset to first page when filters change
      pageSize: PAGE_SIZE, // Maintain page size
    };

    // Remove undefined values to keep the query params clean
    Object.keys(updatedFilters).forEach(
      (key) => updatedFilters[key] === undefined && delete updatedFilters[key]
    );

    setFilters(updatedFilters);
  };
  const loadMore = () => {
    setFilters((prev) => ({
      ...prev,
      pageIndex: prev.pageIndex + 1,
    }));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Growth Charts</h1>
        <p className="text-muted-foreground">
          Browse and search through shared growth charts
        </p>
      </div>

      <Filters statuses={statuses} onFilterChange={handleFilterChange} />

      <div className="grid gap-4">
        {charts.map((chart) => (
          <GrowthChartCard key={chart.id} chart={chart} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {!loading && hasMore && (
        <div className="flex justify-center">
          <Button onClick={loadMore} variant="outline">
            Load More
          </Button>
        </div>
      )}

      {!loading && charts.length === 0 && (
        <div className="text-center text-muted-foreground py-10">
          No growth charts found
        </div>
      )}
    </div>
  );
}
