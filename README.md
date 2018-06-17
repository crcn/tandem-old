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
WATCH=1 ONLY=bootstrap/build npm run setup-development; # only run bootstrap or build
WATCH=1 NO=build npm run setup-development; # do not run build
```
