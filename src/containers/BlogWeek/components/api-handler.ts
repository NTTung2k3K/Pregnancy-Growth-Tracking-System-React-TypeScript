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
    week?: number;
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
    queryParams.append("pageIndex", filters.pageIndex.toString())
    queryParams.append("pageSize", filters.pageSize.toString())

    try {
        const response = await fetch(`${BASE_URL}/blog/all-user-pagination?${queryParams}`)
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

export async function getBlogByWeek(filters: BlogFilters) {
  const queryParams = new URLSearchParams()

  if (filters.week !== undefined) {
    queryParams.append("week", filters.week.toString())
  }
    if (filters.fromDate) queryParams.append("fromDate", filters.fromDate)
    if (filters.toDate) queryParams.append("toDate", filters.toDate)
    if (filters.status) queryParams.append("status", filters.status.toString())
    if (filters.isDescending !== undefined) queryParams.append("isDescending", filters.isDescending.toString())
    if (filters.searchValue) queryParams.append("searchValue", filters.searchValue)
    if (filters.sortBy) queryParams.append("SortBy", filters.sortBy)
    if (filters.blogTypeId) queryParams.append("blogTypeId", filters.blogTypeId.toString())
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