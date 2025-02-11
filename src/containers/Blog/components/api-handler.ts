/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { BASE_URL } from "@/services/config"

export interface BlogFilters {
  fromDate?: string;
  toDate?: string;
  status?: string;
  isDescending: boolean;
  searchValue?: string;
  sortBy?: string;
  pageIndex: number;
  pageSize: number;
  blogTypeId?: string | null;
  week?: number; // Thêm thuộc tính week để sử dụng cho filter
}

export async function getBlogStatuses() {
  try {
    const response = await fetch(`${BASE_URL}/blog/get-status-handler?isAdminUpdate=false`)
    const data = await response.json()
    return data.isSuccessed ? data.resultObj : []
  } catch (error) {
    return []
  }
}

export async function getBlogsPaginated(filters: BlogFilters) {
  const queryParams = new URLSearchParams()

  if (filters.fromDate) queryParams.append("fromDate", filters.fromDate)
  if (filters.toDate) queryParams.append("toDate", filters.toDate)
  if (filters.status) queryParams.append("status", filters.status.toString())
  if (filters.isDescending !== undefined) queryParams.append("isDescending", filters.isDescending.toString())
  if (filters.searchValue) queryParams.append("searchValue", filters.searchValue)
  if (filters.sortBy) queryParams.append("SortBy", filters.sortBy)
  if (filters.blogTypeId) queryParams.append("blogTypeId", filters.blogTypeId.toString())
  // Thêm week nếu có
  if (filters.week !== undefined) queryParams.append("week", filters.week.toString())
  queryParams.append("pageIndex", filters.pageIndex.toString())
  queryParams.append("pageSize", filters.pageSize.toString())

  try {
    const response = await fetch(`${BASE_URL}/blog/get-by-week?${queryParams.toString()}`)
    const data = await response.json()
    return data
  } catch (error) {
    return {
      isSuccessed: false,
      resultObj: {
        items: [],
        totalItems: 0,
        currentPage: 1,
        totalPages: 0,
        pageSize: 10,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    }
  }
}

export async function getBlogsByType(filters: BlogFilters) {
  const queryParams = new URLSearchParams();

  if (filters.fromDate) queryParams.append("fromDate", filters.fromDate);
  if (filters.toDate) queryParams.append("toDate", filters.toDate);
  if (filters.status) queryParams.append("status", filters.status.toString());
  if (filters.isDescending !== undefined) queryParams.append("isDescending", filters.isDescending.toString());
  if (filters.searchValue) queryParams.append("searchValue", filters.searchValue);
  if (filters.sortBy) queryParams.append("SortBy", filters.sortBy);
  // Lưu ý: Dùng "BlogTypeId" (viết hoa B và T) để phù hợp với backend.
  if (filters.blogTypeId) queryParams.append("BlogTypeId", filters.blogTypeId.toString());
  // Thêm week nếu có
  if (filters.week !== undefined) queryParams.append("week", filters.week.toString());
  queryParams.append("pageIndex", filters.pageIndex.toString());
  queryParams.append("pageSize", filters.pageSize.toString());
  
  try {
    const response = await fetch(`${BASE_URL}/blog/get-by-week?${queryParams.toString()}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching blogs by type:", error);
    return {
      isSuccessed: false,
      resultObj: {
        items: [],
        totalItems: 0,
        currentPage: filters.pageIndex,
        totalPages: 0,
        pageSize: filters.pageSize,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };
  }
}