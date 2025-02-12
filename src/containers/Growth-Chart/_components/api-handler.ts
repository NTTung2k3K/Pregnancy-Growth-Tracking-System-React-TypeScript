import { ROUTES } from "@/routes";
import { BASE_URL } from "@/services/config";
import { CookiesService } from "@/services/cookies.service";

interface GrowthChartFilters {
  fromDate?: string;
  sortBy?: string;
  toDate?: string;
  status?: number;
  isDescending?: boolean;
  searchValue?: string;
  pageIndex: number;
  pageSize: number;
}

export async function getGrowthChartStatuses() {
  try {
    const response = await fetch(
      `${BASE_URL}/growthchart/get-status-handler?isAdminUpdate=false`
    );
    const data = await response.json();
    return data.isSuccessed ? data.resultObj : [];
  } catch (error) {
    return [];
  }
}

export async function getGrowthChartsPaginated(filters: GrowthChartFilters) {
  const queryParams = new URLSearchParams();
  console.log(filters);

  if (filters.fromDate) queryParams.append("fromDate", filters.fromDate);
  if (filters.toDate) queryParams.append("toDate", filters.toDate);
  if (filters.status) queryParams.append("status", filters.status.toString());
  if (filters.isDescending !== undefined)
    queryParams.append("isDescending", filters.isDescending.toString());
  if (filters.searchValue)
    queryParams.append("searchValue", filters.searchValue);
  if (filters.sortBy) queryParams.append("SortBy", filters.sortBy);
  queryParams.append("pageIndex", filters.pageIndex.toString());
  queryParams.append("pageSize", filters.pageSize.toString());

  try {
    const response = await fetch(
      `${BASE_URL}/growthchart/get-growth-chart-pagination?${queryParams}`
    );
    const data = await response.json();
    return data;
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
    };
  }
}

export async function getMyGrowthChartsPaginated(filters: GrowthChartFilters) {
  const queryParams = new URLSearchParams();

  const userId = CookiesService.get();
  if (!userId) {
    window.location.href = ROUTES.HOME;
    return;
  }
  if (filters.fromDate) queryParams.append("fromDate", filters.fromDate);
  if (filters.toDate) queryParams.append("toDate", filters.toDate);
  if (filters.status) queryParams.append("status", filters.status.toString());
  if (filters.isDescending !== undefined)
    queryParams.append("isDescending", filters.isDescending.toString());
  if (filters.searchValue)
    queryParams.append("searchValue", filters.searchValue);
  if (filters.sortBy) queryParams.append("SortBy", filters.sortBy);
  queryParams.append("pageIndex", filters.pageIndex.toString());
  queryParams.append("pageSize", filters.pageSize.toString());
  queryParams.append("userId", userId);

  try {
    const response = await fetch(
      `${BASE_URL}/growthchart/get-my-growth-chart-pagination?${queryParams}`
    );
    const data = await response.json();
    return data;
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
    };
  }
}
