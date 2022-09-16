<br>

<img src="https://docs.hubblecommerce.io/assets/images/hubblelogo.svg" style="height:50px" />

# Headless E-Commerce Interface
> Progressive Web App for your online store based on [Nuxt.js](https://nuxtjs.org/)

## Disclaimer
This module is currently work in progress and not production ready. 
If you want to use a production ready version, please refer to the latest stable 1.x 
version.

## Roadmap
- [x] An open source project
- [x] Installable as a Nuxt.js Module (compatible with Nuxt 3)
- [x] File-based inheritance mechanism
- [x] Typescript Support
- [x] Linting config (for dev purposes only)
- [x] Tested (for dev purposes only)
- [x] Platform specific api clients
- [x] Usage of platform agnostic composables
- [x] Integration path for installing platform plugins / modules
- [x] Components as a toolset to build the shop interface
- [x] Included a famous CSS framework
- [x] SEO friendly interface
- [ ] Supports multiple e-commerce platforms
- [ ] Multi-language support 

## Development

- Create .env files in playground and __tests__/module/fixture
- Run `npm run dev:prepare` to generate type stubs.
- If there are any errors with symlinks after dev:prepare, reset / checkout files from git 
- Use `npm run dev` to start [playground](./playground) in development mode.
- Use `npm run dev:build` to build [playground](./playground) in production mode, then use `node playground/.output/server/index.mjs`
to start node server. Server is listening on http://0.0.0.0:3000/, so you can also access it via localhost:3000 if
you should get any CORS related errors. 
