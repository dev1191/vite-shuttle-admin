import { defineStore } from "pinia";
import { defaultSettings, animations } from '@/settings/layout.setting'
import { theme as antdTheme } from 'ant-design-vue';


export const useLayoutSettingStore = defineStore(
    'layoutSetting',
    () => {
        const { locale } = useI18n()

        const layoutSetting = reactive({ ...defaultSettings })
        const theme = reactive({
            algorithm: antdTheme[layoutSetting.algorithm] || antdTheme.defaultAlgorithm,
            token: {
                colorPrimary: layoutSetting.colorPrimary,
                borderRadius: layoutSetting.borderRadius,

            },
            direction: layoutSetting.direction || 'ltr',

        })



        const changeNprogressBg = () => {
            const htmlDom = document.querySelector('html')
            htmlDom.style.setProperty('--nprogress-color', layoutSetting.colorPrimary)
        }

        // Set initial nprogress color
        onMounted(() => {
            changeNprogressBg()
        })

        watch(
            () => (layoutSetting),
            (newVal, oldVal) => {
                theme.algorithm = antdTheme[newVal.algorithm] || antdTheme.defaultAlgorithm
                theme.token.colorPrimary = newVal.colorPrimary
                theme.token.borderRadius = newVal.borderRadius

                console.log('Layout setting newVal:', newVal.language)
                console.log('Layout setting oldVal:', oldVal.language)
                locale.value = newVal.language
                layoutSetting.language = newVal.language
                if (locale.value === 'ar-SA') {
                    theme.direction = 'rtl'
                    layoutSetting.direction = 'rtl'
                } else {
                    theme.direction = 'ltr'
                    layoutSetting.direction = 'ltr'
                }

                if (newVal.direction !== oldVal.direction) {
                    theme.direction = layoutSetting.direction
                }

                changeNprogressBg()
            },
            { deep: true }
        )


        const border = computed(() => {
            let border = 'none'
            switch (layoutSetting.algorithm) {
                case 'defaultAlgorithm':
                case 'compactAlgorithm':
                    switch (layoutSetting.menuTheme) {
                        case 'light':
                            border = '1px solid #eee'
                            break
                        case 'dark':
                            switch (layoutSetting.navThemeFollowMenu) {
                                case true:
                                    border = '1px solid #001529'
                                    break
                                case false:
                                    border = '1px solid #eee'
                                    break
                                default:
                                    break
                            }
                            break
                        default:
                            break
                    }
                    break
                case 'darkAlgorithm':
                    break
                default:
                    break
            }
            return border
        })


        const titleColor = computed(() => {
            let titleColor = '#fff'
            switch (layoutSetting.layout) {
                case 'sidemenu':
                    switch (layoutSetting.algorithm) {
                        case 'defaultAlgorithm':
                        case 'compactAlgorithm':
                            switch (layoutSetting.menuTheme) {
                                case 'light':
                                    titleColor = '#000'
                                    break
                                case 'dark':
                                    break
                                default:
                                    break
                            }
                            break
                        case 'darkAlgorithm':
                            switch (layoutSetting.menuTheme) {
                                case 'light':
                                    break
                                case 'dark':
                                    break
                                default:
                                    break
                            }
                            break
                        default:
                            break
                    }
                    break
                case 'topmenu':
                    switch (layoutSetting.algorithm) {
                        case 'defaultAlgorithm':
                        case 'compactAlgorithm':
                            switch (layoutSetting.menuTheme) {
                                case 'light':
                                    titleColor = '#000'
                                    break
                                case 'dark':
                                    break
                                default:
                                    break
                            }
                            break
                        case 'darkAlgorithm':
                            switch (layoutSetting.menuTheme) {
                                case 'light':
                                    break
                                case 'dark':
                                    break
                                default:
                                    break
                            }
                            break
                        default:
                            break
                    }
                    break
                case 'mixinmenu':
                    switch (layoutSetting.algorithm) {
                        case 'defaultAlgorithm':
                        case 'compactAlgorithm':
                            switch (layoutSetting.menuTheme) {
                                case 'light':
                                    titleColor = '#000'
                                    break
                                case 'dark':
                                    switch (layoutSetting.navThemeFollowMenu) {
                                        case true:
                                            break
                                        case false:
                                            titleColor = '#000'
                                            break
                                        default:
                                            break
                                    }
                                    break
                                default:
                                    break
                            }
                            break
                        case 'darkAlgorithm':
                            switch (layoutSetting.menuTheme) {
                                case 'light':
                                    break
                                case 'dark':
                                    break
                                default:
                                    break
                            }
                            break
                        default:
                            break
                    }
                    break
                default:
                    break
            }
            return titleColor
        })


        const headerBackground = computed(() => {
            let headerBackground = '#fff'
            switch (layoutSetting.layout) {
                case 'sidemenu':
                    switch (layoutSetting.algorithm) {
                        case 'defaultAlgorithm':
                        case 'compactAlgorithm':
                            switch (layoutSetting.menuTheme) {
                                case 'light':
                                    break
                                case 'dark':
                                    switch (layoutSetting.navThemeFollowMenu) {
                                        case true:
                                            headerBackground = '#001529'
                                            break
                                        case false:
                                            break
                                        default:
                                            break
                                    }
                                    break
                                default:
                                    break
                            }
                            break
                        case 'darkAlgorithm':
                            switch (layoutSetting.menuTheme) {
                                case 'light':
                                    headerBackground = '#141414'
                                    break
                                case 'dark':
                                    headerBackground = '#001529'
                                    break
                                default:
                                    break
                            }
                            break
                        default:
                            break
                    }
                    break
                case 'topmenu':
                    switch (layoutSetting.algorithm) {
                        case 'defaultAlgorithm':
                        case 'compactAlgorithm':
                            switch (layoutSetting.menuTheme) {
                                case 'light':
                                    break
                                case 'dark':
                                    headerBackground = '#001529'
                                    break
                                default:
                                    break
                            }
                            break
                        case 'darkAlgorithm':
                            switch (layoutSetting.menuTheme) {
                                case 'light':
                                    headerBackground = '#141414'
                                    break
                                case 'dark':
                                    headerBackground = '#001529'
                                    break
                                default:
                                    break
                            }
                            break
                        default:
                            break
                    }
                    break
                case 'mixinmenu':
                    switch (layoutSetting.algorithm) {
                        case 'defaultAlgorithm':
                        case 'compactAlgorithm':
                            switch (layoutSetting.menuTheme) {
                                case 'light':
                                    break
                                case 'dark':
                                    switch (layoutSetting.navThemeFollowMenu) {
                                        case true:
                                            headerBackground = '#001529'
                                            break
                                        case false:
                                            break
                                        default:
                                            break
                                    }
                                    break
                                default:
                                    break
                            }
                            break
                        case 'darkAlgorithm':
                            switch (layoutSetting.menuTheme) {
                                case 'light':
                                    headerBackground = '#141414'
                                    break
                                case 'dark':
                                    headerBackground = '#001529'
                                    break
                                default:
                                    break
                            }
                            break
                        default:
                            break
                    }
                    break
                default:
                    break
            }
            return headerBackground
        })
        const headerColor = computed(() => (headerBackground.value === '#fff' ? '#000' : '#fff'))


        const updateLayoutSetting = (settings: Partial<typeof defaultSettings>) => {
            Object.assign(layoutSetting, settings)
        }


        return {
            layoutSetting,
            theme,
            border,
            titleColor,
            headerBackground,
            headerColor,
            updateLayoutSetting,

        }

    }, {
    persist: true
});
