"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, SortAsc, SortDesc } from "lucide-react";
import { cn } from "@/lib/utils";

interface FiltersProps {
  statuses: { id: number; status: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange: (filters: any) => void;
}

export function Filters({ statuses, onFilterChange }: FiltersProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [isDescending, setIsDescending] = useState(true);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const [sortBy, setSortBy] = useState("CreatedTime");
  // ✅ Gọi API khi state thay đổi
  useEffect(() => {
    handleFilterChange();
  }, [status, fromDate, toDate, isDescending]);

  // ✅ Debounce search input
  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      handleFilterChange();
    }, 300);
    return () => clearTimeout(searchTimeout.current);
  }, [search]);

  const handleFilterChange = () => {
    const updatedFilters = {
      searchValue: search,
      status: status
        ? Number.parseInt(status) == 0
          ? null
          : Number.parseInt(status)
        : undefined,
      fromDate: fromDate ? format(fromDate, "yyyy-MM-dd") : undefined,
      toDate: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
      isDescending,
      sortBy,
    };

    // ✅ Remove undefined values
    (Object.keys(updatedFilters) as (keyof typeof updatedFilters)[]).forEach(
      (key) => updatedFilters[key] === undefined && delete updatedFilters[key]
    );

    onFilterChange(updatedFilters);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 🔍 Search */}
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search topics, questions, name and more..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 📌 Status */}
        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status.id} value={status.id.toString()}>
                  {status.status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 📅 Date Range */}
        <div>
          <Label>Date Range</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate
                    ? new Date(fromDate).toLocaleDateString("vi-VN")
                    : "From date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate
                    ? new Date(toDate).toLocaleDateString("vi-VN")
                    : "To date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* 🔄 Sort Order */}
        <div>
          <Label>Sort Order</Label>
          <div className="flex gap-2">
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CreatedTime">Created Time</SelectItem>
                <SelectItem value="Topic">Topic</SelectItem>
                <SelectItem value="ViewCount">View Count</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="px-3"
              onClick={() => {
                setIsDescending(!isDescending);
                handleFilterChange();
              }}
            >
              {isDescending ? (
                <SortDesc className="h-4 w-4" />
              ) : (
                <SortAsc className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
