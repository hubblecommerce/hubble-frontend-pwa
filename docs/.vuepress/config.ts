import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
    lang: 'en-US',
    title: 'hubble PWA Docs',
    description: 'Developer Documentation for hubble PWA',
    bundler: viteBundler(),
    theme: defaultTheme({
        contributors: false,
        lastUpdated: false,
        navbar: [
            { text: 'PWA', link: '/pwa/what/overview' },
            { text: 'Demo', link: 'https://hubble-pwa-demo.vercel.app/' },
            { text: 'Website', link: 'https://www.hubblecommerce.io/' },
            { text: 'Github', link: 'https://github.com/hubblecommerce/hubble-frontend-pwa/tree/hubble-next' },
        ],
        sidebar: {
            '/': [],
            '/pwa/': [
                {
                    text: 'What is hubble PWA?',
                    link: '',
                    children: [
                        '/pwa/what/overview',
                        '/pwa/what/techstack',
                        '/pwa/what/requirements',
                        '/pwa/what/installation',
                        '/pwa/what/migration-v3',
                        '/pwa/what/roadmap',
                        '/pwa/what/contact',
                        '/pwa/what/troubleshooting',
                    ]
                },
                {
                    text: 'Architecture',
                    children: [
                        '/pwa/architecture/shop-connection',
                        '/pwa/architecture/filebasedinheritance',
                        '/pwa/architecture/pages',
                        '/pwa/architecture/preinstalledmodules',
                        '/pwa/architecture/usersession',
                        '/pwa/architecture/layouts',
                        '/pwa/architecture/components',
                    ]
                },
                {
                    text: 'Configuration',
                    link: '/pwa/configuration'
                },
                {
                    text: 'Theming',
                    children: [
                        '/pwa/theme'
                    ]
                },
                {
                    text: 'Shopware 6',
                    link: '/pwa/shopware',
                    children: [
                        '/pwa/shopware/installation',
                        '/pwa/shopware/shopwareplugins',
                        '/pwa/shopware/shopwareemotion',
                        '/pwa/shopware/mulitlanguage',
                        '/pwa/shopware/trade-offs',
                    ]
                },
                {
                    text: 'Module Development',
                    link: '/pwa/module/contributionpwa',
                    children: [
                        '/pwa/module/contributionpwa',
                        '/pwa/module/tests',
                        '/pwa/module/codinguidelines',
                        '/pwa/module/apiclients'
                    ]
                }
            ]
        },
    }),
})
