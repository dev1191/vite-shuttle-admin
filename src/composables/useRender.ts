import { h } from 'vue'
import { Icon } from '@iconify/vue'
import * as AntIcons from '@ant-design/icons-vue'
import { Space, Image, Button, Modal, Tag, Typography, Tooltip, Switch } from "ant-design-vue"
import i18n from '@/plugins/i18n'
const { Text, Paragraph, Title } = Typography

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

  function renderUserAvatar(
    image: string,
    email: string,
    phone?: string,
  ) {
    return h(
      Space,
      { align: 'start', size: 'middle' },
      {
        default: () => [
          // Avatar
          h(Image, {
            src: image,
            fallbackSrc: 'assets/images/fallback.png',
            width: 40,
            height: 40,
            style: {
              'border-radius': '50%',
              objectFit: 'cover',
            },
            preview: false,
          }),

          // Text details
          h('div', { style: { display: 'flex', flexDirection: 'column' } }, [
            h(Text, { type: 'secondary' }, { default: () => email }),
            phone ? h(Text, { type: 'secondary' }, { default: () => phone }) : null,
          ]),
        ],
      },
    )
  }


  function renderActionButton(icon: string, tooltip: string, onClickAction: any) {
    return h(
      Tooltip,
      { title: tooltip, placement: 'top' }, // Tooltip props
      {
        default: () =>
          h(
            Button,
            {
              size: 'large',
              type: 'link',
              onClick: onClickAction,
            },
            {
              icon: () => h(Icon, { icon, width: 18, height: 18 }),
            },
          ),
      },
    )
  }

  function renderDeleteActionButton(
    title: string,
    confirmMessage: string,
    confirmAction: () => void,
  ) {
    const handleClick = () => {
      Modal.confirm({
        title: title,
        centered: true,
        content: confirmMessage,
        cancelText: t('common.cancel'),
        okText: t('common.delete'),
        okType: 'danger',
        onOk: confirmAction,
      })
    }

    return h(
      Tooltip,
      { title: 'Delete' },
      {
        default: () =>
          h(
            Button,
            {
              type: 'text',
              size: 'large',
              shape: 'circle',
              danger: true,
              onClick: handleClick,
            },
            {
              icon: () => h(Icon, { icon: 'hugeicons:delete-02', width: 18, height: 18 }),
            },
          ),
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

  /**
  * Render a Switch button with tooltip
  * @param label Tooltip text
  * @param checked Boolean value for switch
  * @param onChange Callback for switch toggle
  */
  function renderSwitchButton(tooltip: string, checked: boolean, onChangeAction: any) {
    return h(
      Tooltip,
      { title: tooltip, placement: 'top' },
      {
        default: () =>
          h(Switch, {
            checked, // must be boolean
            checkedChildren: 'Active',
            unCheckedChildren: 'Inactive',
            onChange: onChangeAction, // correct AntDV event
          }),
      },
    )
  }


  return {
    useRenderIcon,
    renderUserAvatar,
    renderActionButton,
    renderDeleteActionButton,
    renderActionLabel,
    renderTag,
    renderSwitchButton
  }


}