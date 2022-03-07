# jubilant-guacamole
barbars.ru bot

# About

Test web-game bot.

## Implementation details

Support multi-account settings.

All settings may be setted in config.json file

All actions with page have randomized timeout greater then 100ms, can be defined in config.json file.

# Installation

## Requirements
- nodejs min v16
- npm min v8
- TypeScript compiller min v4

## Configuration

TODO

## Build
run in root jubilant-guacamole directory for build:
```
npm install
npm run build
```

## Run
```
npm run go
```

## Tweaks and Tricks

You can workaround some unhandled bot bags or network errors by wrapping main bot script with external script like this:
```sh
while : do
    npm run go
    sleep 5
done
```

# Versions

# 1.0
Base realization of fight in towers

# 1.1
Base multi-account sequential bot runner manager added
