# Casino Jackpot

A slot machine game where players use credits to roll 3-block rows. Winning requires matching symbols, with server-side state management and dynamic “cheating” based on credits. It was built as a home assignment for a company.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

    .
    ├── apps
    │   ├── api                       # API for casino-jackpot app
    │   └── web                       # Web client for casino-jackpot app
    └── packages
        ├── @repo/api                 # Shared API resources.
        ├── @repo/eslint-config       # `eslint` configurations (includes `prettier`)
        ├── @repo/jest-config         # `jest` configurations
        └── @repo/typescript-config   # `tsconfig.json`s used throughout the monorepo


### Setup


```sh
# Installation
1. npm install turbo # to install dependencies
2. npm run init # to initialize the project

# Development
npm run dev # to start the app

# Production
1. # change the environment variables in the `.env` files
2. npm run build # to build the app
3. npm run start # to run the built version
```

### Commands

```sh
npm install turbo  # install dependencies
npm run dev        # start the app
npm run build      # build the app
npm run start      # run the built version
npm run format     # format the code
npm run lint       # lint the code
```
