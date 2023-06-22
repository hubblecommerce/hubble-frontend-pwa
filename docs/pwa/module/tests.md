# Tests

## Integration Tests

For hubble PWA is a Nuxt 3 Module, it uses [@nuxt/test-utils](https://nuxt.com/docs/getting-started/testing) for 
testing. <br>
Test-related files are placed in `__tests__`
Run module integration tests:
```sh
npm run test:integration
```

::: warning
Don't forget to place a valid .env file into `__tests__/module/fixture`
:::

## End-To-End Tests

As long as Nuxt doesn't support tests that require a client or real browser, those are tested via 
[Cypress](https://www.cypress.io/).

Run module e2e tests:
```sh
npm run test:e2e
```
