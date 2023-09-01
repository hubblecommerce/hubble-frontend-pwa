# Troubleshooting

___
#### Error:
On app startup
`Cannot start nuxt:  Cannot find module 'pinia/dist/pinia.mjs'`

#### Workaround: <br>
Due to a vue compatibility issue, pinia is not installed properly by npm.
As a workaround you can create an alias in `nuxt.config.ts`:

```ts
alias: {
  pinia: '/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs'
}
```
___
