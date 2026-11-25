import { viteBundler } from '@vuepress/bundler-vite'
import { themeDefault } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
    lang: 'en-US',
    title: 'hubble PWA Docs',
    description: 'Developer Documentation for hubble PWA',
    bundler: viteBundler(),
    userStyle: '.vuepress/styles/index.scss',
    theme: themeDefault({
        contributors: false,
        lastUpdated: false,
        nav: [
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
                    items: [
                        { link: '/pwa/what/overview' },
                        { link: '/pwa/what/techstack' },
                        { link: '/pwa/what/requirements' },
                        { link: '/pwa/what/installation' },
                        { link: '/pwa/what/migration-v3' },
                        { link: '/pwa/what/roadmap' },
                        { link: '/pwa/what/contact' },
                        { link: '/pwa/what/troubleshooting' },
                    ]
                },
                {
                    text: 'Architecture',
                    items: [
                        { link: '/pwa/architecture/shop-connection' },
                        { link: '/pwa/architecture/filebasedinheritance' },
                        { link: '/pwa/architecture/pages' },
                        { link: '/pwa/architecture/preinstalledmodules' },
                        { link: '/pwa/architecture/usersession' },
                        { link: '/pwa/architecture/layouts' },
                        { link: '/pwa/architecture/components' },
                    ]
                },
                {
                    text: 'Configuration',
                    link: '/pwa/configuration'
                },
                {
                    text: 'Theming',
                    items: [
                        { link: '/pwa/theme' }
                    ]
                },
                {
                    text: 'Shopware 6',
                    link: '/pwa/shopware',
                    items: [
                        { link: '/pwa/shopware/installation' },
                        { link: '/pwa/shopware/shopwareplugins' },
                        { link: '/pwa/shopware/shopwareemotion' },
                        { link: '/pwa/shopware/mulitlanguage' },
                        { link: '/pwa/shopware/trade-offs' },
                    ]
                },
                {
                    text: 'Module Development',
                    link: '/pwa/module/contributionpwa',
                    items: [
                        { link: '/pwa/module/contributionpwa' },
                        { link: '/pwa/module/tests' },
                        { link: '/pwa/module/codinguidelines' },
                        { link: '/pwa/module/apiclients' }
                    ]
                }
            ]
        },
    }),
})
