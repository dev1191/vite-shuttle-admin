import { h } from 'vue'
import { Icon } from '@iconify/vue'
import * as AntIcons from '@ant-design/icons-vue'
import { Space, Image, Button, Modal, Tag } from "ant-design-vue"
import i18n from '@/plugins/i18n'

const { t } = i18n.global

export function useRender() {



  function useRenderIcon(icon: string, props: Record<string, any> = {}) {
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


  function renderUserAvatar(image: string, fullname: string, phone?: string) {
    return h(
      Space,
      { align: 'center' },
      {
        default: () => [
          h(
            Image,
            {
              src: image,
              fallbackSrc: 'assets/images/fallback.png',
              width: 38,
              height: 38,
              objectFit: 'contain',
              showToolbar: false,
              style: { 'border-radius': '50%' },
            },
            {},
          ),
          h('p', {}, { default: () => fullname }),
          h('p', {}, { default: () => phone }),
        ],
      },
    )
  }


  function renderActionButton(icon: any, onClickAction: any) {
    return h(Button, {
      size: 'large',
      quaternary: true,
      circle: true,
      renderIcon: useRenderIcon(icon),
      onClick: onClickAction,
    })
  }

  function renderDeleteActionButton(
    confirmMessage: string,
    confirmAction: any,
  ) {
    return h(
      Modal.confirm,
      {
        onPositiveClick: confirmAction,
        positiveText: t('common.confirm'),
        negativeText: t('common.cancel'),
        negativeButtonProps: { ghost: true, type: 'tertiary' },
      },
      {
        trigger: () => renderActionButton(useRenderIcon('hugeicons:delete-02"', { size: '5px' }), () => null),
        default: () => confirmMessage,
      },
    )
  }

  function renderActionLabel(text: string, onClickAction: any) {
    return h('div', { onClick: onClickAction }, { default: () => text })
  }

  function renderTag(
    text: string,
    color: 'error' | 'default' | 'success' | 'warning' | 'primary' | 'info',
    stateEnum: any,
    typename: string,
    round = false,
    bordered = true,
  ) {
    return h(
      Tag,
      { color, bordered, round, size: 'small' },
      { default: () => t(`enums.${typename}.${stateEnum[text]}`) },
    )
  }


  return {
    useRenderIcon,
    renderUserAvatar,
    renderActionButton,
    renderDeleteActionButton,
    renderActionLabel,
    renderTag
  }


}