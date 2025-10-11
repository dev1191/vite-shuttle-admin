import { GatewayService } from "@/common/api/settings/gateways"
import type { Gateway } from "@/types"

const { fetchGateways, updateGateway } = GatewayService

export const useGateways = () => {
    const gateways = ref<Gateway[]>([])
    const isLoading = ref(false)

    const fetchAll = async () => {
        isLoading.value = true;
        try {

            const result = await fetchGateways()
            gateways.value = Array.isArray(result) ? result : [result]
            isLoading.value = false;
        } catch (error) {
            console.error('❌ Failed to fetch countries:', error)
            gateways.value = []
            isLoading.value = false;
        }
    }

    onMounted(() => fetchAll())

    const editGateway = async (site: string, payload: any) => {
        try {
            isLoading.value = true
            const response = await updateGateway(site, payload)
            fetchAll();
            return response
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }
    return {
        gateways,
        isLoading,
        editGateway

    }

}