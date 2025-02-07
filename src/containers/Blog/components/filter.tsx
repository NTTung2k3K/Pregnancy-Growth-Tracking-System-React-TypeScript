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

interface BlogType {
  id: number;
  name: string;
  description: string;
  thumbnail: string | null;
}

interface FiltersProps {
  blogTypes: BlogType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  
  onFilterChange: (filters: any) => void;
}

export function BlogFilters({ blogTypes, onFilterChange }: FiltersProps) {
  const [search, setSearch] = useState("");
  const [blogType, setBlogType] = useState<string>("0"); // "0" sẽ tương đương với All
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [isDescending, setIsDescending] = useState(true);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const [sortBy, setSortBy] = useState("CreatedTime");

  // Gọi API filter khi các state liên quan thay đổi (trừ search đã được debounce)
  useEffect(() => {
    handleFilterChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogType, fromDate, toDate, isDescending, sortBy]);

  // Debounce search input
  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      handleFilterChange();
    }, 300);
    return () => clearTimeout(searchTimeout.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleFilterChange = () => {
    const updatedFilters: any = {
      searchValue: search,
      // Nếu blogType === "0" tức chọn All nên không truyền filter blogTypeId
      blogTypeId: blogType !== "0" ? Number(blogType) : undefined,
      fromDate: fromDate ? format(fromDate, "yyyy-MM-dd") : undefined,
      toDate: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
      isDescending,
      sortBy,
    };

    // Loại bỏ các giá trị undefined để query được gọn gàng
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
            placeholder="Search title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 🏷 Blog Type */}
        <div>
          <Label>Blog Type</Label>
          <Select value={blogType} onValueChange={setBlogType}>
            <SelectTrigger>
              <SelectValue placeholder="Select blog type" />
            </SelectTrigger>
            <SelectContent>
              {/* Giá trị "0" tương ứng với tất cả */}
              <SelectItem value="0">All</SelectItem>
              {blogTypes.map((bt) => (
                <SelectItem key={bt.id} value={bt.id.toString()}>
                  {bt.name}
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
                <Calendar mode="single" selected={fromDate} onSelect={setFromDate} />
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
                <Calendar mode="single" selected={toDate} onSelect={setToDate} />
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
                <SelectItem value="LikesCount">Like Count</SelectItem>
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