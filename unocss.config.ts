import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetMini,
    presetTypography,
    presetWebFonts,
    transformerDirectives,
    transformerVariantGroup,
} from 'unocss'

export default defineConfig({
    // Include CSS files in the pipeline
    include: [/\.(vue|svelte|[jt]sx?|mdx?|astro|elm|php|phtml|html)($|\?)/],
    // Exclude node_modules but include CSS files
    exclude: [/node_modules/, /\.git/],

    shortcuts: [
        ['btn', 'px-4 py-1 rounded inline-block bg-teal-700 text-white cursor-pointer !outline-none hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
        ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
    ],
    presets: [
        presetMini({ dark: 'class' }),
        presetAttributify(),
        presetIcons({
            scale: 1.4,
        }),
        presetTypography(),
        presetWebFonts({
            fonts: {
                sans: 'Roboto',
                serif: 'DM Serif Display',
                mono: 'DM Mono',
            },
        }),
    ],
    transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
    ],
    safelist: 'prose prose-sm m-auto text-left'.split(' '),
    
    // Add CSS layers for better cascade control
    layers: {
        components: -1,
        default: 1,
        utilities: 1,
    },
})
