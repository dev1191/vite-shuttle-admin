import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import type { RouteRecordNormalized } from 'vue-router'
import { groupBy } from 'lodash-es';

export function useMenu(userRole: string) {

    const sidebarMenu = computed(() =>
        Object.values(
            groupBy(
                routes.map((c) => c.children[0]),
                "meta.drawerGroup"
            )
        )
            .map((rs) =>
                rs
                    .filter(
                        (r) => r.meta?.icon && (!r.meta?.roles)
                    )
                    .sort(
                        (a, b) => (a.meta?.drawerIndex ?? 99) - (b.meta?.drawerIndex ?? 98)
                    )
            )
            .reverse()
    );

    console.log("sidebarMenu", sidebarMenu.value)

    return {
        sidebarMenu
    }
}
