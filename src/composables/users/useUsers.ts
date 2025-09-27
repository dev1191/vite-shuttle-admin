import type { PaginatingParams } from "@/types";


const makePaginationRef = () =>
    ref<PaginatingParams>({
        page: 1,
        itemsPerPage: 10,
        globalSearch: '',
        sortBy: '',
        sortDesc: 'desc',
        range: { start: '', end: '' },
    })

export const useUsers = (options?: { pagination?: Ref<PaginatingParams> }) => {
    const isLoading = ref(false)
    const users = ref<User[]>([])

};