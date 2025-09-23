import { h } from 'vue'
import { Icon } from '@iconify/vue'
import * as AntIcons from '@ant-design/icons-vue'

/**
 * Composable for rendering either Iconify or Ant Design Vue icons
 * @param icon - Icon name (e.g., 'mdi:home', 'ep:setting', 'DashboardOutlined')
 * @param props - Optional props for <Icon /> or AntD icon component
 * @returns Render function (VNode)
 */
export function useRenderIcon(icon: string, props: Record<string, any> = {}) {
  return () => {
    // If the icon string contains ":" → assume it's an Iconify icon
    if (icon.includes(':')) {
      return h(Icon, { icon, ...props })
    }

    // Otherwise, try Ant Design Vue icons
    const AntIcon = (AntIcons as any)[icon]
    if (AntIcon) {
      return h(AntIcon, { ...props })
    }

    console.warn(`[useRenderIcon] Icon "${icon}" not found in Iconify or Ant Design Vue.`)
    return null
  }
}
