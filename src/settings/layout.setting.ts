/** Theme Style -- Style Algorithm */
export const themeAlgorithmOptions = [
    {
        label: 'setting.light',
        value: 'defaultAlgorithm',
    },
    {
        label: 'setting.dark',
        value: 'darkAlgorithm',
    },
    {
        label: 'setting.compact',
        value: 'compactAlgorithm',
    },
]

/** Menu Theme */
export const menuThemeOptions = [
    {
        label: 'setting.light',
        value: 'light',
    },
    {
        label: 'setting.dark',
        value: 'dark',
    },
]

/** Navigation Mode (Layout Type) */
export const layouts = [
    {
        label: 'setting.sidemenu',
        value: 'sidemenu',
    },
    {
        label: 'setting.topmenu',
        value: 'topmenu',
    },
    {
        label: 'setting.mixinmenu',
        value: 'mixinmenu',
    },
]

/** Theme Colors */
export const themeColors = [
    {
        title: 'settings.techBlue',
        key: 'techBlue',
        value: '#1677FF',
        tag: 'checkbox',
    },
    {
        title: 'settings.dust',
        key: 'dust',
        value: '#F5222D',
        tag: 'checkbox',
    },
    {
        title: 'settings.volcano',
        key: 'volcano',
        value: '#FA541C',
        tag: 'checkbox',
    },
    {
        title: 'settings.sunset',
        key: 'sunset',
        value: '#FAAD14',
        tag: 'checkbox',
    },
    {
        title: 'settings.cyan',
        key: 'cyan',
        value: '#13C2C2',
        tag: 'checkbox',
    },
    {
        title: 'settings.green',
        key: 'green',
        value: '#52C41A',
        tag: 'checkbox',
    },
    {
        title: 'settings.geekBlue',
        key: 'geekblue',
        value: '#2F54EB',
        tag: 'checkbox',
    },
    {
        title: 'settings.purple',
        key: 'purple',
        value: '#722ED1',
        tag: 'checkbox',
    },
    {
        title: 'settings.custom',
        key: 'custom',
        value: '',
        tag: 'input-color',
    },
]

/** Page Transition Animations */
export const animations = [
    {
        animation: 'back',
        name: 'setting.back',
        options: ['Down', 'Left', 'Right', 'Up'],
    },
    {
        animation: 'bounce',
        name: 'setting.bounce',
        options: ['Default', 'Down', 'Left', 'Right', 'Up'],
    },
    {
        animation: 'fade',
        name: 'setting.fade',
        options: [
            'Default',
            'Down',
            'DownBig',
            'Left',
            'LeftBig',
            'Right',
            'RightBig',
            'Up',
            'UpBig',
            'TopLeft',
            'TopRight',
            'BottomLeft',
            'BottomRight',
        ],
    },
    { animation: 'flip', name: 'setting.flip', options: ['X', 'Y'] },
    {
        animation: 'lightSpeed',
        name: 'setting.lightSpeed',
        options: ['Right', 'Left'],
    },
    {
        animation: 'rotate',
        name: 'setting.rotate',
        options: ['Default', 'DownLeft', 'DownRight', 'UpLeft', 'UpRight'],
    },
    { animation: 'roll', name: 'setting.roll', options: ['Default'] },
    {
        animation: 'zoom',
        name: 'setting.zoom',
        options: ['Default', 'Down', 'Left', 'Right', 'Up'],
    },
    {
        animation: 'slide',
        name: 'setting.slide',
        options: ['Down', 'Left', 'Right', 'Up'],
    },
]

/** Watermark Area */
export const watermarkAreaOptions = [
    {
        label: 'setting.allArea',
        value: 'all',
    },
    {
        label: 'setting.contentArea',
        value: 'content',
    },
]

/** Internationalization */
export const i18nSettings = [
    {
        label: 'languages.english',
        value: 'en-Us',
    },
    {
        label: 'languages.arabic',
        value: 'ar-SA',
    },
]

/** UI Display Settings */
export const uiSettings = [
    {
        label: 'setting.systemName',
        value: 'title',
        tag: 'input',
    },
    {
        label: 'setting.themeStyle',
        value: 'algorithm',
        tag: 'segmented',
        options: themeAlgorithmOptions,
    },
    {
        label: 'setting.menuTheme',
        value: 'menuTheme',
        tag: 'segmented',
        options: menuThemeOptions,
    },
    {
        label: 'setting.menuWidth',
        value: 'sidemenuWidth',
        tag: 'input-number',
        min: 200,
        max: 350,
        unit: 'unit.px',
    },
    {
        label: 'setting.navThemeFollowMenu',
        value: 'navThemeFollowMenu',
        tag: 'switch',
    },
    {
        label: 'setting.fullScreenContent',
        value: 'onlyShowContent',
        tag: 'switch',
    },
    {
        label: 'setting.grayMode',
        value: 'grayMode',
        tag: 'switch',
    },
    {
        label: 'setting.colorWeak',
        value: 'colorWeak',
        tag: 'switch',
    },
    {
        label: 'setting.logoTitle',
        value: 'showTitle',
        tag: 'switch',
    },
    {
        label: 'setting.header',
        value: 'showHeader',
        tag: 'switch',
    },
    {
        label: 'setting.footer',
        value: 'showFooter',
        tag: 'switch',
    },
    {
        label: 'setting.copyright',
        value: 'copyright',
        tag: 'input',
    },
    {
        label: 'setting.tabs',
        value: 'showTabs',
        tag: 'switch',
    },
    {
        label: 'setting.tabsIcon',
        value: 'tabsIcon',
        tag: 'switch',
    },
    {
        label: 'setting.cacheTabs',
        value: 'cacheTabs',
        tag: 'switch',
    },
    {
        label: 'setting.progress',
        value: 'showProgress',
        tag: 'switch',
    },
    {
        label: 'setting.breadcrumb',
        value: 'showBreadcrumb',
        tag: 'switch',
    },
    {
        label: 'setting.breadcrumbIcon',
        value: 'showBreadcrumbIcon',
        tag: 'switch',
    },
    {
        label: 'setting.locale',
        value: 'locale',
        tag: 'switch',
    },
    // {
    //   label: 'setting.language',
    //   value: 'language',
    //   tag: 'select',
    //   options: i18nSettings
    // },
    {
        label: 'setting.setting',
        value: 'showSetting',
        tag: 'switch',
    },
    {
        label: 'setting.fullscreen',
        value: 'showFullScreen',
        tag: 'switch',
    },
    {
        label: 'setting.searchMenu',
        value: 'showSearchMenu',
        tag: 'switch',
    },
    {
        label: 'setting.refreshReset',
        value: 'showRefreshReset',
        tag: 'switch',
    },
    {
        label: 'setting.lockScreen',
        value: 'showLockScreen',
        tag: 'switch',
    },
    {
        label: 'setting.lockScreenTime',
        value: 'lockScreenTime',
        tag: 'input-number',
        min: 1,
        max: 24,
        unit: 'unit.hours',
    },
    {
        label: 'setting.borderRadius',
        value: 'borderRadius',
        tag: 'input-number',
        min: 0,
        max: 20,
        unit: 'unit.px',
    },
    {
        label: 'setting.pageAnimation',
        value: 'showAnimation',
        tag: 'switch',
    },
    {
        label: 'setting.animation',
        value: 'animation',
        tag: 'select',
    },
    {
        label: 'setting.animationDirection',
        value: 'animationDirection',
        tag: 'select',
    },
    {
        label: 'setting.watermark',
        value: 'watermark',
        tag: 'switch',
    },
    {
        label: 'setting.watermarkArea',
        value: 'watermarkArea',
        tag: 'segmented',
        options: watermarkAreaOptions,
    },
    {
        label: 'setting.watermarkText',
        value: 'watermarkText',
        tag: 'input',
    },
]

/**
 * Algorithm
 * Default configuration
 * After modification, clear localStorage/sessionStorage for changes to take effect
 */
export const defaultSettings = {
    layout: 'sidemenu',
    title: 'Vite Shuttle Admin',
    copyright: 'IKUN❤ Studio',
    algorithm: 'defaultAlgorithm',
    menuTheme: 'light',
    sidemenuWidth: 270,
    navThemeFollowMenu: false,
    colorPrimary: '#2d6774',
    onlyShowContent: false,
    grayMode: false,
    colorWeak: false,
    showTitle: true,
    showHeader: true,
    showFooter: true,
    showBreadcrumb: true,
    showBreadcrumbIcon: true,
    locale: true,
    language: 'en-US',
    showSetting: true,
    showFullScreen: true,
    showSearchMenu: true,
    showClearCache: true,
    showRefreshReset: true,
    showLockScreen: true,
    lockScreenTime: 3, // Unit: hours
    showTabs: true,
    cacheTabs: true,
    tabsIcon: true,
    showProgress: true,
    borderRadius: 4,
    showAnimation: true,
    animation: 'back',
    animationDirection: 'Down',
    watermark: false,
    watermarkArea: 'all',
    watermarkText: '🐥 You are so beautiful 👶👶',
}
