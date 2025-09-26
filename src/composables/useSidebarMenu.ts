import type { IMenuItem } from '@/types/menu';
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
export function useSidebarMenu(role: string) {
    const { t } = useI18n()

    const defaultMenus: IMenuItem[] = [
        {
            key: `dashboard`,
            icon: useRenderIcon('hugeicons:home-13', { style: { fontSize: '24px' } }),
            label: t('menu.dashboard'),
            name: t('menu.dashboard'),
            path: `/${role}/dashboard`,
            namePath: [t('menu.dashboard')],
        },
        {
            key: `eagleEye`,
            icon: useRenderIcon('hugeicons:maps-global-01', { style: { fontSize: '24px' } }),
            label: t('menu.eagleEye'),
            name: t('menu.eagleEye'),
            path: `/${role}/eagle-eye`,
            namePath: [t('menu.eagleEye')],
        },
        {
            key: `manage-users`,
            icon: useRenderIcon('hugeicons:user-group', { style: { fontSize: '24px' } }),
            label: t('menu.manageUsers.title'),
            name: t('menu.manageUsers.title'),
            namePath: [t('menu.manageUsers.title')],
            children: [
                {
                    key: `users`,
                    label: t('menu.users'),
                    name: t('menu.users'),
                    path: `/${role}/manage-users/users`,
                    namePath: ['/[role]/manage-users/', '/[role]/manage-users/users/'],
                },
                {
                    key: `roles`,
                    label: t('menu.roles'),
                    name: t('menu.roles'),
                    path: `/${role}/manage-users/roles`,
                    namePath: ['/[role]/manage-users/', '/[role]/manage-users/roles/'],
                },
            ],
        },
        {
            key: `drivers`,
            icon: useRenderIcon('mdi:account-group', { style: { fontSize: '24px' } }),
            label: t('menu.manageDrivers.title'),
            name: t('menu.manageDrivers.title'),
            path: `/${role}/drivers`,
            namePath: [t('menu.manageDrivers.title')],
        },
        {
            key: `vehicles`,
            icon: useRenderIcon('hugeicons:bus-01', { style: { fontSize: '24px' } }),
            label: t('menu.vehicles.title'),
            name: t('menu.vehicles.title'),
            namePath: [t('menu.vehicles.title')],
            children: [
                {
                    key: `vehicles-busTypes`,
                    label: t('menu.vehicles.busTypes'),
                    name: t('menu.vehicles.busTypes'),
                    path: `/${role}/vehicles/bus-types`,
                    namePath: [t('menu.vehicles.title'), t('menu.vehicles.busTypes')],
                },
                {
                    key: `vehicles-busLayouts`,
                    label: t('menu.vehicles.busLayouts'),
                    name: t('menu.vehicles.busLayouts'),
                    path: `/${role}/vehicles/bus-layouts`,
                    namePath: [t('menu.vehicles.title'), t('menu.vehicles.busLayouts')],
                    children: [
                        {
                            key: `vehicles-createBusLayouts`,
                            label: t('menu.vehicles.create'),
                            name: t('menu.vehicles.create'),
                            path: `/${role}/vehicles/bus-layouts/create`,
                        },
                    ],
                },
                {
                    key: `vehicles-buses`,
                    label: t('menu.vehicles.buses'),
                    name: t('menu.vehicles.buses'),
                    path: `/${role}/vehicles/buses`,
                },
            ],
        },
        {
            key: `offers`,
            icon: useRenderIcon('hugeicons:coupon-percent', { style: { fontSize: '24px' } }),
            label: t('menu.offers'),
            name: t('menu.offers'),
            path: `/${role}/manage-offers`,
            namePath: [t('menu.offers')],
        },
        {
            key: `passes`,
            icon: useRenderIcon('hugeicons:scratch-card', { style: { fontSize: '24px' } }),
            label: t('menu.passes'),
            name: t('menu.passes'),
            path: `/${role}/manage-passes`,
            namePath: [t('menu.passes')],
        },
        {
            key: `helpAndSupport`,
            icon: useRenderIcon('hugeicons:customer-support', { style: { fontSize: '24px' } }),
            label: t('menu.helpAndSupport'),
            name: t('menu.helpAndSupport'),
            path: `/${role}/help-and-supports`,
            namePath: [t('menu.helpAndSupport')],
        },
        {
            key: `settings`,
            icon: useRenderIcon('hugeicons:dashboard-square-setting', { style: { fontSize: '24px' } }),
            label: t('menu.settings.title'),
            name: t('menu.settings.title'),
            namePath: [t('menu.settings.title')],
            children: [
                {
                    key: `settings-general`,
                    label: t('menu.settings.general'),
                    name: t('menu.settings.general'),
                    path: `/${role}/settings/general`,
                    namePath: [t('menu.settings.title'), t('menu.settings.general')],
                }
            ]
        },
    ];

    return { defaultMenus }
}
