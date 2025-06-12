# Contribution Guide PWA

**1**: Create an issue: <br>
Every change to the code and every pull request must be assigned to an issue.
The issue ID created is required for the following steps.

**2**: [Fork](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo)
the [hubble Repository](https://github.com/hubblecommerce/hubble-frontend-pwa) with your Github account.

**3**: Install dependencies:
``` bash
npm install
```

**4**: Setup hubble for module development:
- Create .env files in playground and `__tests__/module/fixture`
- Run `npm run dev:prepare` to generate type stubs.
- Use `npm run dev` to start the playground in development mode.

**5**: Test production build:
- Use `npm run prepack` to bundle module source code 
- Use `npm run dev:build` to build the folder playground in production mode 
- Use `node playground/.output/server/index.mjs` to start node server

**6**: Tracking the original repository as a remote fork: <br>
This is especially important to keep the fork up to date to the original repository (upstream).
 ``` bash
git remote add --track main upstream https://github.com/hubblecommerce/hubble-frontend-pwa.git
git fetch upstream
 ```

**7**: Create a new branch for the issue based on the upstream main branch:
``` bash
git checkout -b issue#<NUM> upstream/main
```

**8**: Push changes to the code to the fork repository (specify issue ID):
``` bash
git add .
git commit -m "issue#<NUM> my detailed commit message"
git push -u origin issue#<NUM>
```

**9**: Create a Pull Request: <br>
Go to [Pull Requests](https://github.com/hubblecommerce/hubble-frontend-pwa/pulls).
You should see an automatic suggestion from Github to make a new pull request from the created branch `issue#<NUM>`
