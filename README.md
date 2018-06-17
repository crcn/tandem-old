Tandem is a component editor designed for most web platforms. The editor is still pre-Alpha, but you can kick the tires around a bit by following the [development instructions below](#development).

## Development

To get started, first clone & install the repository:

```
git clone git@github.com:crcn/tandem.git;
cd tandem;
yarn install;
```

Next, run the `development` script:

```
npm run setup-development;
```

👆🏻 This script will install, link, and build all packages. Further usage for this script:

```
WATCH=1 ONLY=build/link npm run setup-development; # run only build & link scripts
WATCH=1 NO=install/link npm run setup-development; # do not run install or link scripts
```
