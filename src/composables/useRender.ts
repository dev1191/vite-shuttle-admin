import { h } from 'vue'
import { Icon } from '@iconify/vue'

/**
 * Composable for rendering Iconify icons
 * @param icon - Iconify icon name (e.g. 'mdi:home', 'ep:setting')
 * @param props - Optional props for <Icon /> (width, height, color, etc.)
 * @returns Render function (VNode)
 */
export function useRenderIcon(icon: string, props: Record<string, any> = {}) {
    return () => h(Icon, { icon, ...props })
}
