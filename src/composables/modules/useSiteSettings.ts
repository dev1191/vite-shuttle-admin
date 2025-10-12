import { SiteSettingService } from "@/common/api/settings/siteSettings"

const { fetch, update } = SiteSettingService



export const useSiteSettings = () => {

    const item = ref<Record<string, any>>({})
    const isLoading = ref<boolean>(false)
    const fetchSetting = async (name: string) => {
        try {
            isLoading.value = true
            const result = await fetch(name);
            item.value = result as Record<string, any>;
        } catch (error) {
            console.error('❌ Failed to fetch settings:', error)
            item.value = {}
        } finally {
            isLoading.value = false
        }
    }


    const editSetting = async (name: string, payload: any) => {
        try {
            isLoading.value = true
            const response = await update(name, payload)
            return response
        } catch (error) {
            console.error('Failed to update country:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }


    return {
        fetchSetting,
        editSetting,
        item,
        isLoading

    }
}