import { BASE_URL } from '@/services/config'
import axios from 'axios'

export interface SearchAppointmentByUserId {
    userId?: string;
    fromDate?: Date;
    toDate?: Date;
    status?: string;
    sortBy?: string;
    isDescending?: boolean;
    searchValue?: string;
    pageIndex?: number;
    pageSize?: number;
}
export const appointmentService = {
    getAppointments: async (params: SearchAppointmentByUserId) => {
        try {
            const response = await axios.get(`${BASE_URL}/appointments/get-pagination-by-user-id`, {
                params: {
                    userId: params.userId,
                    FromDate: params.fromDate?.toISOString().split('T')[0],
                    ToDate: params.toDate?.toISOString().split('T')[0],
                    Status: params.status !== 'ALL' ? params.status : undefined,
                    SortBy: params.sortBy,
                    IsDescending: params.isDescending,
                    SearchValue: params.searchValue,
                    PageIndex: params.pageIndex,
                    PageSize: params.pageSize
                }
            })
            return response.data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}
