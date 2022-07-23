# SolApps Application Registry
SolApps Application Registry is a package that allows any program to query for a list of applications in the Solana ecosytem. 

## Installation

```bash
npm install @solapps/application-registry
```

```bash
yarn add @solapps/application-registry
```

## Adding a new application
1. Find your applications primary directory in `./src/data/apps`.
2. Copy the example.toml file (`./src/data/apps/example.toml`) to this directory and rename it to `<your app name>.toml`.
3. Edit the `<your app name>.toml` file for your application.

For example, to add a new application called Raydium to the AMM category, we would copy the `example.toml` file to the `apps` folder and rename the copied file to `Raydium.toml`.

Alternatively you can contact the SolWorks team on [Discord](https://discord.com/invite/qfEGBPRyUt) or [Twitter](https://twitter.com/Solworks_) to request that your application be added to the registry.

## Building the registry
Do not edit `app-list.json`

```bash
npm run build
```