import { defineUserConfig, defaultTheme } from 'vuepress'

export default defineUserConfig({
    lang: 'en-US',
    title: 'hubble PWA Docs',
    description: 'Developer Documentation for hubble PWA',
    theme: defaultTheme({
        contributors: false,
        lastUpdated: false,
        navbar: [
            { text: 'PWA', link: '/pwa/what/overview' },
            { text: 'Demo', link: 'https://hubble-next.herokuapp.com/' },
            { text: 'Website', link: 'https://www.hubblecommerce.io/' },
            { text: 'Github', link: 'https://github.com/hubblecommerce/hubble-frontend-pwa/tree/hubble-next' },
        ],
        sidebar: {
            '/pwa/': [
                {
                    text: 'What is hubble PWA?',
                    link: '',
                    children: [
                        '/pwa/what/overview',
                        '/pwa/what/techstack',
                        '/pwa/what/requirements',
                        '/pwa/what/installation',
                        '/pwa/what/roadmap',
                        '/pwa/what/contact',
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
                    ]
                },
                {
                    text: 'Module Development',
                    link: '/pwa/module/contributionpwa',
                    children: [
                        '/pwa/module/contributionpwa',
                        '/pwa/module/codinguidelines',
                        '/pwa/module/apiclients'
                    ]
                }
            ]
        },
    }),
})
