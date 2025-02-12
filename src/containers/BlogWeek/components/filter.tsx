

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

// Nếu chưa có, định nghĩa interface cho BlogType
export interface BlogType {
  id: number;
  name: string;
  description: string;
  thumbnail: string | null;
}

interface FiltersProps {
  onFilterChange: (filters: any) => void;
  initialWeek?: string; // Nếu có giá trị từ URL (ví dụ "5")
  blogTypes: BlogType[];
}

export function BlogFilters({ onFilterChange, initialWeek, blogTypes }: FiltersProps) {
  const [search, setSearch] = useState("");
  // State cho week: "0" đại diện cho All Week, các giá trị khác từ "1" tới "52"
  const [week, setWeek] = useState<string | undefined>(initialWeek || "0");
  // State cho blog type: "0" đại diện cho All Blog Type, hoặc giá trị id (dạng string) của blog type
  const [blogType, setBlogType] = useState<string | undefined>("0");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [isDescending, setIsDescending] = useState(true);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const [sortBy, setSortBy] = useState("CreatedTime");

  // Khi prop initialWeek thay đổi, cập nhật state week
  useEffect(() => {
    setWeek(initialWeek || "0");
  }, [initialWeek]);

  // Gọi filter mỗi khi các giá trị thay đổi (bao gồm week và blogType)
  useEffect(() => {
    handleFilterChange();
  }, [week, blogType, fromDate, toDate, isDescending, sortBy]);

  // Debounce cho search input
  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      handleFilterChange();
    }, 300);
    return () => clearTimeout(searchTimeout.current);
  }, [search]);

  const handleFilterChange = () => {
    const updatedFilters: any = {
      searchValue: search,
      // Nếu week có giá trị và khác "0" (All Week) thì chuyển về số, ngược lại không gửi param week
      week: week && week !== "0" ? Number(week) : undefined,
      // Nếu blogType có giá trị và khác "0" (All) thì chuyển về số, ngược lại không gửi param blogTypeId
      blogTypeId: blogType && blogType !== "0" ? Number(blogType) : undefined,
      fromDate: fromDate ? format(fromDate, "yyyy-MM-dd") : undefined,
      toDate: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
      isDescending,
      sortBy,
    };

    // Loại bỏ các key có giá trị undefined
    Object.keys(updatedFilters).forEach(
      (key) => updatedFilters[key] === undefined && delete updatedFilters[key]
    );

    onFilterChange(updatedFilters);
  };

  return (
    <div className="space-y-4">
      {/* Sử dụng grid với 5 cột cho các filter: Search, Blog Type, Week, Date Range, Sort Order */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

        {/* 🏷 Blog Type Filter */}
        <div>
          <Label>Blog Type</Label>
          <Select value={blogType} onValueChange={setBlogType}>
            <SelectTrigger>
              <SelectValue placeholder="Select blog type" />
            </SelectTrigger>
            <SelectContent>
              {/* "0" đại diện cho All Blog Type */}
              <SelectItem value="0">All</SelectItem>
              {blogTypes.map((bt) => (
                <SelectItem key={bt.id} value={bt.id.toString()}>
                  {bt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 🏷 Week Filter */}
        <div>
          <Label>Week</Label>
          <Select value={week} onValueChange={setWeek}>
            <SelectTrigger>
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 52 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  Week {i + 1}
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