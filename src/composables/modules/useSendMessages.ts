import { SendMessageService } from '@/common/api/sendMessage'



const { testMail } = SendMessageService;
export const useSendMessages = () => {
    const loadingEnable = ref(false)


    // 🔹 Send test mail
    const sendTestMail = async (payload: Partial<{ mail: string }>) => {
        try {
            loadingEnable.value = true
            const response = await testMail(payload)
            return response
        } catch (error) {
            console.error('Failed to send test mail:', error)
            throw error
        } finally {
            loadingEnable.value = false
        }
    }

    return {
        sendTestMail,
        loadingEnable
    }
}
