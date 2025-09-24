import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
export function useSidebarMenu(role: string) {
    const { t } = useI18n()

    const items = reactive([
        {
            key: `${role}-dashboard`,
            icon: useRenderIcon('hugeicons:home-13', { style: { fontSize: '24px' } }),
            label: t('menu.dashboard'),
            title: t('menu.dashboard'),
            path: `/${role}/dashboard`,
        },
        {
            key: `${role}-users`,
            icon: useRenderIcon('hugeicons:user-group', { style: { fontSize: '24px' } }),
            label: t('menu.manageUsers.title'),
            title: t('menu.manageUsers.title'),
            children: [
                {
                    key: `${role}-users-lists`,
                    label: t('menu.users'),
                    title: t('menu.users'),
                    path: `/${role}/manage-users/users`,
                },
                {
                    key: `${role}-users-roles`,
                    label: t('menu.roles'),
                    title: t('menu.roles'),
                    path: `/${role}/manage-users/roles`,
                },
            ],
        },
        {
            key: `${role}-drivers`,
            icon: useRenderIcon('mdi:account-group', { style: { fontSize: '24px' } }),
            label: t('menu.manageDrivers.title'),
            title: t('menu.manageDrivers.title'),
            path: `/${role}/drivers`,
        },
        {
            key: `${role}-vehicles`,
            icon: useRenderIcon('hugeicons:bus-01', { style: { fontSize: '24px' } }),
            label: t('menu.vehicles'),
            title: t('menu.vehicles'),
            children: [
                {
                    key: `${role}-vehicles-busTypes`,
                    label: t('menu.busTypes'),
                    title: t('menu.busTypes'),
                    path: `/${role}/vehicles/bus-types`,
                },
                {
                    key: `${role}-vehicles-busLayouts`,
                    label: t('menu.busLayouts'),
                    title: t('menu.busLayouts'),
                    path: `/${role}/vehicles/bus-layouts`,
                    children: [
                        {
                            key: `${role}-vehicles-createBusLayouts`,
                            label: t('menu.createBusLayouts'),
                            title: t('menu.createBusLayouts'),
                            path: `/${role}/vehicles/bus-layouts/create`,
                        },
                    ],
                },
                {
                    key: `${role}-vehicles-buses`,
                    label: t('menu.buses'),
                    title: t('menu.buses'),
                    path: `/${role}/vehicles/buses`,
                },
            ],
        },
        {
            key: `${role}-settings`,
            icon: useRenderIcon('hugeicons:dashboard-square-setting', { style: { fontSize: '24px' } }),
            label: t('menu.settings.title'),
            title: t('menu.settings.title'),
            children: [
                {
                    key: `${role}-settings-general`,
                    label: t('menu.settings.general'),
                    title: t('menu.settings.general'),
                    path: `/${role}/settings/general`,
                }
            ]
        },
    ])

    return { items }
}
